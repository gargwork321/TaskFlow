import { open } from '@op-engineering/op-sqlite';
import type { DB, Scalar, Transaction } from '@op-engineering/op-sqlite';
import type { Task } from '../domain/Task';
import {
  TASK_PRIORITIES,
  TASK_SYNC_STATUSES,
} from '../constants/taskConstants';

const DATABASE_NAME = 'taskflow.db';
const SCHEMA_VERSION = 1;

let databasePromise: Promise<DB> | undefined;

const isTaskPriority = (value: string): value is Task['priority'] =>
  TASK_PRIORITIES.some(priority => priority === value);

const isTaskSyncStatus = (value: string): value is Task['syncStatus'] =>
  TASK_SYNC_STATUSES.some(status => status === value);

const taskFromRow = (row: Record<string, Scalar>): Task => {
  const {
    id,
    title,
    description,
    priority,
    is_completed: isCompleted,
    due_date: dueDate,
    created_at: createdAt,
    updated_at: updatedAt,
    sync_status: syncStatus,
    task_list: list,
    reminder,
    deleted_at: deletedAt,
  } = row;

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof priority !== 'string' ||
    !isTaskPriority(priority) ||
    (isCompleted !== 0 && isCompleted !== 1) ||
    typeof createdAt !== 'string' ||
    typeof updatedAt !== 'string' ||
    typeof syncStatus !== 'string' ||
    !isTaskSyncStatus(syncStatus) ||
    (description !== null && typeof description !== 'string') ||
    (dueDate !== null && typeof dueDate !== 'string') ||
    (list !== null && typeof list !== 'string') ||
    (reminder !== null && typeof reminder !== 'string') ||
    (deletedAt !== null && typeof deletedAt !== 'string')
  ) {
    throw new Error(
      `Invalid task row returned from SQLite for task ${String(id)}.`,
    );
  }

  return {
    id,
    title,
    priority,
    isCompleted: isCompleted === 1,
    createdAt,
    updatedAt,
    syncStatus,
    ...(description !== null && { description }),
    ...(dueDate !== null && { dueDate }),
    ...(list !== null && { list }),
    ...(reminder !== null && { reminder }),
    ...(deletedAt !== null && { deletedAt }),
  };
};

const taskValues = (task: Task): Scalar[] => [
  task.id,
  task.title,
  task.description ?? null,
  task.priority,
  task.isCompleted ? 1 : 0,
  task.dueDate ?? null,
  task.createdAt,
  task.updatedAt,
  task.syncStatus,
  task.list ?? null,
  task.reminder ?? null,
  task.deletedAt ?? null,
];

