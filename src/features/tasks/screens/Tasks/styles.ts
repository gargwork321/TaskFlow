import { StyleSheet } from 'react-native';

export const createTasksStyles = (colors: {
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
      padding: 16,
    },
    searchBox: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 8,
      marginBottom: 16,
      borderRadius: 12,
    },
    itemContainer: {
      backgroundColor: colors.surface,
      padding: 16,
      marginBottom: 8,
      borderRadius: 8,
      borderLeftWidth: 4,
    },
    taskHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    taskContent: {
      flex: 1,
      gap: 4,
    },
    itemTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    completedTitle: {
      textDecorationLine: 'line-through',
      opacity: 0.65,
    },
    itemDescription: {
      color: colors.secondaryText,
      fontSize: 14,
    },
    completionIndicator: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    completedIndicator: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    completionCheck: {
      color: colors.surface,
      fontSize: 13,
      lineHeight: 16,
      fontWeight: '700',
    },
    taskFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      gap: 8,
      flexWrap: 'wrap',
    },
    taskMetadata: {
      color: colors.secondaryText,
      fontSize: 12,
    },
    syncStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    syncIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    syncedIndicator: {
      backgroundColor: '#22C55E',
    },
    pendingIndicator: {
      backgroundColor: '#EAB308',
    },
    failedIndicator: {
      backgroundColor: '#EF4444',
    },
    addButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: colors.primary,
      height:60,
      width:60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
    },
    addButtonText: {
      color: 'white',
      fontSize: 30,
      flex: 1,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  });
