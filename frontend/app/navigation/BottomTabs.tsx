import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00b894',
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.elevation.level2,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let icon = '';
          switch (route.name) {
            case 'Home':
              icon = 'home-outline';
              break;
            case 'Calendar':
              icon = 'calendar-month-outline';
              break;
            case 'Categories':
              icon = 'view-grid-outline';
              break;
            case 'Profile':
              icon = 'account-circle-outline';
              break;
          }
          return <Icon name={icon} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
