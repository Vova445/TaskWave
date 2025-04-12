import React from 'react';
import { View } from 'react-native';

interface StepIndicatorProps {
  currentPage: number;
  totalSteps: number;
  styles: any;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentPage,
  totalSteps,
  styles
}) => {
  return (
    <View style={[styles.stepIndicator, { marginBottom: 0 }]}>
      {Array.from({ length: totalSteps }).map((_, step) => (
        <View
          key={step}
          style={[
            styles.stepDot,
            currentPage === step && styles.activeStepDot,
          ]}
        />
      ))}
    </View>
  );
};

export default StepIndicator;