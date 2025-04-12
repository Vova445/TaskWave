import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList,  TouchableOpacity, Alert, Animated, Dimensions, ScrollView, Platform, SectionList } from 'react-native';
import { Text, useTheme, FAB, TextInput, Button, IconButton, Portal, ProgressBar, Dialog, Paragraph, Modal, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TaskItem from '../components/TaskItem';
import TaskFilters, { TaskFilter } from '../components/TaskFilters';
import AddTaskModal from '../components/AddTaskModal';
import AlertDialog from '../components/AlertDialog';
import { useHomeStyles } from '../styles/homeStyles';
import { useTranslation } from 'react-i18next';

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

const formatDateKey = (date: Date) => {
  const { t, i18n } = useTranslation();
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  
  return date.toLocaleDateString(i18n.language, options);
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const { isDarkMode } = useThemeContext();
  const screenWidth = Dimensions.get('window').width;
  const [fadeAnim] = useState(new Animated.Value(0));
  const styles = useHomeStyles(isDarkMode);
  const { t } = useTranslation();

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortAnchor, setSortAnchor] = useState({ x: 0, y: 0 });
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'category' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [userName, setUserName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');

  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [repetition, setRepetition] = useState('');

  const [colorMarking, setColorMarking] = useState('');
  const [icon, setIcon] = useState('');
  const [reminder, setReminder] = useState('');
  const [attachments, setAttachments] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([t('categories.work'), t('categories.study'), t('categories.personal'), t('categories.shopping'), t('categories.health')]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

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

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const priorityOptions = [t('priority.low'), t('priority.medium'), t('priority.high')];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [androidPickerShow, setAndroidPickerShow] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIconTab, setSelectedIconTab] = useState('emoji');

  const iconCategories = {
    emoji: [
      { icon: '📅', label: t('icons.calendar') },
      { icon: '📚', label: t('icons.book') },
      { icon: '💻', label: t('icons.computer') },
      { icon: '📝', label: t('icons.notes') },
      { icon: '🎯', label: t('icons.goal') },
      { icon: '⭐', label: t('icons.star') },
      { icon: '🏃', label: t('icons.run') },
      { icon: '🎨', label: t('icons.art') },
      { icon: '🛒', label: t('icons.shopping') },
      { icon: '🏠', label: t('icons.home') },
      { icon: '💪', label: t('icons.sport') },
      { icon: '🎵', label: t('icons.music') },
    ],
    material: [
      { icon: 'home', label: t('icons.home') },
      { icon: 'book', label: t('icons.book') },
      { icon: 'shopping-cart', label: t('icons.shopping') },
      { icon: 'alarm', label: t('icons.alarm') },
      { icon: 'star', label: t('icons.star') },
      { icon: 'calendar', label: t('icons.calendar') },
      { icon: 'pencil', label: t('icons.pencil') },
      { icon: 'heart', label: t('icons.heart') },
      { icon: 'check', label: t('icons.check') },
      { icon: 'bell', label: t('icons.bell') },
      { icon: 'briefcase', label: t('icons.briefcase') },
      { icon: 'flag', label: t('icons.flag') },
    ],
  };
  
  const colorPalette = [
    { color: '#FF6B6B', label: t('colors.red') },
    { color: '#4ECDC4', label: t('colors.turquoise') },
    { color: '#45B7D1', label: t('colors.skyblue') },
    { color: '#96CEB4', label: t('colors.mint') },
    { color: '#FFD93D', label: t('colors.yellow') },
    { color: '#FF9F9F', label: t('colors.pink') },
    { color: '#9B59B6', label: t('colors.purple') },
    { color: '#3498DB', label: t('colors.blue') },
    { color: '#FF9F43', label: t('colors.orange') },
    { color: '#1ABC9C', label: t('colors.emerald') },
    { color: '#2ECC71', label: t('colors.green') },
    { color: '#74B9FF', label: t('colors.lightblue') },
  ];

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

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

  useEffect(() => {
    if (!modalVisible) {
      handleDropdownToggle('');
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
      setNewCategoryInput('');
      setSelectedIconTab('emoji');
      setCategories([t('categories.work'), t('categories.study'), t('categories.personal'), t('categories.shopping'), t('categories.health')]);
    }
  }, [modalVisible]);

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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (dropdownName: string) => {
    if (!dropdownName) {
      setActiveDropdown(null);
      setShowCategoryDropdown(false);
      setShowDatePicker(false);
      setShowTimePicker(false);
      setShowColorPicker(false);
      setShowIconPicker(false);
      setAndroidPickerShow(false);
      setShowReminderDropdown(false);
      
      return;
    }
    
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
    setShowCategoryDropdown(dropdownName === 'category');
    setShowDatePicker(dropdownName === 'date');
    setShowTimePicker(dropdownName === 'time');
    setShowColorPicker(dropdownName === 'color');
    setShowIconPicker(dropdownName === 'icon');
    setAndroidPickerShow(dropdownName === 'date' && Platform.OS === 'android');
    setShowReminderDropdown(dropdownName === 'reminder');
  };
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);

  const reminderOptions = [
    { value: '0', label: t('reminder.atDeadline') },
    { value: '5', label: t('reminder.minutesBefore', { minutes: 5 }) },
    { value: '15', label: t('reminder.minutesBefore', { minutes: 15 }) },
    { value: '30', label: t('reminder.minutesBefore', { minutes: 30 }) },
    { value: '60', label: t('reminder.hoursBefore', { hours: 1 }) },
    { value: '120', label: t('reminder.hoursBefore', { hours: 2 }) },
    { value: '1440', label: t('reminder.daysBefore', { days: 1 }) },
    { value: '2880', label: t('reminder.daysBefore', { days: 2 }) },
    { value: '10080', label: t('reminder.weeksBefore', { weeks: 1 }) },
  ];

  const [alert, setAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'error' | 'success' | 'warning';
    onConfirm?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const [taskFilter, setTaskFilter] = useState<TaskFilter>(TaskFilter.ALL);

  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = async () => {
    try {
      setIsLoading(true);
      
      if (!newTask.trim()) {
        setAlert({
          visible: true,
          title: t('alert.error'),
          message: t('alert.taskNameRequired'),
          type: 'error'
        });
        return;
      }
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setAlert({
          visible: true,
          title: t('alert.error'),
          message: t('alert.loginRequired'),
          type: 'error'
        });
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
        colorMarking: colorMarking, 
        icon: icon,
        reminder: reminder.trim(),
      };
  
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTaskData)
      });
  
      if (!response.ok) {
        throw new Error(t('alert.taskCreationFailed'));
      }
  
      const savedTask = await response.json();
      setTasks(prev => [savedTask, ...prev]);
      setModalVisible(false);
      
      setAlert({
        visible: true,
        title: t('alert.success'),
        message: t('alert.taskCreated'),
        type: 'success'
      });
    } catch (error) {
      setAlert({
        visible: true,
        title: t('alert.error'),
        message: t('alert.taskCreationFailed'),
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
  
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(t('alert.taskLoadFailed'));
      }
  
      const tasks = await response.json();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setAlert({
        visible: true,
        title: t('alert.error'),
        message: t('alert.taskLoadFailed'),
        type: 'error'
      });
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);

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

  const handlePageChange = (newPage: number) => {
    Object.values(inputRefs).forEach(ref => {
      ref.current?.blur();
    });
    handleDropdownToggle('');
    setCurrentPage(newPage);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortTasks = (tasksToSort: any[]) => {
    if (!sortBy) return tasksToSort;

    return [...tasksToSort].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;

      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { [t('priority.high')]: 3, [t('priority.medium')]: 2, [t('priority.low')]: 1 };
          return multiplier * ((priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
        }
        case 'date': {
          const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
          const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
          return multiplier * (dateA - dateB);
        }
        case 'category': {
          return multiplier * (a.category || '').localeCompare(b.category || '');
        }
        default:
          return 0;
      }
    });
  };

  const groupTasksByDate = (tasks: any[]) => {
    let filteredTasks = tasks;
    
    switch (taskFilter) {
      case TaskFilter.ACTIVE:
        filteredTasks = tasks.filter(task => !task.isCompleted);
        break;
      case TaskFilter.COMPLETED:
        filteredTasks = tasks.filter(task => task.isCompleted);
        break;
      default:
        filteredTasks = tasks;
    }
  
    if (searchQuery.trim()) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  
    const sortedTasks = sortTasks(filteredTasks);
  
    const groups = sortedTasks.reduce((acc, task) => {
      if (!task.deadline) {
        const noDateKey = t('dates.noDeadline');
        acc[noDateKey] = acc[noDateKey] || [];
        acc[noDateKey].push(task);
        return acc;
      }
  
      const date = new Date(task.deadline);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      let dateKey;
      if (isSameDay(date, today)) {
        dateKey = t('dates.today');
      } else if (isSameDay(date, tomorrow)) {
        dateKey = t('dates.tomorrow');
      } else {
        dateKey = formatDateKey(date);
      }
  
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(task);
      return acc;
    }, {});
  
    if (sortBy !== 'priority') {
      return groups;
    }
  
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const priorityOrder = { [t('priority.high')]: 3, [t('priority.medium')]: 2, [t('priority.low')]: 1 }
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      });
    });
  
    return groups;
  };

  const TaskList: React.FC<TaskListProps> = ({ tasks, ...props }) => {
    const [filterType, setFilterType] = useState<TaskFilter>(TaskFilter.ALL);
    const [searchQuery, setSearchQuery] = useState('');
  
    const filterTasks = (tasks: Task[]) => {
      let filteredTasks = tasks;
      
      switch (filterType) {
        case TaskFilter.ACTIVE:
          filteredTasks = tasks.filter(task => !task.isCompleted);
          break;
        case TaskFilter.COMPLETED:
          filteredTasks = tasks.filter(task => task.isCompleted);
          break;
        default:
          filteredTasks = tasks;
      }
  
      if (searchQuery.trim()) {
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
  
      return filteredTasks;
    };
  
    return (
      <div className="task-list">
        <div className="task-list-controls">
          <div className="filter-controls">
            <button 
              className={`filter-btn ${filterType === TaskFilter.ALL ? 'active' : ''}`}
              onClick={() => setFilterType(TaskFilter.ALL)}
            >
             {t('filter.all')}
            </button>
            <button 
              className={`filter-btn ${filterType === TaskFilter.ACTIVE ? 'active' : ''}`}
              onClick={() => setFilterType(TaskFilter.ACTIVE)}
            >
             {t('filter.active')}
            </button>
            <button 
              className={`filter-btn ${filterType === TaskFilter.COMPLETED ? 'active' : ''}`}
              onClick={() => setFilterType(TaskFilter.COMPLETED)}
            >
             {t('filter.completed')}
            </button>
          </div>
          
          <div className="search-control">
            <input
              type="text"
              placeholder={t('filter.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
  
        {groupTasksByDate(filterTasks(tasks)).map()}
      </div>
    );
  };

  const renderFormPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <>
            <TextInput
              ref={inputRefs.title}
              label={t('form.titleLabel')}
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
                label={t('form.categoryLabel')}
                value={category}
                onChangeText={setCategory}
                placeholder={t('form.categoryPlaceholder')}
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
                      placeholder={t('form.newCategoryPlaceholder')}
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
              label={t('form.descriptionLabel')}
              value={description}
              onChangeText={setDescription}
              placeholder={t('form.descriptionPlaceholder')}
              maxLength={500}
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
              <Text style={styles.priorityLabel}>{t('form.priorityLabel')}</Text>
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
                label={t('form.deadlineLabel')}
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
                label={t('form.executionTimeLabel')}
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
                  label={t('form.colorMarkingLabel')}
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
                  {icon ? t('form.iconSelected') : t('form.selectIcon')}
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
                          {tab === 'emoji' ? 'Emoji' : t('form.icons')}
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
                  label={t('form.reminderLabel')}
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
  onPress={() => setAlert({
    visible: true,
    title: t('alert.info'),
                message: t('alert.attachmentsUnavailable'),
    type: 'info'
  })}
  theme={styles.inputTheme}
>
{t('form.addAttachment')}
</Button>
          </>
        );
      default:
        return null;
    }
  };

