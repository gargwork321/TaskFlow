import { useMemo, useState } from 'react';
import {
  FlatList,
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
  Plus,
  Search,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { createTasksStyles } from './styles';
import dummyTasks from '../../data/dummyTasks.json';

type Task = (typeof dummyTasks)[number];
type TaskFilter = 'All' | 'Active' | 'Completed';
type TasksStyles = ReturnType<typeof createTasksStyles>;

const filters: TaskFilter[] = ['All', 'Active', 'Completed'];

const priorityColors: Record<Task['priority'], string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10A875',
};

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
}: {
  item: Task;
  styles: TasksStyles;
  onToggle: () => void;
}) => {
  const priorityColor = priorityColors[item.priority];

  return (
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
          style={[styles.itemTitle, item.isCompleted && styles.completedTitle]}
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
        hitSlop={10}
        style={styles.moreButton}
      >
        <EllipsisVertical color={styles.iconColor.color} size={20} />
      </Pressable>
    </View>
  );
};

const Tasks = () => {
  const theme = useAppTheme();
  const styles = createTasksStyles(theme.colors);
  const [filter, setFilter] = useState<TaskFilter>('All');
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [refreshing, setRefreshing] = useState(false);

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
    setTasks(dummyTasks.map(task => ({ ...task })));
    setRefreshing(false);
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
        style={styles.addButton}
      >
        <Plus color="#FFFFFF" size={30} strokeWidth={2.5} />
      </Pressable>
    </SafeAreaView>
  );
};

export default Tasks;
