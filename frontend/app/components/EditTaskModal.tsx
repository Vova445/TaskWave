import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Surface, Text, TextInput, IconButton, Portal, Button } from 'react-native-paper';
import { Task } from '../types/task';

interface EditTaskModalProps {
  visible: boolean;
  task: Task;
  onDismiss: () => void;
  onSave: (updatedTask: Task) => void;
  isDarkMode: boolean;
  field?: keyof Task; // Optional field to focus on specific field
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  task,
  onDismiss,
  onSave,
  isDarkMode,
  field
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    onSave(editedTask);
    onDismiss();
  };

  const renderField = (key: keyof Task, label: string, icon: string) => {
    if (field && field !== key) return null;

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <IconButton icon={icon} size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
          <Text style={[styles.fieldLabel, isDarkMode && styles.textDark]}>{label}</Text>
        </View>
        <TextInput
          value={editedTask[key]?.toString() || ''}
          onChangeText={(text) => setEditedTask({ ...editedTask, [key]: text })}
          mode="outlined"
          style={styles.input}
          multiline={key === 'description'}
          numberOfLines={key === 'description' ? 4 : 1}
          theme={{
            colors: {
              primary: '#00b894',
              background: isDarkMode ? '#1a1a1a' : '#ffffff',
            }
          }}
        />
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <Surface style={[
            styles.modalContent,
            isDarkMode && styles.modalContentDark
          ]}>
            <View style={[styles.header, isDarkMode && styles.headerDark]}>
              <Text style={[styles.title, isDarkMode && styles.titleDark]}>
                Редагування {field ? 'поля' : 'завдання'}
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
                iconColor={isDarkMode ? '#fff' : '#000'}
              />
            </View>

            <ScrollView style={styles.content}>
              {(!field || field === 'title') && renderField('title', 'Назва', 'format-title')}
              {(!field || field === 'description') && renderField('description', 'Опис', 'text')}
              {(!field || field === 'category') && renderField('category', 'Категорія', 'folder-outline')}
              {(!field || field === 'priority') && renderField('priority', 'Пріоритет', 'flag')}
              {(!field || field === 'deadline') && renderField('deadline', 'Дедлайн', 'clock-outline')}
              {(!field || field === 'executionTime') && renderField('executionTime', 'Час виконання', 'timer-outline')}
              {(!field || field === 'reminder') && renderField('reminder', 'Нагадування', 'bell-outline')}
            </ScrollView>

            <Surface style={[styles.actions, isDarkMode && styles.actionsDark]}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.button}
                textColor={isDarkMode ? '#fff' : '#000'}
              >
                Скасувати
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={[styles.button, styles.saveButton]}
              >
                Зберегти
              </Button>
            </Surface>
          </Surface>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '85%',
    elevation: 8,
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
  },
  headerDark: {
    backgroundColor: '#2C2C2C',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  titleDark: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  textDark: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    gap: 8,
  },
  actionsDark: {
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: '#00b894',
  },
});

export default EditTaskModal;