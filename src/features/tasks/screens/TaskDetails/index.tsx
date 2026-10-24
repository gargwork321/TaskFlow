import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Copy,
  Folder,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Task } from '../../domain/Task';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { createTaskDetailsStyles } from './styles';
import {
  TASK_LISTS,
  TASK_PRIORITY_COLORS,
  TASK_REMINDERS,
  TASK_SYNC_STATUS_LABELS,
} from '../../constants/taskConstants';
import { APP_COLORS } from '../../../../shared/constants/appConstants';

type TaskDetailsProps = {
  task: Task;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleComplete: () => void;
  onMoveTo: (list: string) => void;
  onSetReminder: (reminder: string) => void;
};

type OptionModalAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type OptionModalState = {
  title: string;
  actions: OptionModalAction[];
};

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const formatDueDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const TaskDetails = ({
  task,
  onBack,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleComplete,
  onMoveTo,
  onSetReminder,
}: TaskDetailsProps) => {
  const theme = useAppTheme();
  const styles = createTaskDetailsStyles(theme.colors);
  const priorityColor = TASK_PRIORITY_COLORS[task.priority];
  const syncColor =
    task.syncStatus === 'synced'
      ? APP_COLORS.success
      : task.syncStatus === 'failed'
      ? APP_COLORS.danger
      : APP_COLORS.warning;
  const [optionModal, setOptionModal] = useState<OptionModalState | null>(null);

  const chooseOption = (
    title: string,
    options: string[],
    onSelect: (value: string) => void,
  ) => {
    setOptionModal({
      title,
      actions: options.map(option => ({
        label: option,
        onPress: () => onSelect(option),
      })),
    });
  };

  const showMoreOptions = () => {
    setOptionModal({
      title: 'Task options',
      actions: [
        { label: 'Edit', onPress: onEdit },
        { label: 'Duplicate', onPress: onDuplicate },
        { label: 'Delete', onPress: onDelete, destructive: true },
      ],
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to tasks"
            onPress={onBack}
            style={styles.headerButton}
          >
            <ChevronLeft color={theme.colors.text} size={25} />
          </Pressable>
          <Text style={styles.headerTitle}>Task Details</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More task options"
            onPress={showMoreOptions}
            style={styles.headerButton}
          >
            <MoreVertical color={theme.colors.text} size={23} />
          </Pressable>
        </View>

        <View style={styles.taskSummary}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={
              task.isCompleted
                ? 'Mark task as active'
                : 'Mark task as completed'
            }
            accessibilityState={{ checked: task.isCompleted }}
            onPress={onToggleComplete}
            style={[
              styles.completionButton,
              task.isCompleted && styles.completedButton,
            ]}
          >
            {task.isCompleted && (
              <Check color={theme.colors.surface} size={22} />
            )}
          </Pressable>
          <View style={styles.summaryContent}>
            <Text
              style={[styles.title, task.isCompleted && styles.completedTitle]}
            >
              {task.title}
            </Text>
            <View style={styles.metadata}>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: `${priorityColor}14`,
                    borderColor: `${priorityColor}88`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priorityColor },
                  ]}
                />
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </Text>
              </View>
              {task.dueDate && (
                <View style={styles.dueDate}>
                  <CalendarDays color={theme.colors.secondaryText} size={16} />
                  <Text style={styles.dueDateText}>
                    {formatDueDate(task.dueDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={onEdit}
            style={styles.actionButton}
          >
            <Pencil color={theme.colors.text} size={22} />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onDelete}
            style={styles.actionButton}
          >
            <Trash2 color={APP_COLORS.danger} size={22} />
            <Text style={styles.deleteActionText}>Delete</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onDuplicate}
            style={styles.actionButton}
          >
            <Copy color={theme.colors.text} size={22} />
            <Text style={styles.actionText}>Duplicate</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onToggleComplete}
          style={styles.detailRow}
        >
          {task.isCompleted ? (
            <Check
              color={theme.colors.text}
              size={22}
              style={styles.detailRowIcon}
            />
          ) : (
            <Circle
              color={theme.colors.text}
              size={22}
              style={styles.detailRowIcon}
            />
          )}
          <Text style={styles.detailRowText}>
            {task.isCompleted ? 'Mark as Active' : 'Mark as Completed'}
          </Text>
          <ChevronRight color={theme.colors.secondaryText} size={20} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            chooseOption('Move task to', [...TASK_LISTS], onMoveTo)
          }
          style={styles.detailRow}
        >
          <Folder
            color={theme.colors.text}
            size={22}
            style={styles.detailRowIcon}
          />
          <Text style={styles.detailRowText}>Move to...</Text>
          {task.list ? (
            <Text style={styles.detailRowValue}>{task.list}</Text>
          ) : null}
          <ChevronRight
            color={theme.colors.secondaryText}
            size={20}
            style={styles.chevron}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            chooseOption('Set reminder', [...TASK_REMINDERS], onSetReminder)
          }
          style={styles.detailRow}
        >
          <Bell
            color={theme.colors.text}
            size={22}
            style={styles.detailRowIcon}
          />
          <Text style={styles.detailRowText}>Add a Reminder</Text>
          {task.reminder && task.reminder !== 'None' ? (
            <Text style={styles.detailRowValue}>{task.reminder}</Text>
          ) : null}
          <ChevronRight
            color={theme.colors.secondaryText}
            size={20}
            style={styles.chevron}
          />
        </Pressable>

        <View style={styles.detailRow}>
          <RefreshCw
            color={theme.colors.text}
            size={22}
            style={styles.detailRowIcon}
          />
          <Text style={styles.detailRowText}>View Sync Status</Text>
          <Text style={[styles.syncValue, { color: syncColor }]}>
            {TASK_SYNC_STATUS_LABELS[task.syncStatus]}
          </Text>
        </View>

        {task.dueDate ? (
          <View style={styles.detailRow}>
            <Clock3
              color={theme.colors.secondaryText}
              size={20}
              style={styles.detailRowIcon}
            />
            <Text style={styles.detailRowText}>Due</Text>
            <Text style={styles.detailRowValue}>
              {formatDueDate(task.dueDate)}
            </Text>
          </View>
        ) : null}

        <View style={styles.timestampRow}>
          <Text style={styles.timestampLabel}>Created</Text>
          <Text style={styles.timestampValue}>
            {formatTimestamp(task.createdAt)}
          </Text>
        </View>
        <View style={styles.timestampRow}>
          <Text style={styles.timestampLabel}>Last Updated</Text>
          <Text style={styles.timestampValue}>
            {formatTimestamp(task.updatedAt)}
          </Text>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        onRequestClose={() => setOptionModal(null)}
        statusBarTranslucent
        transparent
        visible={optionModal !== null}
      >
        <View style={styles.optionModalOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss options"
            onPress={() => setOptionModal(null)}
            style={styles.optionModalBackdrop}
          />
          {optionModal && (
            <View style={styles.optionModalCard}>
              <Text style={styles.optionModalTitle}>{optionModal.title}</Text>
              {optionModal.actions.map((action, index) => (
                <View key={action.label}>
                  {index > 0 && <View style={styles.optionModalDivider} />}
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setOptionModal(null);
                      action.onPress();
                    }}
                    style={styles.optionModalAction}
                  >
                    <Text
                      style={[
                        styles.optionModalActionText,
                        action.destructive && styles.optionModalDestructiveText,
                      ]}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskDetails;
