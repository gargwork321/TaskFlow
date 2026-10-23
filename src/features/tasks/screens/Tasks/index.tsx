import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { createTasksStyles } from './styles';
import dummyTasks from '../../data/dummyTasks.json';

type Task = (typeof dummyTasks)[number];

type TasksStyles = ReturnType<typeof createTasksStyles>;

const priorityColors: Record<Task['priority'], string> = {
  high: '#EF4444',
  medium: '#EAB308',
  low: '#22C55E',
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const TaskItem = ({ item, styles }: { item: Task; styles: TasksStyles }) => {
  return (
    <View
      style={[
        styles.itemContainer,
        { borderLeftColor: priorityColors[item.priority] },
      ]}
    >
      <View style={styles.taskHeader}>
        <View
          style={[
            styles.completionIndicator,
            item.isCompleted && styles.completedIndicator,
          ]}
        >
          {item.isCompleted && <Text style={styles.completionCheck}>✓</Text>}
        </View>
        <View style={styles.taskContent}>
          <Text
            style={[styles.itemTitle, item.isCompleted && styles.completedTitle]}
          >
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      <View style={styles.taskFooter}>
        {item.dueDate && (
          <Text style={styles.taskMetadata}>Due {formatDate(item.dueDate)}</Text>
        )}
        <View style={styles.syncStatus}>
          <View
            style={[
              styles.syncIndicator,
              item.syncStatus === 'synced' && styles.syncedIndicator,
              item.syncStatus === 'pending' && styles.pendingIndicator,
              item.syncStatus === 'failed' && styles.failedIndicator,
            ]}
          />
          <Text style={styles.taskMetadata}>{item.syncStatus}</Text>
        </View>
      </View>
    </View>
  );
};

const Tasks = () => {
  const theme = useAppTheme();
  const styles = createTasksStyles(theme.colors);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search tasks..."
        value={''}
        onChangeText={() => {}}
      />
      <FlatList
        data={dummyTasks}
        renderItem={({ item }) => <TaskItem item={item} styles={styles} />}
      />
      <Pressable
        onPress={() => {}}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
};

export default Tasks;
