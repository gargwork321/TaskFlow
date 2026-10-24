import { useMemo, useState } from 'react';
import {
  Alert,
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
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { createTasksStyles } from './styles';
import dummyTasks from '../../data/dummyTasks.json';
import type {
  Task,
  TaskPriority,
  TaskSyncStatus,
} from '../../domain/Task';
import CreateTask from '../CreateTask';

type TaskFilter = 'All' | 'Active' | 'Completed';
type TasksStyles = ReturnType<typeof createTasksStyles>;

const filters: TaskFilter[] = ['All', 'Active', 'Completed'];

const priorityColors: Record<Task['priority'], string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10A875',
};

const taskPriorities: TaskPriority[] = ['low', 'medium', 'high'];
const syncStatuses: TaskSyncStatus[] = ['synced', 'pending', 'failed'];
const isTaskPriority = (value: string): value is TaskPriority =>
  taskPriorities.some(priority => priority === value);
const isSyncStatus = (value: string): value is TaskSyncStatus =>
  syncStatuses.some(status => status === value);

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
  onMenuPress,
  onEdit,
  onDelete,
}: {
  item: Task;
  styles: TasksStyles;
  onToggle: () => void;
  menuOpen: boolean;
  onMenuPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const priorityColor = priorityColors[item.priority];

  return (
    <View style={[styles.itemWrapper, menuOpen && styles.itemWrapperOpen]}>
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
        <View style={styles.taskContent}>
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
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`More options for ${item.title}`}
          accessibilityState={{ expanded: menuOpen }}
          hitSlop={10}
          onPress={onMenuPress}
          style={styles.moreButton}
        >
          <EllipsisVertical color={styles.iconColor.color} size={20} />
        </Pressable>
      </View>
      {menuOpen && (
        <View style={styles.taskMenu}>
          <Pressable
            accessibilityRole="button"
            onPress={onEdit}
            style={styles.taskMenuItem}
          >
            <Pencil color={styles.iconColor.color} size={17} />
            <Text style={styles.taskMenuText}>Edit</Text>
          </Pressable>
          <View style={styles.taskMenuDivider} />
          <Pressable
            accessibilityRole="button"
            onPress={onDelete}
            style={styles.taskMenuItem}
          >
            <Trash2 color="#EF4444" size={17} />
            <Text style={styles.deleteMenuText}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const Tasks = () => {
  const theme = useAppTheme();
  const styles = createTasksStyles(theme.colors);
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);

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

  const toggleTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  };

  const refreshTasks = () => {
    setRefreshing(true);
    setTasks(currentTasks => [
      ...currentTasks.filter(
        task => !sampleTasks.some(sampleTask => sampleTask.id === task.id),
      ),
      ...sampleTasks.map(task => ({ ...task })),
    ]);
    setRefreshing(false);
  };

  const addTask = (task: Task) => {
    setTasks(currentTasks => [task, ...currentTasks]);
    setFilter('All');
    setSearchText('');
    setShowCreateTask(false);
  };

  const updateTask = (task: Task) => {
    setTasks(currentTasks =>
      currentTasks.map(currentTask =>
        currentTask.id === task.id ? task : currentTask,
      ),
    );
    setEditingTask(null);
  };

  const closeTaskForm = () => {
    setShowCreateTask(false);
    setEditingTask(null);
  };

  const confirmDeleteTask = (task: Task) => {
    setOpenMenuTaskId(null);
    Alert.alert(
      'Delete task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setTasks(currentTasks =>
              currentTasks.filter(currentTask => currentTask.id !== task.id),
            ),
        },
      ],
    );
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
        {filters.map(option => {
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
            onMenuPress={() =>
              setOpenMenuTaskId(current =>
                current === item.id ? null : item.id,
              )
            }
            onEdit={() => {
              setOpenMenuTaskId(null);
              setEditingTask(item);
            }}
            onDelete={() => confirmDeleteTask(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No tasks found.</Text>
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
        animationType="slide"
        onRequestClose={closeTaskForm}
        presentationStyle="fullScreen"
        visible={showCreateTask || editingTask !== null}
      >
        <CreateTask
          key={editingTask?.id ?? 'new-task'}
          initialTask={editingTask ?? undefined}
          onCancel={closeTaskForm}
          onSave={editingTask ? updateTask : addTask}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Tasks;