const insertTask = async (transaction: Transaction, task: Task) => {
  await transaction.execute(
    `INSERT INTO tasks (
      id, title, description, priority, is_completed, due_date, created_at,
      updated_at, sync_status, task_list, reminder, deleted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    taskValues(task),
  );
};

const updateTaskRow = async (transaction: Transaction, task: Task) => {
  const result = await transaction.execute(
    `UPDATE tasks SET
      title = ?, description = ?, priority = ?, is_completed = ?, due_date = ?,
      updated_at = ?, sync_status = ?, task_list = ?, reminder = ?, deleted_at = ?
    WHERE id = ? AND deleted_at IS NULL`,
    [
      task.title,
      task.description ?? null,
      task.priority,
      task.isCompleted ? 1 : 0,
      task.dueDate ?? null,
      task.updatedAt,
      task.syncStatus,
      task.list ?? null,
      task.reminder ?? null,
      task.deletedAt ?? null,
      task.id,
    ],
  );

  if (result.rowsAffected !== 1) {
    throw new Error(
      `Could not update task ${task.id}; it may no longer exist.`,
    );
  }
};

const createDatabase = async (seedTasks: Task[]): Promise<DB> => {
  const database = open({ name: DATABASE_NAME });

  try {
    const versionResult = await database.execute('PRAGMA user_version');
    const version = Number(versionResult.rows[0]?.user_version ?? 0);
    if (version > SCHEMA_VERSION) {
      throw new Error(
        `Task database version ${version} is newer than supported version ${SCHEMA_VERSION}.`,
      );
    }

    if (version === 0) {
      await database.transaction(async transaction => {
        await transaction.execute(`
          CREATE TABLE tasks (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
            is_completed INTEGER NOT NULL DEFAULT 0 CHECK (is_completed IN (0, 1)),
            due_date TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            sync_status TEXT NOT NULL CHECK (sync_status IN ('synced', 'pending', 'failed')),
            task_list TEXT,
            reminder TEXT,
            deleted_at TEXT
          )
        `);
        await transaction.execute(
          'CREATE INDEX tasks_active_updated_at_idx ON tasks (deleted_at, updated_at)',
        );
        await transaction.execute(`
          CREATE TABLE app_metadata (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
          )
        `);
        await transaction.execute(`PRAGMA user_version = ${SCHEMA_VERSION}`);
      });
    }

    const seedResult = await database.execute(
      'SELECT value FROM app_metadata WHERE key = ?',
      ['demo_tasks_seeded'],
    );
    if (seedResult.rows.length === 0) {
      await database.transaction(async transaction => {
        for (const task of [...seedTasks].reverse()) {
          await insertTask(transaction, task);
        }
        await transaction.execute(
          'INSERT INTO app_metadata (key, value) VALUES (?, ?)',
          ['demo_tasks_seeded', 'true'],
        );
      });
    }

    return database;
  } catch (error) {
    database.close();
    throw error;
  }
};

const getDatabase = (seedTasks: Task[]) => {
  if (!databasePromise) {
    const pendingDatabase = createDatabase(seedTasks);
    databasePromise = pendingDatabase;
    pendingDatabase.catch(() => {
      if (databasePromise === pendingDatabase) {
        databasePromise = undefined;
      }
    });
  }
  return databasePromise;
};

const loadTasks = async (database: DB): Promise<Task[]> => {
  const result = await database.execute(
    `SELECT * FROM tasks
     WHERE deleted_at IS NULL
     ORDER BY rowid DESC`,
  );
  return result.rows.map(taskFromRow);
};

export const initializeTasksDatabase = async (
  initialTasks: Task[],
): Promise<Task[]> => loadTasks(await getDatabase(initialTasks));

const requireDatabase = async (): Promise<DB> => {
  if (!databasePromise) {
    throw new Error('The task database has not been initialized.');
  }
  return databasePromise;
};

export const listTasks = async (): Promise<Task[]> =>
  loadTasks(await requireDatabase());

export const createTask = async (task: Task): Promise<void> => {
  const database = await requireDatabase();
  await database.transaction(async transaction => {
    await insertTask(transaction, { ...task, syncStatus: 'pending' });
  });
};

export const saveTask = async (task: Task): Promise<void> => {
  const database = await requireDatabase();
  await database.transaction(async transaction => {
    await updateTaskRow(transaction, {
      ...task,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    });
  });
};

export const updateTaskFields = async (
  taskId: string,
  updates: Partial<Task>,
): Promise<void> => {
  const database = await requireDatabase();
  await database.transaction(async transaction => {
    const result = await transaction.execute(
      'SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL',
      [taskId],
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error(`Could not find task ${taskId} to update.`);
    }

    const task = taskFromRow(row);
    await updateTaskRow(transaction, {
      ...task,
      ...updates,
      id: task.id,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    });
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const database = await requireDatabase();
  const now = new Date().toISOString();
  await database.transaction(async transaction => {
    const result = await transaction.execute(
      `UPDATE tasks
       SET deleted_at = ?, updated_at = ?, sync_status = 'pending'
       WHERE id = ? AND deleted_at IS NULL`,
      [now, now, taskId],
    );
    if (result.rowsAffected !== 1) {
      throw new Error(
        `Could not delete task ${taskId}; it may no longer exist.`,
      );
    }
  });
};
