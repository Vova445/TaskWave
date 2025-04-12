import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useHomeStyles = (isDarkMode: boolean) => {
  const { colors } = useTheme();
  
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: colors.background,
    },
    headerContainer: {
      paddingTop: 40,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#1f1f1f' : '#00b894',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color:'#ffffff',
      marginBottom: 8,
    },
    welcomeText: {
      fontSize: 16,
      color:'#ffffff',
    },
    taskText: {
      marginVertical: 8,
      color: isDarkMode ? '#fff' : '#2d3436',
    },
    modalBackdrop: {
      flex: 1,
      width: '100%',
      height: '100%',
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
      color: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    taskItem: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1.5,
      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    taskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    taskIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    taskTitleContainer: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 17,
      fontWeight: '600',
      marginBottom: 4,
      color: isDarkMode ? '#ffffff' : '#2d3436',
    },
    taskCategory: {
      fontSize: 14,
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    },
    taskDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      marginBottom: 12,
    },
    taskMetaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    taskMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    taskMetaText: {
      fontSize: 13,
      color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    },
    priorityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      marginLeft: 8,
    },
    priorityText: {
      fontWeight: '600',
      fontSize: 14,
      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 32,
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      marginTop: 8,
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
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    sectionHeaderText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
    },
    sortButton: {
      position: 'absolute',
      right: 20,
      bottom: 150,
      borderRadius: 16,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    filterContainer: {
      marginHorizontal: 6,
      marginBottom: 8,
      borderRadius: 16,
      padding: 4,
      
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    },
    filterButtonsContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    },
    filterButtonActive: {
      backgroundColor: '#00b894',
      borderColor: '#00b894',
    },
    filterButtonText: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
    },
    filterButtonTextActive: {
      color: '#ffffff',
    },
    searchContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    searchInput: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
      
    },
    filterBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: '#00b894',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterBadgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 32,
    },
    noResultsText: {
      fontSize: 16,
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      marginTop: 8,
    },
    filterIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      borderRadius: 16,
      marginRight: 8,
    },
    filterIndicatorText: {
      fontSize: 12,
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      marginRight: 4,
    },
    activeFiltersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    clearFiltersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    clearFiltersText: {
      fontSize: 12,
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      marginLeft: 4,
    },
    searchIconContainer: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    searchIcon: {
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingHorizontal: 4,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    },
    sortButtonActive: {
      borderColor: '#00b894',
      backgroundColor: 'rgba(0,184,148,0.1)',
    },
    sortButtonText: {
      fontSize: 13,
      marginLeft: 6,
      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    },
    sortButtonTextActive: {
      color: '#00b894',
    },
  });
};