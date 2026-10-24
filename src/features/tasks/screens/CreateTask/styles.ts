import { StyleSheet } from 'react-native';

export const createCreateTaskStyles = (colors: {
  background: string;
  surface: string;
  text: string;
  secondaryText: string;
  border: string;
  primary: string;
}) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 28,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 56,
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    headerButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 48,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
    },
    saveButton: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 48,
    },
    saveText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '700',
    },
    fieldGroup: {
      marginBottom: 22,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 9,
    },
    field: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 13,
      borderWidth: 1,
      color: colors.text,
      fontSize: 16,
      minHeight: 54,
      paddingHorizontal: 15,
      paddingVertical: 13,
    },
    description: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    priorityOptions: {
      flexDirection: 'row',
      gap: 10,
    },
    priorityButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 13,
      borderWidth: 1,
      flex: 1,
      height: 50,
      justifyContent: 'center',
    },
    priorityText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    inlineField: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 13,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 54,
      paddingHorizontal: 15,
    },
    inlineInput: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      paddingVertical: 13,
    },
    placeholderText: {
      color: colors.secondaryText,
    },
    inlineIcon: {
      color: colors.secondaryText,
    },
    clockPicker: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 10,
      padding: 12,
    },
    clockHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    clockTime: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '700',
    },
    periodOptions: {
      backgroundColor: colors.background,
      borderRadius: 10,
      flexDirection: 'row',
      padding: 3,
    },
    periodButton: {
      alignItems: 'center',
      borderRadius: 8,
      justifyContent: 'center',
      minWidth: 42,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    selectedPeriod: {
      backgroundColor: colors.primary,
    },
    periodText: {
      color: colors.secondaryText,
      fontSize: 13,
      fontWeight: '600',
    },
    selectedPeriodText: {
      color: colors.surface,
    },
    clockTabs: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      marginBottom: 8,
    },
    clockTab: {
      alignItems: 'center',
      borderBottomColor: 'transparent',
      borderBottomWidth: 2,
      flex: 1,
      paddingVertical: 9,
    },
    selectedClockTab: {
      borderBottomColor: colors.primary,
    },
    clockTabText: {
      color: colors.secondaryText,
      fontSize: 14,
      fontWeight: '600',
    },
    selectedClockTabText: {
      color: colors.primary,
    },
    timeOptions: {
      maxHeight: 252,
    },
    timeOptionsContent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    timeOption: {
      alignItems: 'center',
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      width: '16.6667%',
    },
    selectedTimeOption: {
      backgroundColor: colors.primary,
    },
    timeOptionText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedTimeOptionText: {
      color: colors.surface,
      fontWeight: '700',
    },
    calendar: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 10,
      padding: 12,
    },
    calendarHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    monthButton: {
      alignItems: 'center',
      borderRadius: 20,
      height: 38,
      justifyContent: 'center',
      width: 38,
    },
    monthTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    weekday: {
      color: colors.secondaryText,
      fontSize: 12,
      fontWeight: '600',
      height: 32,
      textAlign: 'center',
      textAlignVertical: 'center',
      width: '14.2857%',
    },
    dayCell: {
      alignItems: 'center',
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      width: '14.2857%',
    },
    selectedDay: {
      backgroundColor: colors.primary,
    },
    dayText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedDayText: {
      color: colors.surface,
      fontWeight: '700',
    },
    todayButton: {
      alignSelf: 'flex-end',
      marginTop: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    todayText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    selector: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 13,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 54,
      paddingHorizontal: 15,
      width: '100%',
    },
    selectorIcon: {
      color: colors.primary,
      marginRight: 10,
    },
    selectorText: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      marginVertical: 0,
      paddingVertical: 0,
    },
    dropdownMenu: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      overflow: 'hidden',
    },
    dropdownItem: {
      backgroundColor: colors.surface,
    },
    dropdownItemText: {
      color: colors.text,
      fontSize: 15,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 14,
      marginTop: 8,
    },
    helperText: {
      color: colors.secondaryText,
      fontSize: 13,
      marginTop: 7,
    },
  });
