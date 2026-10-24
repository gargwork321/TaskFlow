/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './src/app/navigation/BottomTabNavigator';

function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}





export default App;
