import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { Task, TaskItemProps } from '../types/task';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import TaskDetailsModal from './TaskDetailsModal';
import { useTranslation } from 'react-i18next';

const TaskItem: React.FC<TaskItemProps> = ({ 
  item, 
  isDarkMode, 
  onComplete, 
  onDelete, 
  onEdit 
}) => {
  const { t } = useTranslation();

  const swipeableRef = useRef<Swipeable>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isActionVisible, setIsActionVisible] = useState(false);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, -10, 0],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.actionContainer,
          { transform: [{ scale }], opacity: scale }
        ]}
      >
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
          onPress={() => {
            if (isActionVisible) {
              swipeableRef.current?.close();
              onDelete(item);
            }
          }}
        >
          <IconButton icon="delete-outline" size={22} iconColor="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => {
            if (isActionVisible) {
              swipeableRef.current?.close();
              onEdit(item);
            }
          }}
        >
          <IconButton icon="pencil" size={22} iconColor="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getPriorityData = (priority?: string) => {
    switch (priority) {
        case 'Високий': return { color: '#FF6B6B', icon: 'flag', label: t('priority.high') };
        case 'Середній': return { color: '#FFD93D', icon: 'flag-variant', label: t('priority.medium') };
        case 'Низький': return { color: '#00b894', icon: 'flag-outline', label: t('priority.low') };
        default: return { color: '#00b894', icon: 'flag-outline', label: '' };
    }
};

  const formatDateTime = (date: string) => {
    const deadlineDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const timeStr = format(deadlineDate, 'HH:mm');
  
    if (deadlineDate.toDateString() === today.toDateString()) {
      return `${t('dates.today')}, ${timeStr}`;
    } else if (deadlineDate.toDateString() === tomorrow.toDateString()) {
      return `${t('dates.tomorrow')}, ${timeStr}`;
    }
  
    return format(deadlineDate, "d MMM, HH:mm", { locale: uk });
  };
  
  const translateCategory = (category?: string) => {
    switch (category) {
        case 'Робота': return t('categories.work');
        case 'Навчання': return t('categories.study');
        case 'Особисте': return t('categories.personal');
        case 'Покупки': return t('categories.shopping');
        case 'Здоров\'я': return t('categories.health');
        default: return category;
    }
};

  const priorityData = getPriorityData(item.priority);

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        onSwipeableWillOpen={() => setIsActionVisible(true)}
        onSwipeableWillClose={() => setIsActionVisible(false)}
      >
        <TouchableOpacity
          onLongPress={() => setShowDetails(true)}
          delayLongPress={500}
        >
          <Surface style={[
            styles.container,
            isDarkMode && styles.containerDark,
            item.isCompleted && styles.completedContainer
          ]}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => onComplete(item)}
            >
              <View style={[
                styles.checkboxInner,
                item.isCompleted && styles.checkboxCompleted
              ]}>
                {item.isCompleted && (
                  <IconButton 
                    icon="check" 
                    size={14}
                    iconColor="#fff"
                  />
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.mainContent}>
                <Text style={[
                  styles.title,
                  isDarkMode && styles.titleDark,
                  item.isCompleted && styles.completedText
                ]} numberOfLines={1}>
                  {item.title}
                </Text>

                <View style={styles.metaInfo}>
                  {item.priority && (
                    <View style={styles.priorityBadge}>
                    <IconButton 
                      icon={priorityData.icon}
                      iconColor={priorityData.color}
                      size={14}
                      style={styles.metaIcon}
                    />
                    <Text style={[styles.priorityText, { color: priorityData.color }]}>
                      {priorityData.label}
                    </Text>
                  </View>
                  )}
                  
                  {item.colorMarking && (
                    <View 
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: item.colorMarking }
                      ]} 
                    />
                  )}
                  {item.reminder && (
                    <IconButton 
                      icon="bell-outline"
                      size={14}
                      iconColor={isDarkMode ? '#FFD93D' : '#FFB344'}
                      style={styles.metaIcon}
                    />
                  )}
                </View>
              </View>

              {item.description && (
                <Text 
                  style={[
                    styles.description,
                    isDarkMode && styles.descriptionDark,
                    item.isCompleted && styles.completedText
                  ]} 
                  numberOfLines={2}
                >
                  {item.description.slice(0,25)}
                </Text>
              )}

              <View style={styles.bottomRow}>
                {item.category && (
                  <View style={styles.categoryContainer}>
                    <IconButton 
                      icon="folder-outline" 
                      size={12}
                      iconColor={isDarkMode ? '#fff' : '#666'}
                      style={styles.categoryIcon}
                    />
                    <Text style={[
                      styles.categoryText,
                      isDarkMode && styles.categoryTextDark
                    ]}>
                      {translateCategory(item.category)}
                    </Text>
                  </View>
                )}

                {item.deadline && (
                  <View style={styles.deadlineContainer}>
                    <IconButton 
                      icon="clock-outline" 
                      size={12}
                      iconColor={isDarkMode ? '#fff' : '#666'}
                      style={styles.metaIcon}
                    />
                    <Text style={[
                      styles.deadlineText,
                      isDarkMode && styles.deadlineTextDark
                    ]}>
                      {formatDateTime(item.deadline)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Surface>
        </TouchableOpacity>
      </Swipeable>

      <TaskDetailsModal
        visible={showDetails}
        task={item}
        onDismiss={() => setShowDetails(false)}
        onComplete={onComplete}
        onDelete={onDelete}
        onEdit={onEdit}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  checkbox: {
    padding: 14,
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00b894',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#00b894',
  },
  content: {
    flex: 1,
    padding: 14,
    paddingLeft: 0,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  titleDark: {
    color: '#fff',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  descriptionDark: {
    color: '#999',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    margin: 0,
    padding: 0,
    width: 18,
    height: 18,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  categoryTextDark: {
    color: '#999',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  deadlineTextDark: {
    color: '#999',
  },
  actionContainer: {
    width: 100,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TaskItem;