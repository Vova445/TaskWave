import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, Animated, Dimensions, ScrollView } from 'react-native';
import { Text, useTheme, FAB, TextInput, Button, IconButton, Portal, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';
// Якщо ви в Expo:
import { BlurView } from 'expo-blur';
// Якщо ви не в Expo, замініть рядок імпорту на:
// import { BlurView } from '@react-native-community/blur';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { isDarkMode } = useThemeContext();
  const screenWidth = Dimensions.get('window').width;
  const [fadeAnim] = useState(new Animated.Value(0));

  // Стан для даних користувача та завдань (зберігаємо як обʼєкт для кожного завдання)
  const [userName, setUserName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  // Стан модального вікна та поточної сторінки форми (0-Основне, 1-Деталі, 2-Додатково)
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Обов’язкові поля
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');

  // Необов’язкові поля – група "Деталі"
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [repetition, setRepetition] = useState('');

  // Необов’язкові поля – група "Додатково"
  const [colorMarking, setColorMarking] = useState('');
  const [icon, setIcon] = useState('');
  const [reminder, setReminder] = useState('');
  const [attachments, setAttachments] = useState(null);

  // Add new states
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Робота', 'Навчання', 'Особисте', 'Покупки', 'Здоров\'я']);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Завантаження профілю користувача
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

  // При закритті модального вікна скидаємо всі поля та номер сторінки
  useEffect(() => {
    if (!modalVisible) {
      setCurrentPage(0);
      setNewTask('');
      setCategory('');
      setDescription('');
      setPriority('');
      setDeadline('');
      setExecutionTime('');
      setRepetition('');
      setColorMarking('');
      setIcon('');
      setReminder('');
      setAttachments(null);
    }
  }, [modalVisible]);

  // Add fade animation for modal
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [modalVisible]);

  // Функція створення завдання – здійснює базову валідацію для обов’язкових полів
  const handleAddTask = async () => {
    try {
      setIsLoading(true);
      if (!newTask.trim()) {
        Alert.alert('Помилка', 'Назва завдання є обов’язковою.');
        return;
      }
      if (newTask.length > 100) {
        Alert.alert('Помилка', 'Назва завдання має бути менше 100 символів.');
        return;
      }
      if (!category.trim()) {
        Alert.alert('Помилка', 'Категорія є обов’язковою.');
        return;
      }
      if (description.length > 500) {
        Alert.alert('Помилка', 'Опис має бути до 500 символів.');
        return;
      }
  
      const newTaskData = {
        title: newTask.trim(),
        category: category.trim(),
        description: description.trim(),
        priority: priority.trim(),
        deadline: deadline.trim(),
        executionTime: executionTime.trim(),
        repetition: repetition.trim(),
        colorMarking: colorMarking.trim(),
        icon: icon.trim(),
        reminder: reminder.trim(),
        attachments, // Обробка вкладення може бути реалізована пізніше
      };
  
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setTasks((prev) => [...prev, newTaskData]);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  const handleAddNewCategory = () => {
    if (newCategoryInput.trim()) {
      setCategories(prev => [...prev, newCategoryInput.trim()]);
      setCategory(newCategoryInput.trim());
      setNewCategoryInput('');
      setShowCategoryDropdown(false);
    }
  };

  /** СТИЛІ **/
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDarkMode ? '#121212' : '#f7f9fc',
    },
    headerContainer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    taskText: {
      marginVertical: 8,
      color: isDarkMode ? '#fff' : '#2d3436',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blurContainer: {
      ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
      width: '90%',
      maxWidth: 420,
      borderRadius: 24,
      backgroundColor: isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.9)',
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      overflow: 'hidden',
      paddingBottom: 20,
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalBody: {
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    stepProgress: {
      height: 3,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    navigationTabs: {
      flexDirection: 'row',
      marginBottom: 24,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: 12,
      padding: 4,
    },
    navTab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    activeNavTab: {
      backgroundColor: '#00b894',
    },
    navTabText: {
      textAlign: 'center',
      fontSize: 10,
      fontWeight: '600',
      color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    },
    activeNavTabText: {
      color: '#fff',
    },
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16, // Додано відступи з боків
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    },
    activeStepDot: {
      backgroundColor: '#00b894',
      width: 24,
    },
    input: {
      marginBottom: 16,
      backgroundColor: 'transparent', // Remove background
      overflow: 'hidden',
    },
    inputUnderline: {
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      paddingBottom: 8,
      paddingHorizontal: 0, // Remove horizontal padding
    },
    inputTheme: {
      colors: {
        primary: '#00b894',
        onSurfaceVariant: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        placeholder: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        outline: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      },
    },
    multilineInput: {
      minHeight: 100,
    },
    iconInput: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center', // Додано для вирівнювання по центру
      marginTop: 24,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      paddingHorizontal: 8,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 80,
      borderRadius: 16,
      backgroundColor: '#00b894',
    },
    taskItem: {
      padding: 16,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: 12,
      marginBottom: 12,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    taskDescription: {
      fontSize: 14,
      opacity: 0.8,
    },
    navigationButton: {
      minWidth: 100,
      borderRadius: 12,
      paddingVertical: 8,
    },
    cancelButton: {
      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      borderWidth: 1.5,
    },
    nextButton: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    categoryDropdown: {
      position: 'absolute',
      top: '70%',
      left: 0,
      right: 0,
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 4,
      zIndex: 1000,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    categoryItem: {
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    newCategoryInput: {
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
  });

  // Рендер вмісту форми в залежності від поточної сторінки
  const renderFormPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <>
            <TextInput
              label="Назва (до 100 символів)"  // Changed label text
              value={newTask}
              onChangeText={setNewTask}
              maxLength={100}
              mode="flat"
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894"
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
              dense
            />
            
            <View style={{ marginBottom: 16 }}>
              <TextInput
                label="Категорія"
                value={category}
                onChangeText={setCategory}
                placeholder="Оберіть або створіть категорію"
                mode="flat"
                style={[styles.input, styles.inputUnderline]}
                theme={{
                  ...styles.inputTheme,
                  colors: {
                    ...styles.inputTheme.colors,
                    background: 'transparent',
                  },
                }}
                right={
                  <TextInput.Icon 
                    icon={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                  />
                }
                onFocus={() => setShowCategoryDropdown(true)}
              />
              
              {showCategoryDropdown && (
                <View style={[styles.categoryDropdown, {
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }]}>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={styles.categoryItem}
                        onPress={() => handleCategorySelect(cat)}
                      >
                        <Text style={{ 
                          color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                          padding: 12,
                        }}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <View style={styles.newCategoryInput}>
                    <TextInput
                      placeholder="Створити нову категорію"
                      value={newCategoryInput}
                      onChangeText={setNewCategoryInput}
                      mode="flat"
                      style={[styles.input, styles.inputUnderline]}
                      right={
                        <TextInput.Icon 
                          icon="plus"
                          onPress={handleAddNewCategory}
                          disabled={!newCategoryInput.trim()}
                        />
                      }
                    />
                  </View>
                </View>
              )}
            </View>
          </>
        );
      case 1:
        return (
          <>
            <TextInput
              label="Опис (до 500 символів)"  // Changed label text
              value={description}
              onChangeText={setDescription}
              placeholder="Додайте опис до завдання"  // Simplified placeholder
              maxLength={500}  // Added maxLength
              mode="flat"
              style={[styles.input, styles.inputUnderline, { minHeight: 80 }]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
                textAlignVertical: 'top',
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894"
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
              multiline
              numberOfLines={4}
              dense
            />
            <TextInput
              label="Пріоритет"
              value={priority}
              onChangeText={setPriority}
              placeholder="Низький, Середній, Високий"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
              right={<TextInput.Icon icon="priority-high" />}
            />
            <TextInput
              label="Дата дедлайну"
              value={deadline}
              onChangeText={setDeadline}
              placeholder="Виберіть дату дедлайну"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
              right={<TextInput.Icon icon="calendar" />}
            />
            <TextInput
              label="Час виконання"
              value={executionTime}
              onChangeText={setExecutionTime}
              placeholder="Година:Хвилина"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
            />
            <TextInput
              label="Повторення"
              value={repetition}
              onChangeText={setRepetition}
              placeholder="Одноразово, Щоденно, Щотижнево, Щомісячно або конкретні дні"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextInput
              label="Кольорове маркування"
              value={colorMarking}
              onChangeText={setColorMarking}
              placeholder="Виберіть колір"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
              right={<TextInput.Icon icon="palette" />}
            />
            <TextInput
              label="Іконка"
              
              value={icon}
              onChangeText={setIcon}
              placeholder="Введіть іконку або emoji"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
              right={<TextInput.Icon icon="emoticon-outline" />}
            />
            <TextInput
              label="Нагадування"
              value={reminder}
              onChangeText={setReminder}
              placeholder="Час до дедлайну для нагадування"
              mode="flat" // Change mode to flat
              style={[styles.input, styles.inputUnderline]}
              theme={{
                ...styles.inputTheme,
                colors: {
                  ...styles.inputTheme.colors,
                  background: 'transparent',
                },
              }}
              contentStyle={{ 
                paddingHorizontal: 0,
                paddingVertical: 8,
                fontSize: 15,
              }}
              labelStyle={styles.inputLabel}
              placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              activeUnderlineColor="#00b894" // Add this to control active underline color
              underlineColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} // Add this to control inactive underline color
              textColor={isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'}
            />
            <Button 
              mode="outlined" 
              onPress={() => Alert.alert('Вкладення', 'Функція вкладення доступна для преміум-користувачів')}
              theme={styles.inputTheme}
            >
              Додати Вкладення
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={{ color: '#00b894' }}>
          Home
        </Text>

        {userName && (
          <Text variant="titleMedium" style={{ color: colors.onBackground }}>
            Welcome, {userName} 👋
          </Text>
        )}
      </View>

      {tasks.length === 0 ? (
        <Text style={{ color: colors.outline }}>You have no tasks yet</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={[styles.taskTitle, {color: colors.onBackground}]}>
                {item.title} [{item.category}]
              </Text>
              {item.description && (
                <Text style={[styles.taskDescription, {color: colors.onBackground}]}>
                  {item.description}
                </Text>
              )}
            </View>
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.blurContainer} />
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text variant="titleLarge">Нове завдання</Text>
              <IconButton icon="close" size={24} onPress={() => setModalVisible(false)} />
            </View>

            {/* Progress Bar – оновлено для 3 сторінок */}
            <ProgressBar
              progress={(currentPage + 1) / 3}
              color="#00b894"
              style={styles.stepProgress}
            />

            <View style={styles.modalBody}>
              {/* Navigation Tabs */}
              <View style={styles.navigationTabs}>
                {['Основне', 'Деталі', 'Додатково'].map((tab, index) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.navTab,
                      currentPage === index && styles.activeNavTab,
                    ]}
                    onPress={() => setCurrentPage(index)}
                  >
                    <Text
                      style={[
                        styles.navTabText,
                        currentPage === index && styles.activeNavTabText,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Вміст поточної сторінки */}
              {renderFormPage()}

              {/* Кнопки навігації */}
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    if (currentPage === 0) {
                      setModalVisible(false);
                    } else {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  style={[styles.navigationButton, styles.cancelButton]}
                  labelStyle={{ 
                    fontSize: 12,
                    fontWeight: '600',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                  }}
                >
                  {currentPage === 0 ? 'Скасувати' : 'Назад'}
                </Button>

                {/* Step Indicators - перенесено сюди */}
                <View style={[styles.stepIndicator, { marginBottom: 0 }]}>
                  {[0, 1, 2].map((step) => (
                    <View
                      key={step}
                      style={[
                        styles.stepDot,
                        currentPage === step && styles.activeStepDot,
                      ]}
                    />
                  ))}
                </View>

                <Button
                  mode="contained"
                  buttonColor="#00b894"
                  loading={isLoading}
                  disabled={isLoading}
                  onPress={currentPage < 2 ? () => setCurrentPage(currentPage + 1) : handleAddTask}
                  style={[styles.navigationButton, styles.nextButton]}
                  labelStyle={{ 
                    fontSize: 12,
                    fontWeight: '600'
                  }}
                  contentStyle={{
                    height: 40,
                  }}
                >
                  {currentPage < 2 ? 'Далі' : 'Створити'}
                </Button>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}