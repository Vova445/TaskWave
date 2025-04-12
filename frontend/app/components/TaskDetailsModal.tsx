import React from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton, Portal, Divider } from 'react-native-paper';
import { Task } from '../types/task';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface TaskDetailsModalProps {
  visible: boolean;
  task: Task | null;
  onDismiss: () => void;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  isDarkMode: boolean;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  task,
  onDismiss,
  onComplete,
  onDelete,
  onEdit,
  isDarkMode,
}) => {
  if (!task) return null;

  const formatDateTime = (date: string) => {
    return format(new Date(date), "d MMMM yyyy, HH:mm", { locale: uk });
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted ? '#00b894' : '#FFB344';
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Високий': return '#FF6B6B';
      case 'Середній': return '#FFD93D';
      case 'Низький': return '#00b894';
      default: return '#666';
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Surface style={[
            styles.modalContent,
            isDarkMode && styles.modalContentDark
          ]}>
            {/* Оновлений Header */}
            <View style={[styles.header, isDarkMode && styles.headerDark]}>
              <View style={styles.headerTop}>
                <View style={styles.headerActions}>
                  <View style={styles.headerIcons}>
                    {task.colorMarking && (
                      <View style={[styles.colorIndicator, { backgroundColor: task.colorMarking }]} />
                    )}
                    {task.icon && (
                      <Text style={styles.taskIcon}>{task.icon}</Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.isCompleted) }]}>
                    <Text style={styles.statusText}>
                      {task.isCompleted ? 'Завершено' : 'В процесі'}
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onDismiss}
                  iconColor={isDarkMode ? '#fff' : '#000'}
                  style={styles.closeButton}
                />
              </View>
              
              <Text style={[styles.title, isDarkMode && styles.titleDark]} numberOfLines={2}>
                {task.title}
              </Text>
            </View>

            {/* Оновлений Content */}
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Опис */}
              {task.description && (
                <View style={styles.section}>
                  <Surface style={[styles.card, isDarkMode && styles.cardDark]}>
                    <View style={styles.cardHeader}>
                      <IconButton icon="text" size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
                      <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
                        Опис завдання
                      </Text>
                    </View>
                    <Text style={[styles.description, isDarkMode && styles.textDark]}>
                      {task.description}
                    </Text>
                  </Surface>
                </View>
              )}

              {/* Основна інформація */}
              <View style={styles.section}>
                <Surface style={[styles.card, isDarkMode && styles.cardDark]}>
                  <View style={styles.cardHeader}>
                    <IconButton icon="information" size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
                    <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
                      Основна інформація
                    </Text>
                  </View>
                  <View style={styles.infoGrid}>
                    {task.category && (
                      <View style={styles.infoItem}>
                        <IconButton 
                          icon="folder-outline" 
                          size={20}
                          iconColor={isDarkMode ? '#fff' : '#666'}
                        />
                        <View style={styles.infoContent}>
                          <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                            Категорія
                          </Text>
                          <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                            {task.category}
                          </Text>
                        </View>
                      </View>
                    )}

                    {task.priority && (
                      <View style={styles.infoItem}>
                        <IconButton 
                          icon="flag" 
                          size={20}
                          iconColor={getPriorityColor(task.priority)}
                        />
                        <View style={styles.infoContent}>
                          <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>
                            Пріоритет
                          </Text>
                          <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                              {task.priority}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </Surface>
              </View>

              {/* Часові параметри */}
              {(task.deadline || task.executionTime || task.reminder) && (
                <View style={styles.section}>
                  <Surface style={[styles.card, isDarkMode && styles.cardDark]}>
                    <View style={styles.cardHeader}>
                      <IconButton icon="clock-outline" size={20} iconColor={isDarkMode ? '#fff' : '#666'} />
                      <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
                        Часові параметри
                      </Text>
                    </View>
                    <View style={styles.infoGrid}>
                      {task.deadline && (
                        <View style={styles.infoItem}>
                          <IconButton 
                            icon="clock-outline" 
                            size={20}
                            iconColor={isDarkMode ? '#fff' : '#666'}
                          />
                          <View>
                            <Text style={styles.infoLabel}>Дедлайн</Text>
                            <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                              {formatDateTime(task.deadline)}
                            </Text>
                          </View>
                        </View>
                      )}

                      {task.executionTime && (
                        <View style={styles.infoItem}>
                          <IconButton 
                            icon="timer-outline" 
                            size={20}
                            iconColor={isDarkMode ? '#fff' : '#666'}
                          />
                          <View>
                            <Text style={styles.infoLabel}>Час виконання</Text>
                            <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                              {task.executionTime}
                            </Text>
                          </View>
                        </View>
                      )}

                      {task.reminder && (
                        <View style={styles.infoItem}>
                          <IconButton 
                            icon="bell-outline" 
                            size={20}
                            iconColor={isDarkMode ? '#fff' : '#666'}
                          />
                          <View>
                            <Text style={styles.infoLabel}>Нагадування</Text>
                            <Text style={[styles.infoText, isDarkMode && styles.textDark]}>
                              {task.reminder}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </Surface>
                </View>
              )}
            </ScrollView>

            {/* Оновлені Actions */}
            <Surface style={[styles.actions, isDarkMode && styles.actionsDark]}>

              <View style={styles.actionsSeparator}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => {
                    onEdit(task);
                    onDismiss();
                  }}
                >
                  <IconButton icon="pencil" size={20} iconColor="#fff" />
                  <Text style={styles.actionButtonText}>Редагувати</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => {
                    onDelete(task);
                    onDismiss();
                  }}
                >
                  <IconButton icon="delete-outline" size={20} iconColor="#fff" />
                  <Text style={styles.actionButtonText}>Видалити</Text>
                </TouchableOpacity>
              </View>
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
    overflow: 'hidden',
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerDark: {
    backgroundColor: '#2C2C2C',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    margin: -8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
    lineHeight: 28,
  },
  titleDark: {
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#2C2C2C',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    padding: 16,
  },
  textDark: {
    color: '#fff',
  },
  infoGrid: {
    padding: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoLabelDark: {
    color: '#999',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  taskIcon: {
    fontSize: 20,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
  },
  actionsDark: {
    backgroundColor: '#2C2C2C',
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionsSeparator: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  completeButton: {
    backgroundColor: '#00b894',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default TaskDetailsModal;