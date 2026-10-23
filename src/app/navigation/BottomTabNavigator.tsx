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

const Tab = createBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        options={{
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
