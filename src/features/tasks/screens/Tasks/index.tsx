import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  EllipsisVertical,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { createTasksStyles } from './styles';
import dummyTasks from '../../data/dummyTasks.json';
import type { Task, TaskPriority, TaskSyncStatus } from '../../domain/Task';
import CreateTask from '../CreateTask';
import TaskDetails from '../TaskDetails';
import { APP_COLORS } from '../../../../shared/constants/appConstants';
import {
  TASK_FILTERS,
  TASK_PRIORITIES,
  TASK_PRIORITY_COLORS,
  TASK_SYNC_STATUSES,
} from '../../constants/taskConstants';
import {
  createTask as createTaskInDatabase,
  deleteTask as deleteTaskFromDatabase,
  initializeTasksDatabase,
  listTasks,
  saveTask,
  updateTaskFields,
} from '../../data/tasksRepository';

type TaskFilter = (typeof TASK_FILTERS)[number];
type TasksStyles = ReturnType<typeof createTasksStyles>;
type MenuPosition = { top: number; right: number };

const isTaskPriority = (value: string): value is TaskPriority =>
  TASK_PRIORITIES.some(priority => priority === value);
const isSyncStatus = (value: string): value is TaskSyncStatus =>
  TASK_SYNC_STATUSES.some(status => status === value);

const sampleTasks: Task[] = dummyTasks.map(task => {
  if (!isTaskPriority(task.priority) || !isSyncStatus(task.syncStatus)) {
    throw new Error(`Invalid task data for ${task.id}`);
  }

  return {
    ...task,
    priority: task.priority,
    syncStatus: task.syncStatus,
  };
});

