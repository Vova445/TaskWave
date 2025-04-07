import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Card } from 'react-native-paper';

const mockTasks = [
  { id: '1', title: 'Завершити презентацію' },
  { id: '2', title: 'Полити рослини в теплиці' },
  { id: '3', title: 'Запланувати зустріч' },
];

export default function DashboardScreen({ navigation }: any) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Задачі на сьогодні
      </Text>

      <FlatList
        data={mockTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.taskCard}>
            <Card.Title title={item.title} />
          </Card>
        )}
      />

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => alert('Форма додавання задачі')}
      >
        Додати задачу
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  taskCard: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#00b894',
  },
});
