import type { TaskPriority, TaskSyncStatus } from '../domain/Task';
import { APP_COLORS } from '../../../shared/constants/appConstants';

export const TASK_PRIORITIES = [
  'low',
  'medium',
  'high',
] as const satisfies readonly TaskPriority[];

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#10A875',
  medium: APP_COLORS.warning,
  high: APP_COLORS.danger,
};

export const TASK_SYNC_STATUSES = [
  'synced',
  'pending',
  'failed',
] as const satisfies readonly TaskSyncStatus[];

export const TASK_SYNC_STATUS_LABELS: Record<TaskSyncStatus, string> = {
  synced: 'Synced',
  pending: 'Pending',
  failed: 'Failed',
};

export const TASK_LISTS = ['Personal', 'Work', 'Shopping'] as const;

export const TASK_REMINDERS = [
  'None',
  'At due time',
  '15 minutes before',
  '1 hour before',
] as const;

export const TASK_FILTERS = ['All', 'Active', 'Completed'] as const;

export const TASK_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TASK_CLOCK_HOURS = Array.from(
  { length: 12 },
  (_, index) => index + 1,
);

export const TASK_CLOCK_MINUTES = Array.from(
  { length: 60 },
  (_, index) => index,
);

export const DEFAULT_TASK_DUE_TIME = '12:00';