const formatDueDate = (date: string) => {
  const dueDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  if (isSameDay(dueDate, today)) {
    return 'Today';
  }
  if (isSameDay(dueDate, tomorrow)) {
    return 'Tomorrow';
  }
  return dueDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const TaskItem = ({
  item,
  styles,
  onToggle,
  menuOpen,
  onOpenDetails,
  onMenuPress,
}: {
  item: Task;
  styles: TasksStyles;
  onToggle: () => void;
  menuOpen: boolean;
  onOpenDetails: () => void;
  onMenuPress: (position: MenuPosition) => void;
}) => {
  const priorityColor = TASK_PRIORITY_COLORS[item.priority];
  const moreButtonRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const { width: windowWidth } = Dimensions.get('window');

  const measureMenuAnchor = () => {
    moreButtonRef.current?.measureInWindow((x, y, width, height) => {
      onMenuPress({
        top: y + height,
        right: Math.max(8, windowWidth - x - width),
      });
    });
  };

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContainer}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.isCompleted }}
          accessibilityLabel={item.title}
          onPress={onToggle}
          style={[
            styles.completionIndicator,
            item.isCompleted && styles.completedIndicator,
          ]}
        >
          {item.isCompleted && <Text style={styles.completionCheck}>✓</Text>}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.title}`}
          onPress={onOpenDetails}
          style={styles.taskContent}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.itemTitle,
              item.isCompleted && styles.completedTitle,
            ]}
          >
            {item.title}
          </Text>
          <View style={styles.taskMetadataRow}>
            <View style={styles.priorityMetadata}>
              <View
                style={[
                  styles.priorityMarker,
                  { backgroundColor: priorityColor },
                ]}
              />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Text>
            </View>
            {item.dueDate && (
              <>
                <Text style={styles.metadataSeparator}>·</Text>
                <Text style={styles.taskMetadata}>
                  {formatDueDate(item.dueDate)}
                </Text>
              </>
            )}
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`More options for ${item.title}`}
          accessibilityState={{ expanded: menuOpen }}
          hitSlop={10}
          onPress={measureMenuAnchor}
          ref={moreButtonRef}
          style={styles.moreButton}
        >
          <EllipsisVertical color={styles.iconColor.color} size={20} />
        </Pressable>
      </View>
    </View>
  );
};

const Tasks = () => {
  const theme = useAppTheme();
  const styles = createTasksStyles(theme.colors);
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailsTaskId, setDetailsTaskId] = useState<string | null>(null);
  const [returnToDetailsAfterEdit, setReturnToDetailsAfterEdit] =
    useState(false);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const { height: windowHeight } = Dimensions.get('window');
  const detailsTask = tasks.find(task => task.id === detailsTaskId) ?? null;
  const menuTask = tasks.find(task => task.id === openMenuTaskId) ?? null;

  useEffect(() => {
    let isMounted = true;
    initializeTasksDatabase(sampleTasks)
      .then(loadedTasks => {
        if (isMounted) {
          setTasks(loadedTasks);
          setDatabaseReady(true);
          setDatabaseError(null);
        }
      })
      .catch(error => {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : 'Unknown database error.';
          setDatabaseError(message);
          setDatabaseReady(true);
          Alert.alert('Could not load tasks', message);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return tasks.filter(task => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Active' && !task.isCompleted) ||
        (filter === 'Completed' && task.isCompleted);
      const matchesSearch = task.title.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchText, tasks]);

  const reportDatabaseError = (action: string, error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown database error.';
    setDatabaseError(message);
    Alert.alert(`Could not ${action}`, message);
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(currentTask => currentTask.id === taskId);
    if (!task) {
      return;
    }
    try {
      await updateTaskFields(taskId, { isCompleted: !task.isCompleted });
      setTasks(await listTasks());
      setDatabaseError(null);
    } catch (error) {
      reportDatabaseError('update task', error);
    }
  };

  const refreshTasks = async () => {
    setRefreshing(true);
    try {
      const loadedTasks = await initializeTasksDatabase(sampleTasks);
      setTasks(loadedTasks);
      setDatabaseError(null);
    } catch (error) {
      reportDatabaseError('load tasks', error);
    } finally {
      setRefreshing(false);
    }
  };

  const addTask = async (task: Task) => {
    try {
      await createTaskInDatabase(task);
      setTasks(await listTasks());
      setFilter('All');
      setSearchText('');
      setShowCreateTask(false);
      setDatabaseError(null);
    } catch (error) {
      reportDatabaseError('save task', error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      await saveTask(task);
      setTasks(await listTasks());
      setEditingTask(null);
      if (returnToDetailsAfterEdit) {
        setDetailsTaskId(task.id);
        setReturnToDetailsAfterEdit(false);
      }
      setDatabaseError(null);
    } catch (error) {
      reportDatabaseError('save task', error);
    }
  };

  const closeTaskForm = () => {
    setShowCreateTask(false);
    setEditingTask(null);
    setReturnToDetailsAfterEdit(false);
  };

  const confirmDeleteTask = (task: Task, closeDetails = false) => {
    setOpenMenuTaskId(null);
    Alert.alert(
      'Delete task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTaskFromDatabase(task.id)
              .then(listTasks)
              .then(loadedTasks => {
                setTasks(loadedTasks);
                if (closeDetails) {
                  setDetailsTaskId(null);
                }
                setDatabaseError(null);
              })
              .catch(error => reportDatabaseError('delete task', error));
          },
        },
      ],
    );
  };

  const duplicateTask = async (task: Task) => {
    const now = new Date().toISOString();
    const duplicate: Task = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (copy)`,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
    };
    try {
      await createTaskInDatabase(duplicate);
      setTasks(await listTasks());
      setDetailsTaskId(null);
      setDatabaseError(null);
    } catch (error) {
      reportDatabaseError('duplicate task', error);
    }
  };

  const updateTaskDetails = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTaskFields(taskId, updates);
      setTasks(await listTasks());
      setDatabaseError(null);
    } catch (error) {
      reportDatabaseError('update task', error);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          style={styles.headerIcon}
        >
          <ArrowLeft color={styles.headerTitle.color} size={23} />
        </Pressable>
        <Text style={styles.headerTitle}>TaskFlow</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={10}
          style={styles.notificationButton}
        >
          <Bell color={styles.headerTitle.color} size={23} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        {TASK_FILTERS.map(option => {
          const selected = filter === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFilter(option)}
              style={[styles.filterButton, selected && styles.selectedFilter]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.selectedFilterText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.searchBox}>
        <Search color={styles.searchIcon.color} size={20} />
        <TextInput
          accessibilityLabel="Search tasks"
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor={theme.colors.secondaryText}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={visibleTasks}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTasks}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            styles={styles}
            onToggle={() => toggleTask(item.id)}
            menuOpen={openMenuTaskId === item.id}
            onMenuPress={position => {
              if (openMenuTaskId === item.id) {
                setOpenMenuTaskId(null);
                setMenuPosition(null);
              } else {
                setOpenMenuTaskId(item.id);
                setMenuPosition(position);
              }
            }}
            onOpenDetails={() => {
              setOpenMenuTaskId(null);
              setMenuPosition(null);
              setDetailsTaskId(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {!databaseReady
              ? 'Loading tasks...'
              : databaseError
              ? 'Tasks could not be loaded. Pull down to retry.'
              : 'No tasks found.'}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add task"
        onPress={() => setShowCreateTask(true)}
        style={styles.addButton}
      >
        <Plus color="#FFFFFF" size={30} strokeWidth={2.5} />
      </Pressable>
      <Modal
        animationType="fade"
        onRequestClose={() => {
          setOpenMenuTaskId(null);
          setMenuPosition(null);
        }}
        statusBarTranslucent
        transparent
        visible={menuTask !== null && menuPosition !== null}
      >
        <View style={styles.menuOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss task menu"
            onPress={() => {
              setOpenMenuTaskId(null);
              setMenuPosition(null);
            }}
            style={styles.menuBackdrop}
          />
          {menuTask && menuPosition && (
            <View
              style={[
                styles.taskMenu,
                {
                  right: menuPosition.right,
                  top: Math.min(menuPosition.top, windowHeight - 150),
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setOpenMenuTaskId(null);
                  setMenuPosition(null);
                  setDetailsTaskId(menuTask.id);
                }}
                style={styles.taskMenuItem}
              >
                <FileText color={styles.iconColor.color} size={17} />
                <Text style={styles.taskMenuText}>View Details</Text>
              </Pressable>
              <View style={styles.taskMenuDivider} />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setOpenMenuTaskId(null);
                  setMenuPosition(null);
                  setReturnToDetailsAfterEdit(false);
                  setEditingTask(menuTask);
                }}
                style={styles.taskMenuItem}
              >
                <Pencil color={styles.iconColor.color} size={17} />
                <Text style={styles.taskMenuText}>Edit</Text>
              </Pressable>
              <View style={styles.taskMenuDivider} />
              <Pressable
                accessibilityRole="button"
                onPress={() => confirmDeleteTask(menuTask)}
                style={styles.taskMenuItem}
              >
                <Trash2 color={APP_COLORS.danger} size={17} />
                <Text style={styles.deleteMenuText}>Delete</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
      <Modal
        animationType="slide"
        onRequestClose={closeTaskForm}
        presentationStyle="fullScreen"
        visible={showCreateTask || editingTask !== null || detailsTask !== null}
      >
        {detailsTask ? (
          <TaskDetails
            key={`details-${detailsTask.id}`}
            task={detailsTask}
            onBack={() => setDetailsTaskId(null)}
            onEdit={() => {
              setReturnToDetailsAfterEdit(true);
              setEditingTask(detailsTask);
              setDetailsTaskId(null);
            }}
            onDelete={() => confirmDeleteTask(detailsTask, true)}
            onDuplicate={() => duplicateTask(detailsTask)}
            onToggleComplete={() =>
              updateTaskDetails(detailsTask.id, {
                isCompleted: !detailsTask.isCompleted,
              })
            }
            onMoveTo={list => updateTaskDetails(detailsTask.id, { list })}
            onSetReminder={reminder =>
              updateTaskDetails(detailsTask.id, { reminder })
            }
          />
        ) : (
          <CreateTask
            key={editingTask?.id ?? 'new-task'}
            initialTask={editingTask ?? undefined}
            onCancel={closeTaskForm}
            onSave={editingTask ? updateTask : addTask}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default Tasks;
