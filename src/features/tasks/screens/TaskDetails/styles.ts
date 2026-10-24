import { StyleSheet } from 'react-native';

export const createTaskDetailsStyles = (colors: {
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
    scrollContent: {
      paddingBottom: 36,
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 54,
      justifyContent: 'space-between',
      marginBottom: 22,
    },
    headerButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
    },
    taskSummary: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginBottom: 26,
    },
    completionButton: {
      alignItems: 'center',
      borderColor: colors.primary,
      borderRadius: 20,
      borderWidth: 2,
      height: 40,
      justifyContent: 'center',
      marginRight: 16,
      marginTop: 4,
      width: 40,
    },
    completedButton: {
      backgroundColor: colors.primary,
    },
    completionCheck: {
      color: colors.surface,
      fontSize: 21,
      fontWeight: '700',
    },
    summaryContent: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 29,
      marginBottom: 10,
    },
    completedTitle: {
      opacity: 0.65,
      textDecorationLine: 'line-through',
    },
    metadata: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    priorityBadge: {
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },
    priorityDot: {
      borderRadius: 4,
      height: 8,
      width: 8,
    },
    priorityText: {
      fontSize: 14,
      fontWeight: '600',
    },
    dueDate: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    dueDateText: {
      color: colors.secondaryText,
      fontSize: 14,
      fontWeight: '500',
    },
    description: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 25,
      marginBottom: 24,
    },
    actions: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
      paddingBottom: 18,
    },
    actionButton: {
      alignItems: 'center',
      gap: 8,
      minWidth: 76,
      padding: 8,
    },
    actionText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    deleteActionText: {
      color: '#EF4444',
      fontSize: 14,
      fontWeight: '600',
    },
    detailRow: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      minHeight: 62,
      paddingVertical: 8,
    },
    detailRowIcon: {
      color: colors.text,
      marginHorizontal: 4,
      marginRight: 16,
    },
    detailRowText: {
      color: colors.text,
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
    },
    detailRowValue: {
      color: colors.secondaryText,
      fontSize: 14,
    },
    chevron: {
      color: colors.secondaryText,
      marginLeft: 8,
    },
    syncValue: {
      fontSize: 14,
      fontWeight: '600',
    },
    timestampRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 18,
    },
    timestampLabel: {
      color: colors.secondaryText,
      fontSize: 14,
    },
    timestampValue: {
      color: colors.secondaryText,
      fontSize: 14,
      textAlign: 'right',
    },
    optionModalOverlay: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    optionModalBackdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    optionModalCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      elevation: 8,
      maxWidth: 400,
      paddingHorizontal: 18,
      paddingTop: 18,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      width: '100%',
    },
    optionModalTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 8,
    },
    optionModalAction: {
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: 4,
    },
    optionModalActionText: {
      color: colors.text,
      fontSize: 16,
    },
    optionModalDestructiveText: {
      color: '#EF4444',
      fontWeight: '600',
    },
    optionModalDivider: {
      backgroundColor: colors.border,
      height: StyleSheet.hairlineWidth,
    },
  });
