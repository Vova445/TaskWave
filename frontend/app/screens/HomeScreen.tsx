import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, Animated, Dimensions, ScrollView, Platform } from 'react-native';
import { Text, useTheme, FAB, TextInput, Button, IconButton, Portal, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';
// Якщо ви в Expo:
import { BlurView } from 'expo-blur';
// Якщо ви не в Expo, замініть рядок імпорту на:
// import { BlurView } from '@react-native-community/blur';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  // Додайте новий state для зберігання посилань на TextInput
  const [inputRefs] = useState({
    title: React.createRef<any>(),
    category: React.createRef<any>(),
    description: React.createRef<any>(),
    priority: React.createRef<any>(),
    deadline: React.createRef<any>(),
    executionTime: React.createRef<any>(),
    repetition: React.createRef<any>(),
    colorMarking: React.createRef<any>(),
    icon: React.createRef<any>(),
    reminder: React.createRef<any>(),
  });

  // First add a new state for priority dropdown
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const priorityOptions = ['Низький', 'Середній', 'Високий'];

  // Додайте нові стани
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [androidPickerShow, setAndroidPickerShow] = useState(false);

  // Add new states for time picker
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Add new states and constants
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Додайте нові стани
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIconTab, setSelectedIconTab] = useState('emoji');

  // Додайте константи для іконок
  const iconCategories = {
    emoji: [
      { icon: '📅', label: 'Календар' },
      { icon: '📚', label: 'Книга' },
      { icon: '💻', label: 'Комп\'ютер' },
      { icon: '📝', label: 'Нотатки' },
      { icon: '🎯', label: 'Ціль' },
      { icon: '⭐', label: 'Зірка' },
      { icon: '🏃', label: 'Біг' },
      { icon: '🎨', label: 'Мистецтво' },
      { icon: '🛒', label: 'Покупки' },
      { icon: '🏠', label: 'Дім' },
      { icon: '💪', label: 'Спорт' },
      { icon: '🎵', label: 'Музика' },
    ],
    material: [
      { icon: 'home', label: 'Дім' },
      { icon: 'book', label: 'Книга' },
      { icon: 'shopping-cart', label: 'Покупки' },
      { icon: 'alarm', label: 'Будильник' },
      { icon: 'star', label: 'Зірка' },
      { icon: 'calendar', label: 'Календар' },
      { icon: 'pencil', label: 'Олівець' },
      { icon: 'heart', label: 'Серце' },
      { icon: 'check', label: 'Галочка' },
      { icon: 'bell', label: 'Дзвінок' },
      { icon: 'briefcase', label: 'Портфель' },
      { icon: 'flag', label: 'Прапор' },
    ],
  };

  // Update color palette with better colors and add labels
  const colorPalette = [
    { color: '#FF6B6B', label: 'Червоний' },
    { color: '#4ECDC4', label: 'Бірюзовий' },
    { color: '#45B7D1', label: 'Голубий' },
    { color: '#96CEB4', label: 'М\'ятний' },
    { color: '#FFD93D', label: 'Жовтий' },
    { color: '#FF9F9F', label: 'Рожевий' },
    { color: '#9B59B6', label: 'Фіолетовий' },
    { color: '#3498DB', label: 'Синій' },
    { color: '#FF9F43', label: 'Оранжевий' },
    { color: '#1ABC9C', label: 'Смарагдовий' },
    { color: '#2ECC71', label: 'Зелений' },
    { color: '#74B9FF', label: 'Небесний' },
  ];

  // Add helper function for time formatting
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

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

  // Add new state to track active dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Add function to handle dropdown toggling
  const handleDropdownToggle = (dropdownName: string) => {
    // If clicking the same dropdown that's already open, close it
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      // Close previous dropdown and open the new one
      setActiveDropdown(dropdownName);
    }

    // Set specific dropdown states
    setShowCategoryDropdown(dropdownName === 'category');
    setShowDatePicker(dropdownName === 'date');
    setShowTimePicker(dropdownName === 'time');
    setShowColorPicker(dropdownName === 'color');
    setShowIconPicker(dropdownName === 'icon');
    setAndroidPickerShow(dropdownName === 'date' && Platform.OS === 'android');
    setShowReminderDropdown(dropdownName === 'reminder');
  };

  // Add new state for reminder dropdown
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);

  // Add reminder options
  const reminderOptions = [
    { value: '0', label: 'В момент дедлайну' },
    { value: '5', label: 'За 5 хвилин' },
    { value: '15', label: 'За 15 хвилин' },
    { value: '30', label: 'За 30 хвилин' },
    { value: '60', label: 'За 1 годину' },
    { value: '120', label: 'За 2 години' },
    { value: '1440', label: 'За 1 день' },
    { value: '2880', label: 'За 2 дні' },
    { value: '10080', label: 'За 1 тиждень' },
  ];

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

  // Update handlePageChange to use new function
  const handlePageChange = (newPage: number) => {
    Object.values(inputRefs).forEach(ref => {
      ref.current?.blur();
    });
    handleDropdownToggle(''); // Close all dropdowns
    setCurrentPage(newPage);
  };

  // Додайте функцію для форматування дати
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    prioritySelector: {
      marginBottom: 16,
    },
    priorityLabel: {
      fontSize: 12,
      marginBottom: 8,
      color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    },
    priorityOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    priorityOption: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    priorityOptionSelected: {
      backgroundColor: '#00b894',
      borderColor: '#00b894',
    },
    priorityText: {
      fontSize: 14,
      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    },
    priorityTextSelected: {
      color: '#ffffff',
    },
    colorPickerContainer: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 4,
      marginBottom: 16,
      padding: 12,
      zIndex: 1000,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      maxHeight: 280, 
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    colorOption: {
      width: '48%',
      height: 44, // Fixed height instead of aspectRatio
      borderRadius: 8,
      marginBottom: 12,
      
      borderWidth: 2,
      borderColor: 'transparent',
      overflow: 'hidden',
    },
    colorOptionInner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    colorOptionSelected: {
      borderColor: isDarkMode ? '#ffffff' : '#000000',
      
    },
    colorPreview: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      
    },
    colorLabel: {
      flex: 1,
      fontSize: 13,
      color: '#ffffff',
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    selectedColorPreview: {
      width: 15,
      height: 15,
      borderRadius: 10,
      marginRight: 24,
      marginTop: 30,
      zIndex: 333333,
    },
    iconPickerContainer: {
      marginBottom: 16,
    
    },
    iconPreview: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      
      
    },
    iconPickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      marginBottom: 16,
      
    },
    iconPickerTabs: {
      flexDirection: 'row',
      marginBottom: 12,
     
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: 8,
      padding: 4,
      
    },
    iconPickerTab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 6,
      
    },
    iconPickerTabActive: {
      backgroundColor: '#00b894',
    },
    iconPickerTabText: {
      fontSize: 12,
      color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    },
    iconPickerTabTextActive: {
      color: '#ffffff',
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'space-between',
      
    },
    iconOption: {
      width: '20%',
      aspectRatio: 1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      
      // marginBottom: 8,
    },
    iconOptionSelected: {
      backgroundColor: '#00b894',
    },
    iconOptionText: {
      fontSize: 24,
    },
    iconLabel: {
      fontSize: 8,
      marginTop: 4,
      marginBottom: 4,
      color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
      textAlign: 'center',
    },
    reminderOption: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    reminderOptionSelected: {
      backgroundColor: '#00b894',
    },
    reminderOptionText: {
      fontSize: 12,
      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    },
    reminderOptionTextSelected: {
      color: '#ffffff',
    },
  });

  // Рендер вмісту форми в залежності від поточної сторінки
  const renderFormPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <>
            <TextInput
              ref={inputRefs.title}
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
                ref={inputRefs.category}
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
                    onPress={() => handleDropdownToggle('category')}
                    color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                  />
                }
                onFocus={() => handleDropdownToggle('category')}
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
              ref={inputRefs.description}
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
            <View style={styles.prioritySelector}>
              <Text style={styles.priorityLabel}>Пріоритет</Text>
              <View style={styles.priorityOptions}>
                {priorityOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.priorityOption,
                      priority === option && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setPriority(option)}
                  >
                    <Text style={[
                      styles.priorityText,
                      priority === option && styles.priorityTextSelected,
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDropdownToggle('date')}
            >
              <TextInput
                ref={inputRefs.deadline}
                label="Дата дедлайну"
                value={formatDate(deadline ? new Date(deadline) : null)}
                mode="flat"
                style={[styles.input, styles.inputUnderline]}
                theme={{
                  ...styles.inputTheme,
                  colors: {
                    ...styles.inputTheme.colors,
                    background: 'transparent',
                  },
                }}
                editable={false}
                right={
                  <TextInput.Icon 
                    icon="calendar" 
                    onPress={() => handleDropdownToggle('date')}
                  />
                }
              />
            </TouchableOpacity>
            {/* Для iOS */}
            {Platform.OS === 'ios' && showDatePicker && (
              <DateTimePicker
                value={deadline ? new Date(deadline) : new Date()}
                mode="date"
                display="inline"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setDeadline(selectedDate.toISOString());
                  }
                  setShowDatePicker(false);
                }}
                minimumDate={new Date()}
              />
            )}
            {/* Для Android */}
            {Platform.OS === 'android' && androidPickerShow && (
              <DateTimePicker
                value={deadline ? new Date(deadline) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setAndroidPickerShow(false);
                  if (event.type === 'set' && selectedDate) {
                    setDeadline(selectedDate.toISOString());
                  }
                }}
                minimumDate={new Date()}
              />
            )}
            <TouchableOpacity
              onPress={() => handleDropdownToggle('time')}
            >
              <TextInput
                ref={inputRefs.executionTime}
                label="Час виконання"
                value={executionTime}
                mode="flat"
                style={[styles.input, styles.inputUnderline]}
                theme={{
                  ...styles.inputTheme,
                  colors: {
                    ...styles.inputTheme.colors,
                    background: 'transparent',
                  },
                }}
                editable={false}
                right={
                  <TextInput.Icon 
                    icon="clock-outline"
                    onPress={() => handleDropdownToggle('time')}
                  />
                }
              />
            </TouchableOpacity>

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={executionTime ? new Date(`2000-01-01T${executionTime}:00`) : new Date()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (event.type === 'set' && selectedTime) {
                    const hours = selectedTime.getHours().toString().padStart(2, '0');
                    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                    setExecutionTime(`${hours}:${minutes}`);
                  }
                }}
              />
            )}
          </>
        );
      case 2:
        return (
          <>
            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity onPress={() => handleDropdownToggle('color')}>
                <TextInput
                  ref={inputRefs.colorMarking}
                  label="Кольорове маркування"
                  value={colorMarking ? colorPalette.find(c => c.color === colorMarking)?.label : ''}
                  mode="flat"
                  style={[styles.input, styles.inputUnderline]}
                  theme={{
                    ...styles.inputTheme,
                    colors: {
                      ...styles.inputTheme.colors,
                      background: 'transparent',
                    },
                  }}
                  editable={false}
                  right={
                    <TextInput.Icon 
                      icon="palette"
                      onPress={() => handleDropdownToggle('color')}
                    />
                  }
                  left={colorMarking ? 
                    <TextInput.Icon 
                      icon="circle" 
                      style={[styles.selectedColorPreview, { backgroundColor: colorMarking }]} 
                      color={colorMarking} 
                      size={16} 
                      onPress={() => handleDropdownToggle('color')}
                    /> : undefined
                  }
                />
              </TouchableOpacity>

              {showColorPicker && (
                <ScrollView style={[styles.colorPickerContainer, {
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }]}>
                  <View style={styles.colorGrid}>
                    {colorPalette.map(({ color, label }) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          colorMarking === color && styles.colorOptionSelected
                        ]}
                        onPress={() => {
                          setColorMarking(color);
                          setShowColorPicker(false);
                        }}
                      >
                        <View style={[styles.colorOptionInner, { backgroundColor: color }]}>
                          <View style={[styles.colorPreview]} />
                          <Text style={styles.colorLabel} numberOfLines={1}>
                            {label}
                          </Text>
                          {colorMarking === color && (
                            <IconButton 
                              icon="check" 
                              iconColor="#ffffff" 
                              size={16}
                              style={{ margin: 0, marginLeft: 'auto' }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
            <View style={styles.iconPickerContainer}>
              <TouchableOpacity
                onPress={() => handleDropdownToggle('icon')}
                style={styles.iconPickerHeader}
              >
                <View style={styles.iconPreview}>
                  {icon ? (
                    selectedIconTab === 'emoji' ? (
                      <Text style={{ fontSize: 24 }}>{icon}</Text>
                    ) : (
                      <IconButton icon={icon} size={24} />
                    )
                  ) : (
                    <IconButton icon="emoticon-outline" size={24} />
                  )}
                </View>
                <Text style={{ 
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                  flex: 1 
                }}>
                  {icon ? 'Обрана іконка' : 'Оберіть іконку'}
                </Text>
                <IconButton 
                  icon={showIconPicker ? 'chevron-up' : 'chevron-down'}
                  onPress={() => handleDropdownToggle('icon')}
                />
              </TouchableOpacity>

              {showIconPicker && (
                <View style={[styles.colorPickerContainer, {
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }]}>
                  <View style={styles.iconPickerTabs}>
                    {['emoji', 'material'].map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.iconPickerTab,
                          selectedIconTab === tab && styles.iconPickerTabActive,
                        ]}
                        onPress={() => setSelectedIconTab(tab)}
                      >
                        <Text style={[
                          styles.iconPickerTabText,
                          selectedIconTab === tab && styles.iconPickerTabTextActive,
                        ]}>
                          {tab === 'emoji' ? 'Emoji' : 'Іконки'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <ScrollView style={{ maxHeight: 280 }}>
                    <View style={styles.iconGrid}>
                      {iconCategories[selectedIconTab].map((item) => (
                        <TouchableOpacity
                          key={item.icon}
                          style={[
                            styles.iconOption,
                            icon === item.icon && styles.iconOptionSelected,
                          ]}
                          onPress={() => {
                            setIcon(item.icon);
                            setShowIconPicker(false);
                          }}
                        >
                          {selectedIconTab === 'emoji' ? (
                            <Text style={styles.iconOptionText}>{item.icon}</Text>
                          ) : (
                            <IconButton icon={item.icon} size={24} />
                          )}
                          <Text style={styles.iconLabel} numberOfLines={1}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity onPress={() => handleDropdownToggle('reminder')}>
                <TextInput
                  ref={inputRefs.reminder}
                  label="Нагадування"
                  value={reminder ? reminderOptions.find(opt => opt.value === reminder)?.label : ''}
                  mode="flat"
                  style={[styles.input, styles.inputUnderline]}
                  theme={{
                    ...styles.inputTheme,
                    colors: {
                      ...styles.inputTheme.colors,
                      background: 'transparent',
                    },
                  }}
                  editable={false}
                  right={
                    <TextInput.Icon 
                      icon="bell-outline"
                      onPress={() => handleDropdownToggle('reminder')}
                    />
                  }
                />
              </TouchableOpacity>

              {showReminderDropdown && (
                <View style={[styles.colorPickerContainer, {
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  maxHeight: 300,
                }]}>
                  <ScrollView>
                    {reminderOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.reminderOption,
                          reminder === option.value && styles.reminderOptionSelected,
                        ]}
                        onPress={() => {
                          setReminder(option.value);
                          setShowReminderDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.reminderOptionText,
                          reminder === option.value && styles.reminderOptionTextSelected,
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
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
                    onPress={() => handlePageChange(index)}  // Замість setCurrentPage(index)
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
                      handlePageChange(currentPage - 1);  // Замість setCurrentPage(currentPage - 1)
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
                  onPress={currentPage < 2 ? () => handlePageChange(currentPage + 1) : handleAddTask}  // Замість setCurrentPage(currentPage + 1)
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