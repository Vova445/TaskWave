import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

import RegisterScreen from './app/screens/RegisterScreen';
import LoginScreen from './app/screens/LoginScreen';
import ResetPasswordScreen from './app/screens/ResetPasswordScreen';
import OnboardingScreen from './app/screens/OnboardingScreen';
import BottomTabs from './app/navigation/BottomTabs';
import { ThemeProvider, useThemeContext } from './app/context/ThemeContext';
import { DefaultTheme, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type RootStackParamList = {
  Onboarding: undefined;
  Register: undefined;
  Login: undefined;
  ResetPassword: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const lightScreens = ['Onboarding', 'Register', 'Login', 'ResetPassword'];

function MainApp() {
  const { theme } = useThemeContext();
  const [currentRoute, setCurrentRoute] = React.useState('Onboarding');
  const [initialRoute, setInitialRoute] = React.useState<'Login' | 'Dashboard' | 'Onboarding'>('Onboarding');
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('token');
      const remember = await AsyncStorage.getItem('rememberMe');
  
      if (token && remember === 'true') {
        setInitialRoute('Dashboard');
      } else {
        setInitialRoute('Login');
      }
    };
    checkSession();
  }, []);
  return (
    <NavigationContainer
      onStateChange={(state) => {
        const route = state?.routes[state.index]?.name;
        if (route) setCurrentRoute(route);
      }}
    >
      <PaperProvider theme={lightScreens.includes(currentRoute) ? DefaultTheme : theme}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Dashboard" component={BottomTabs} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
