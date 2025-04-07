import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserName(data.name);
        } else {
          console.warn('Помилка профілю:', data.message);
        }
      } catch (error) {
        console.error('Помилка запиту профілю:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={{ color: '#00b894', marginBottom: 12 }}>
        Головна
      </Text>
      {userName && (
        <Text variant="titleMedium" style={{ color: colors.onBackground }}>
          Вітаємо, {userName} 👋
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