const handleCompleteTask = async (task) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isCompleted: !task.isCompleted })
    });

    if (!response.ok) throw new Error('Failed to update task');

    setTasks(prev => prev.map(t => 
      t.id === task.id ? updatedTask : t
    ));
  } catch (error) {
    setAlert({
      visible: true,
      title: t('alert.error'),
        message: t('alert.taskUpdateFailed'),
      type: 'error'
    });
  }
};

const handleDeleteTask = async (task) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${task.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete task');

    setTasks(prev => prev.filter(t => t.id !== task.id));
    
    setAlert({
      visible: true,
      title: t('alert.success'),
        message: t('alert.taskDeleted'),
      type: 'success'
    });
  } catch (error) {
    setAlert({
      visible: true,
      title: t('alert.error'),
        message: t('alert.taskDeletionFailed'),
      type: 'error'
    });
  }
};

const handleEditTask = (task) => {
  // TODO: Implement edit functionality
  setAlert({
    visible: true,
    title: t('alert.info'),
      message: t('alert.editComingSoon'),
    type: 'info'
  });
};

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          {t('home.title')}
        </Text>

        {userName && (
          <Text variant="titleMedium" style={styles.welcomeText}>
            {t('home.welcome', { name: userName })}
          </Text>
        )}

        
      </View>

      <TaskFilters 
  taskFilter={taskFilter}
  setTaskFilter={setTaskFilter}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  isDarkMode={isDarkMode}
  styles={styles}
  totalTasks={tasks.length}
  activeTasks={tasks.filter(t => !t.isCompleted).length}
  completedTasks={tasks.filter(t => t.isCompleted).length}
  sortBy={sortBy}
  sortDirection={sortDirection}
  onSortPress={(event) => {
    const { nativeEvent } = event;
    setSortAnchor({ x: nativeEvent.pageX, y: nativeEvent.pageY });
    setShowSortMenu(true);
  }}
