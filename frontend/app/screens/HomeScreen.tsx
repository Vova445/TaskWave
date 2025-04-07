import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Text, useTheme, FAB, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
const [customCategories, setCustomCategories] = useState<string[]>(['Work', 'Personal']);
   
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) setUserName(data.name);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleAddTask = () => {
    if (!newTask.trim()) {
      alert('Task title is required.');
      return;
    }
    if (newTask.length > 100) {
      alert('Task title must be under 100 characters.');
      return;
    }
    if (!category.trim()) {
      alert('Category is required.');
      return;
    }
  
    setTasks((prev) => [...prev, `${newTask.trim()} [${category}]`]);
    setNewTask('');
    setCategory('');
    setModalVisible(false);
  };


  const { isDarkMode } = useThemeContext();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#f7f9fc',
    },
    taskText: {
      marginVertical: 8,
      color: isDarkMode ? '#fff' : '#2d3436',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
      borderRadius: 16,
      padding: 20,
      elevation: 4,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    },
    input: {
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: 'transparent',
      color: isDarkMode ? '#fff' : '#000',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 80,
      borderRadius: 16,
      backgroundColor: '#00b894',
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={{ color: '#00b894', marginBottom: 12 }}>
        Home
      </Text>
      {userName && (
        <Text variant="titleMedium" style={{ color: colors.onBackground, marginBottom: 16 }}>
          Welcome, {userName} 👋
        </Text>
      )}

      {tasks.length === 0 ? (
        <Text style={{ color: colors.outline }}>You have no tasks yet</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={{ marginVertical: 8, color: colors.onBackground }}>{item}</Text>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <FAB
        icon="plus"
        label="Add Task"
        onPress={() => setModalVisible(true)}
        style={[styles.fab, { backgroundColor: '#00b894' }]}
      />

      {/* Modal for task creation */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text variant="titleLarge" style={{ marginBottom: 12 }}>
              New Task
            </Text>
            <TextInput
  label="Task title"
  value={newTask}
  onChangeText={setNewTask}
  maxLength={100}
  mode="outlined"
  style={styles.input}
/>

<TextInput
  label="Category"
  value={category}
  onChangeText={setCategory}
  placeholder="Enter or choose category"
  mode="outlined"
  style={styles.input}
/>

            <View style={styles.modalButtons}>
              <Button onPress={() => setModalVisible(false)}>Cancel</Button>
              <Button mode="contained" onPress={handleAddTask} buttonColor="#00b894">
                Add
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


