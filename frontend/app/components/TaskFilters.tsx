import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { useHomeStyles } from '../styles/homeStyles';
import { useTranslation } from 'react-i18next';

export enum TaskFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

interface TaskFiltersProps {
  taskFilter: TaskFilter;
  setTaskFilter: (filter: TaskFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  styles: any;
  totalTasks?: number;
  activeTasks?: number;
  completedTasks?: number;
  sortBy: 'priority' | 'date' | 'category' | null;
  sortDirection: 'asc' | 'desc';
  onSortPress: (event: any) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  taskFilter,
  setTaskFilter,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  styles,
  totalTasks = 0,
  activeTasks = 0,
  completedTasks = 0,
  sortBy,
  sortDirection,
  onSortPress
}) => {
  const homeStyles = useHomeStyles(isDarkMode);
  const { t } = useTranslation();

  const filterOptions = [
    { value: TaskFilter.ALL, label: t('filters.all'), count: totalTasks },
    { value: TaskFilter.ACTIVE, label: t('filters.active'), count: activeTasks },
    { value: TaskFilter.COMPLETED, label: t('filters.completed'), count: completedTasks }
  ];

  return (
    <>
      <View style={styles.filterContainer}>
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={[
              homeStyles.sortButton,
              sortBy && homeStyles.sortButtonActive
            ]}
            onPress={onSortPress}
          >
            <IconButton
              icon={sortDirection === 'asc' ? 'sort-ascending' : 'sort-descending'}
              size={18}
              iconColor={sortBy ? '#00b894' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'}
              style={{ margin: 0, padding: 0 }}
            />
          </TouchableOpacity>

          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                taskFilter === option.value && styles.filterButtonActive
              ]}
              onPress={() => setTaskFilter(option.value)}
            >
              <Text style={[
                styles.filterButtonText,
                taskFilter === option.value && styles.filterButtonTextActive
              ]}>
                {option.label}
                {option.count > 0 && ` (${option.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder={t('filters.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={[
            styles.searchInput,
            Platform.select({
              ios: { height: 40 },
              android: { height: 44 }
            })
          ]}
          theme={{
            colors: {
              primary: '#00b894',
              background: isDarkMode ? '#1a1a1a' : '#ffffff',
              placeholder: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              text: isDarkMode ? '#ffffff' : '#000000'
            }
          }}
          left={<TextInput.Icon 
            icon="magnify" 
            color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
          />}
          right={searchQuery ? 
            <TextInput.Icon 
              icon="close" 
              onPress={() => setSearchQuery('')}
              color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
            /> : null
          }
        />
      </View>
    </>
  );
};

export default TaskFilters;
