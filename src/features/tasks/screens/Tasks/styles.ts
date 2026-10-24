import { StyleSheet } from 'react-native';
import { APP_COLORS } from '../../../../shared/constants/appConstants';

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
      paddingHorizontal: 18,
      paddingTop: 8,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 48,
      marginBottom: 12,
    },
    headerIcon: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: 48,
    },
    headerTitle: {
      color: colors.text,
      flex: 1,
      fontSize: 21,
      fontWeight: '700',
    },
    notificationButton: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    notificationDot: {
      backgroundColor: APP_COLORS.danger,
      borderColor: colors.background,
      borderRadius: 5,
      borderWidth: 1.5,
      height: 10,
      position: 'absolute',
      right: 5,
      top: 5,
      width: 10,
    },
    filters: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    filterButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 15,
      borderWidth: 1,
      flex: 1,
      height: 48,
      justifyContent: 'center',
    },
    selectedFilter: {
      backgroundColor: APP_COLORS.accent,
      borderColor: APP_COLORS.accent,
    },
    filterText: {
      color: colors.secondaryText,
      fontSize: 15,
      fontWeight: '600',
    },
    selectedFilterText: {
      color: '#FFFFFF',
    },
    searchBox: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 15,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 10,
      height: 48,
      marginBottom: 16,
      paddingHorizontal: 14,
    },
    searchIcon: {
      color: colors.secondaryText,
    },
    searchInput: {
      color: colors.text,
      flex: 1,
      fontSize: 15,
      padding: 0,
    },
    listContent: {
      gap: 10,
      paddingBottom: 92,
    },
    itemWrapper: {
      position: 'relative',
    },
    itemWrapperOpen: {
      elevation: 12,
      zIndex: 12,
    },
    itemContainer: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 94,
      paddingHorizontal: 14,
      paddingVertical: 14,
      shadowColor: '#1E293B',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    completionIndicator: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 2,
      height: 24,
      justifyContent: 'center',
      marginRight: 14,
      width: 24,
    },
    completedIndicator: {
      backgroundColor: APP_COLORS.accent,
      borderColor: APP_COLORS.accent,
    },
    completionCheck: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
      lineHeight: 18,
    },
    taskContent: {
      flex: 1,
      gap: 8,
    },
    itemTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    completedTitle: {
      opacity: 0.6,
      textDecorationLine: 'line-through',
    },
    taskMetadataRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 7,
    },
    priorityMetadata: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
    },
    priorityMarker: {
      borderRadius: 3,
      height: 13,
      width: 8,
    },
    priorityText: {
      fontSize: 14,
      fontWeight: '600',
    },
    metadataSeparator: {
      color: colors.secondaryText,
      fontSize: 16,
    },
    taskMetadata: {
      color: colors.secondaryText,
      fontSize: 14,
      fontWeight: '500',
    },
    moreButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 6,
      width: 24,
    },
    iconColor: {
      color: colors.secondaryText,
    },
    menuOverlay: {
      flex: 1,
    },
    menuBackdrop: {
      backgroundColor: 'transparent',
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    taskMenu: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      elevation: 8,
      paddingHorizontal: 6,
      position: 'absolute',
      right: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
      top: 52,
      width: 148,
      zIndex: 20,
    },
    taskMenuItem: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      minHeight: 44,
      paddingHorizontal: 9,
    },
    taskMenuText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '500',
    },
    deleteMenuText: {
      color: APP_COLORS.danger,
      fontSize: 15,
      fontWeight: '500',
    },
    taskMenuDivider: {
      backgroundColor: colors.border,
      height: StyleSheet.hairlineWidth,
      marginHorizontal: 8,
    },
    emptyMessage: {
      color: colors.secondaryText,
      fontSize: 15,
      paddingTop: 28,
      textAlign: 'center',
    },
    addButton: {
      alignItems: 'center',
      backgroundColor: APP_COLORS.accent,
      borderRadius: 32,
      bottom: 22,
      elevation: 6,
      height: 64,
      justifyContent: 'center',
      position: 'absolute',
      right: 22,
      shadowColor: APP_COLORS.accent,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      width: 64,
    },
  });
