import {darkTheme} from './darkTheme';
import {lightTheme} from './lightTheme';
import {useColorScheme} from 'react-native';

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};