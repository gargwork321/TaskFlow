import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Tasks from '../../features/tasks/screens/Tasks';
import Setting from '../../features/tasks/screens/Setting';
import Calender from '../../features/tasks/screens/Calender';
import Stats from '../../features/tasks/screens/Stats';
import {
  ListChecks,
  CalendarDays,
  ChartNoAxesColumn,
  Settings,
} from 'lucide-react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function TabNavigation() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#08A66C',
        tabBarInactiveTintColor: theme.colors.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 7,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <ListChecks color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calender}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChartNoAxesColumn color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;
