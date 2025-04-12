import React, { useState } from 'react';
import { View, Animated, Platform } from 'react-native';
import { Modal, IconButton, Text, ProgressBar, Button } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import ModalNavigation from './ModalNavigation';
import { useTranslation } from 'react-i18next';

interface AddTaskModalProps {
  visible: boolean;
  onDismiss: () => void;
  currentPage: number;
  handlePageChange: (page: number) => void;
  renderFormPage: () => React.ReactNode;
  handleAddTask: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  styles: any;
  fadeAnim: Animated.Value;
  categories: string[];
  priorityOptions: string[];
  colorPalette: Array<{ color: string; label: string }>;
  iconCategories: {
    emoji: Array<{ icon: string; label: string }>;
    material: Array<{ icon: string; label: string }>;
  };
  reminderOptions: Array<{ value: string; label: string }>;
  onAddCategory: (newCategory: string) => void;
  formData: {
    newTask: string;
    category: string;
    description: string;
    priority: string;
    deadline: string;
    executionTime: string;
    repetition: string;
    colorMarking: string;
    icon: string;
    reminder: string;
  };
  setFormData: {
    setNewTask: (value: string) => void;
    setCategory: (value: string) => void;
    setDescription: (value: string) => void;
    setPriority: (value: string) => void;
    setDeadline: (value: string) => void;
    setExecutionTime: (value: string) => void;
    setRepetition: (value: string) => void;
    setColorMarking: (value: string) => void;
    setIcon: (value: string) => void;
    setReminder: (value: string) => void;
  };
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onDismiss,
  currentPage,
  handlePageChange,
  renderFormPage,
  handleAddTask,
  isLoading,
  isDarkMode,
  styles,
  fadeAnim,
  categories,
  priorityOptions,
  colorPalette,
  iconCategories,
  reminderOptions,
  onAddCategory,
  formData,
  setFormData,
}) => {
  const { t } = useTranslation();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [androidPickerShow, setAndroidPickerShow] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIconTab, setSelectedIconTab] = useState('emoji');
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [inputRefs] = useState({
    title: React.createRef<any>(),
    category: React.createRef<any>(),
    description: React.createRef<any>(),
    priority: React.createRef<any>(),
    deadline: React.createRef<any>(),
    executionTime: React.createRef<any>(),
    colorMarking: React.createRef<any>(),
    icon: React.createRef<any>(),
    reminder: React.createRef<any>(),
  });

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setShowCategoryDropdown(dropdownName === 'category');
    setShowDatePicker(dropdownName === 'date');
    setShowTimePicker(dropdownName === 'time');
    setShowColorPicker(dropdownName === 'color');
    setShowIconPicker(dropdownName === 'icon');
    setShowReminderDropdown(dropdownName === 'reminder');
    setAndroidPickerShow(dropdownName === 'date' && Platform.OS === 'android');
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setFormData.setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  const handleAddNewCategory = () => {
    if (newCategoryInput.trim()) {
      onAddCategory(newCategoryInput.trim());
      setFormData.setCategory(newCategoryInput.trim());
      setNewCategoryInput('');
      setShowCategoryDropdown(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
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
          <View style={styles.modalHeader}>
          <Text variant="titleLarge">{t('taskModal.newTask')}</Text>
            <IconButton icon="close" size={24} onPress={onDismiss} />
          </View>

          <ProgressBar
            progress={(currentPage + 1) / 3}
            color="#00b894"
            style={styles.stepProgress}
          />

          <View style={styles.modalBody}>
            {renderFormPage()}

            <ModalNavigation 
              currentPage={currentPage}
              onBack={() => {
                if (currentPage === 0) {
                  onDismiss();
                } else {
                  handlePageChange(currentPage - 1);
                }
              }}
              onNext={() => {
                if (currentPage < 2) {
                  handlePageChange(currentPage + 1);
                } else {
                  handleAddTask();
                }
              }}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              styles={styles}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddTaskModal;