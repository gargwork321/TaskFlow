import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Folder,
  X,
} from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Task, TaskPriority } from '../../domain/Task';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { createCreateTaskStyles } from './styles';

type CreateTaskProps = {
  onCancel: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task;
};

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const priorityColors: Record<TaskPriority, string> = {
  low: '#10A875',
  medium: '#F59E0B',
  high: '#EF4444',
};
type DropdownOption = { label: string; value: string };

const taskLists: DropdownOption[] = [
  { label: 'Personal', value: 'Personal' },
  { label: 'Work', value: 'Work' },
  { label: 'Shopping', value: 'Shopping' },
];
const reminders: DropdownOption[] = [
  { label: 'None', value: 'None' },
  { label: 'At due time', value: 'At due time' },
  { label: '15 minutes before', value: '15 minutes before' },
  { label: '1 hour before', value: '1 hour before' },
];

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatTimeLabel = (value: string) => {
  if (!isValidTime(value)) {
    return '';
  }

  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const clockHours = Array.from({ length: 12 }, (_, index) => index + 1);
const clockMinutes = Array.from({ length: 60 }, (_, index) => index);

type TimePickerStep = 'hour' | 'minute';

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const isValidTime = (value: string) =>
  /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);

const CreateTask = ({ onCancel, onSave, initialTask }: CreateTaskProps) => {
  const theme = useAppTheme();
  const styles = createCreateTaskStyles(theme.colors);
  const initialDueDate = initialTask?.dueDate
    ? new Date(initialTask.dueDate)
    : undefined;
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(
    initialTask?.description ?? '',
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask?.priority ?? 'medium',
  );
  const [dueDate, setDueDate] = useState(
    initialDueDate && !Number.isNaN(initialDueDate.getTime())
      ? formatDate(initialDueDate)
      : '',
  );
  const [dueTime, setDueTime] = useState(
    initialDueDate && !Number.isNaN(initialDueDate.getTime())
      ? `${`${initialDueDate.getHours()}`.padStart(2, '0')}:${`${initialDueDate.getMinutes()}`.padStart(2, '0')}`
      : '',
  );
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const date = initialDueDate ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerStep, setTimePickerStep] = useState<TimePickerStep>('hour');
  const [selectedTime, setSelectedTime] = useState(() => {
    if (initialDueDate && !Number.isNaN(initialDueDate.getTime())) {
      return new Date(initialDueDate);
    }
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    return noon;
  });
  const [taskList, setTaskList] = useState(
    initialTask?.list ?? taskLists[0].value,
  );
  const [reminder, setReminder] = useState(
    initialTask?.reminder ?? reminders[0].value,
  );
  const [error, setError] = useState('');

  const saveTask = () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setError('Please enter a task title.');
      return;
    }
    if (dueDate && !isValidDate(dueDate)) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return;
    }
    if (dueTime && !isValidTime(dueTime)) {
      setError('Enter a valid time in 24-hour format (HH:MM).');
      return;
    }
    if (dueTime && !dueDate) {
      setError('Add a due date before setting a due time.');
      return;
    }
    if (reminder !== 'None' && !dueDate) {
      setError('Add a due date to set a reminder.');
      return;
    }

    const now = new Date().toISOString();
    const dueDateTime = dueDate
      ? (() => {
          const [year, month, day] = dueDate.split('-').map(Number);
          const [hours, minutes] = dueTime
            ? dueTime.split(':').map(Number)
            : [12, 0];
          return new Date(year, month - 1, day, hours, minutes).toISOString();
        })()
      : undefined;
    onSave({
      ...initialTask,
      id: initialTask?.id ?? `task-${Date.now()}`,
      title: normalizedTitle,
      description: description.trim() || undefined,
      priority,
      isCompleted: initialTask?.isCompleted ?? false,
      dueDate: dueDateTime,
      createdAt: initialTask?.createdAt ?? now,
      updatedAt: now,
      syncStatus: initialTask?.syncStatus ?? 'pending',
      list: taskList,
      reminder,
    });
  };

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const firstWeekday = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    ).getDay();
    const date = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      index - firstWeekday + 1,
    );

    return date.getMonth() === calendarMonth.getMonth() ? date : null;
  });

  const changeCalendarMonth = (offset: number) => {
    setCalendarMonth(
      month =>
        new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  };

  const openCalendar = () => {
    if (dueDate && isValidDate(dueDate)) {
      const [year, month] = dueDate.split('-').map(Number);
      setCalendarMonth(new Date(year, month - 1, 1));
    } else {
      const today = new Date();
      setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
    setShowCalendar(current => !current);
  };

  const selectCalendarDate = (date: Date) => {
    setDueDate(formatDate(date));
    setShowCalendar(false);
    setError('');
  };

  const openTimePicker = () => {
    if (dueTime && isValidTime(dueTime)) {
      const [hours, minutes] = dueTime.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes, 0, 0);
      setSelectedTime(time);
    } else {
      const noon = new Date();
      noon.setHours(12, 0, 0, 0);
      setSelectedTime(noon);
    }
    setTimePickerStep('hour');
    setShowTimePicker(current => !current);
  };

  const selectHour = (hour: number) => {
    const nextTime = new Date(selectedTime);
    const isAfternoon = selectedTime.getHours() >= 12;
    nextTime.setHours((hour % 12) + (isAfternoon ? 12 : 0));
    setSelectedTime(nextTime);
    setTimePickerStep('minute');
  };

  const selectMinute = (minute: number) => {
    const nextTime = new Date(selectedTime);
    nextTime.setMinutes(minute, 0, 0);
    setSelectedTime(nextTime);
  };

  const confirmTime = () => {
    setDueTime(
      `${`${selectedTime.getHours()}`.padStart(2, '0')}:${`${selectedTime.getMinutes()}`.padStart(2, '0')}`,
    );
    setShowTimePicker(false);
    setError('');
  };

  const setTimePeriod = (isAfternoon: boolean) => {
    const nextTime = new Date(selectedTime);
    const hour = nextTime.getHours() % 12;
    nextTime.setHours(hour + (isAfternoon ? 12 : 0));
    setSelectedTime(nextTime);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel creating task"
              onPress={onCancel}
              style={styles.headerButton}
            >
              <X color={theme.colors.text} size={24} />
            </Pressable>
            <Text style={styles.headerTitle}>
              {initialTask ? 'Edit Task' : 'Create Task'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={saveTask}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>
                {initialTask ? 'Update' : 'Save'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              accessibilityLabel="Task title"
              maxLength={120}
              onChangeText={value => {
                setTitle(value);
                if (error) {
                  setError('');
                }
              }}
              placeholder="e.g. Buy groceries"
              placeholderTextColor={theme.colors.secondaryText}
              returnKeyType="next"
              style={styles.field}
              value={title}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              accessibilityLabel="Task description"
              maxLength={500}
              multiline
              onChangeText={setDescription}
              placeholder="e.g. Milk, eggs, vegetables..."
              placeholderTextColor={theme.colors.secondaryText}
              style={[styles.field, styles.description]}
              value={description}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityOptions}>
              {priorities.map(option => {
                const selected = option === priority;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    key={option}
                    onPress={() => setPriority(option)}
                    style={[
                      styles.priorityButton,
                      selected && {
                        backgroundColor: `${priorityColors[option]}22`,
                        borderColor: priorityColors[option],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        selected && { color: priorityColors[option] },
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Due Date (optional)</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                dueDate
                  ? `Due date: ${formatDateLabel(
                      new Date(`${dueDate}T12:00:00`),
                    )}`
                  : 'Select due date'
              }
              accessibilityState={{ expanded: showCalendar }}
              onPress={openCalendar}
              style={styles.inlineField}
            >
              <Text
                style={[
                  styles.inlineInput,
                  !dueDate && styles.placeholderText,
                ]}
              >
                {dueDate
                  ? formatDateLabel(new Date(`${dueDate}T12:00:00`))
                  : 'Select date'}
              </Text>
              <CalendarDays
                color={styles.inlineIcon.color}
                size={20}
              />
            </Pressable>
            {showCalendar && (
              <View style={styles.calendar}>
                <View style={styles.calendarHeader}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Previous month"
                    onPress={() => changeCalendarMonth(-1)}
                    style={styles.monthButton}
                  >
                    <ChevronLeft color={theme.colors.text} size={22} />
                  </Pressable>
                  <Text style={styles.monthTitle}>
                    {calendarMonth.toLocaleDateString(undefined, {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Next month"
                    onPress={() => changeCalendarMonth(1)}
                    style={styles.monthButton}
                  >
                    <ChevronRight color={theme.colors.text} size={22} />
                  </Pressable>
                </View>
                <View style={styles.calendarGrid}>
                  {weekdays.map(day => (
                    <Text key={day} style={styles.weekday}>
                      {day}
                    </Text>
                  ))}
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <View key={`blank-${index}`} style={styles.dayCell} />;
                    }

                    const selected = dueDate === formatDate(date);
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={formatDateLabel(date)}
                        accessibilityState={{ selected }}
                        key={formatDate(date)}
                        onPress={() => selectCalendarDate(date)}
                        style={[
                          styles.dayCell,
                          selected && styles.selectedDay,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            selected && styles.selectedDayText,
                          ]}
                        >
                          {date.getDate()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => selectCalendarDate(new Date())}
                  style={styles.todayButton}
                >
                  <Text style={styles.todayText}>Today</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Due Time (optional)</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                dueTime
                  ? `Due time: ${formatTimeLabel(dueTime)}`
                  : 'Select due time'
              }
              accessibilityState={{ expanded: showTimePicker }}
              onPress={openTimePicker}
              style={styles.inlineField}
            >
              <Text
                style={[
                  styles.inlineInput,
                  !dueTime && styles.placeholderText,
                ]}
              >
                {dueTime ? formatTimeLabel(dueTime) : 'Select time'}
              </Text>
              <Clock3
                color={styles.inlineIcon.color}
                size={20}
              />
            </Pressable>
            <Text style={styles.helperText}>
              Select a time or leave blank to use 12:00 PM.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Add to list (optional)</Text>
            <Dropdown
              accessibilityLabel="Task list"
              data={taskLists}
              labelField="label"
              valueField="value"
              value={taskList}
              onChange={(item: DropdownOption) => setTaskList(item.value)}
              maxHeight={220}
              dropdownPosition="top"
              activeColor={`${theme.colors.primary}18`}
              style={styles.selector}
              containerStyle={styles.dropdownMenu}
              itemContainerStyle={styles.dropdownItem}
              itemTextStyle={styles.dropdownItemText}
              selectedTextStyle={styles.selectorText}
              placeholderStyle={styles.selectorText}
              iconColor={theme.colors.secondaryText}
              renderLeftIcon={() => (
                <Folder
                  color={styles.selectorIcon.color}
                  size={20}
                  style={styles.selectorIcon}
                />
              )}
              renderRightIcon={() => (
                <ChevronDown color={theme.colors.secondaryText} size={20} />
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Reminder (optional)</Text>
            <Dropdown
              accessibilityLabel="Reminder"
              data={reminders}
              labelField="label"
              valueField="value"
              value={reminder}
              onChange={(item: DropdownOption) => setReminder(item.value)}
              maxHeight={220}
              dropdownPosition="top"
              activeColor={`${theme.colors.primary}18`}
              style={styles.selector}
              containerStyle={styles.dropdownMenu}
              itemContainerStyle={styles.dropdownItem}
              itemTextStyle={styles.dropdownItemText}
              selectedTextStyle={styles.selectorText}
              placeholderStyle={styles.selectorText}
              iconColor={theme.colors.secondaryText}
              renderLeftIcon={() => (
                <Bell
                  color={styles.selectorIcon.color}
                  size={20}
                  style={styles.selectorIcon}
                />
              )}
              renderRightIcon={() => (
                <ChevronDown color={theme.colors.secondaryText} size={20} />
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
        transparent
        visible={showTimePicker}
      >
        <View style={styles.clockModalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close time picker"
            onPress={() => setShowTimePicker(false)}
            style={styles.clockBackdrop}
          />
          <View style={styles.clockPicker}>
            <Text style={styles.clockTitle}>Select due time</Text>
            <View style={styles.clockHeader}>
              <Text style={styles.clockTime}>
                {selectedTime.toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
              <View style={styles.periodOptions}>
                {[false, true].map(isAfternoon => {
                  const selected =
                    (selectedTime.getHours() >= 12) === isAfternoon;
                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      key={isAfternoon ? 'pm' : 'am'}
                      onPress={() => setTimePeriod(isAfternoon)}
                      style={[
                        styles.periodButton,
                        selected && styles.selectedPeriod,
                      ]}
                    >
                      <Text
                        style={[
                          styles.periodText,
                          selected && styles.selectedPeriodText,
                        ]}
                      >
                        {isAfternoon ? 'PM' : 'AM'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.clockTabs}>
              {(['hour', 'minute'] as const).map(step => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: timePickerStep === step }}
                  key={step}
                  onPress={() => setTimePickerStep(step)}
                  style={[
                    styles.clockTab,
                    timePickerStep === step && styles.selectedClockTab,
                  ]}
                >
                  <Text
                    style={[
                      styles.clockTabText,
                      timePickerStep === step && styles.selectedClockTabText,
                    ]}
                  >
                    {step === 'hour' ? 'Hour' : 'Minute'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.timeOptions}
              contentContainerStyle={styles.timeOptionsContent}
            >
              {timePickerStep === 'hour'
                ? clockHours.map(hour => {
                    const selected =
                      selectedTime.getHours() % 12 === hour % 12;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${hour} o'clock`}
                        accessibilityState={{ selected }}
                        key={hour}
                        onPress={() => selectHour(hour)}
                        style={[
                          styles.timeOption,
                          selected && styles.selectedTimeOption,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            selected && styles.selectedTimeOptionText,
                          ]}
                        >
                          {hour}
                        </Text>
                      </Pressable>
                    );
                  })
                : clockMinutes.map(minute => {
                    const selected = selectedTime.getMinutes() === minute;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${minute} minutes`}
                        accessibilityState={{ selected }}
                        key={minute}
                        onPress={() => selectMinute(minute)}
                        style={[
                          styles.timeOption,
                          selected && styles.selectedTimeOption,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            selected && styles.selectedTimeOptionText,
                          ]}
                        >
                          {`${minute}`.padStart(2, '0')}
                        </Text>
                      </Pressable>
                    );
                  })}
            </ScrollView>
            <View style={styles.clockActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowTimePicker(false)}
                style={styles.clockAction}
              >
                <Text style={styles.clockCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={confirmTime}
                style={[styles.clockAction, styles.clockConfirmButton]}
              >
                <Text style={styles.clockConfirmText}>Set time</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateTask;