/>
    
      <SectionList
        sections={Object.entries(groupTasksByDate(tasks)).map(([title, data]) => ({
          title,
          data
        }))}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        // stickySectionHeadersEnabled={true}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <IconButton 
              icon="clipboard-text-outline" 
              size={48} 
              color={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} 
            />
            <Text style={styles.emptyText}>
  {t('home.noTasks')}
</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, {
          }]}>
            <Text style={[styles.sectionHeaderText, {
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            }]}>
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            isDarkMode={isDarkMode}
            styles={styles}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            reminderOptions={reminderOptions}
          />
        )}
      />

      <Menu
        visible={showSortMenu}
        onDismiss={() => setShowSortMenu(false)}
        anchor={sortAnchor}
      >
        <Menu.Item
          leadingIcon={sortBy === 'priority' ? 'check' : undefined}
          onPress={() => {
            setSortBy('priority');
            if (sortBy === 'priority') {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
            }
            setShowSortMenu(false);
          }}
          title={t('sort.byPriority')}
        />
        <Menu.Item
          leadingIcon={sortBy === 'date' ? 'check' : undefined}
          onPress={() => {
            setSortBy('date');
            if (sortBy === 'date') {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
            }
            setShowSortMenu(false);
          }}
          title={t('sort.byDate')}
        />
        <Menu.Item
          leadingIcon={sortBy === 'category' ? 'check' : undefined}
          onPress={() => {
            setSortBy('category');
            if (sortBy === 'category') {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
            }
            setShowSortMenu(false);
          }}
          title={t('sort.byCategory')}
        />
        {sortBy && (
          <Menu.Item
            leadingIcon="close"
            onPress={() => {
              setSortBy(null);
              setShowSortMenu(false);
            }}
            title={t('sort.reset')}
          />
        )}
      </Menu>

      <FAB
        icon="plus"
        label={t('fab.addTask')}
        onPress={() => setModalVisible(true)}
        style={[styles.fab, { backgroundColor: '#00b894' }]}
      />

      <AddTaskModal 
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        renderFormPage={renderFormPage}
        handleAddTask={handleAddTask}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        styles={styles}
        fadeAnim={fadeAnim}
        categories={categories}
        priorityOptions={priorityOptions}
        colorPalette={colorPalette}
        iconCategories={iconCategories}
        reminderOptions={reminderOptions}
        onAddCategory={(newCategory) => setCategories(prev => [...prev, newCategory])}
        formData={{
          newTask,
          category,
          description,
          priority,
          deadline,
          executionTime,
          repetition,
          colorMarking,
          icon,
          reminder,
        }}
        setFormData={{
          setNewTask,
          setCategory,
          setDescription,
          setPriority,
          setDeadline,
          setExecutionTime,
          setRepetition,
          setColorMarking,
          setIcon,
          setReminder,
        }}
      />
    
      <AlertDialog 
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onDismiss={() => setAlert(prev => ({ ...prev, visible: false }))}
        onConfirm={alert.onConfirm}
        isDarkMode={isDarkMode}
      />
    </View>
    </GestureHandlerRootView>
  );
}
