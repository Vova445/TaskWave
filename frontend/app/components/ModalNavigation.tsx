import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import StepIndicator from './StepIndicator';

interface ModalNavigationProps {
  currentPage: number;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  styles: any;
}

const ModalNavigation: React.FC<ModalNavigationProps> = ({
  currentPage,
  onBack,
  onNext,
  isLoading,
  isDarkMode,
  styles,
}) => {
  return (
    <View style={styles.modalButtons}>
      <Button
        mode="outlined"
        onPress={onBack}
        style={[styles.navigationButton, styles.cancelButton]}
        labelStyle={{ 
          fontSize: 12,
          fontWeight: '600',
          color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
        }}
      >
        {currentPage === 0 ? 'Скасувати' : 'Назад'}
      </Button>

      <StepIndicator 
        currentPage={currentPage}
        totalSteps={3}
        styles={styles}
      />

      <Button
        mode="contained"
        buttonColor="#00b894"
        loading={isLoading}
        disabled={isLoading}
        onPress={onNext}
        style={[styles.navigationButton, styles.nextButton]}
        labelStyle={{ fontSize: 12, fontWeight: '600' }}
        contentStyle={{ height: 40 }}
      >
        {currentPage < 2 ? 'Далі' : 'Створити'}
      </Button>
    </View>
  );
};

export default ModalNavigation;