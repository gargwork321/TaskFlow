
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskSyncStatus = 'synced' | 'pending' | 'failed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: TaskSyncStatus;
  list?: string;
  reminder?: string;
  deletedAt?: string;
}
