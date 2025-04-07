import React, { useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    key: 'one',
    title: 'Ласкаво просимо в TaskWave',
    text: 'Керуйте особистими та професійними завданнями зручно',
    image: require('../assets/onboarding1.png'),
  },
  {
    key: 'two',
    title: 'Календар + Список',
    text: 'Переглядайте задачі у вигляді часової сітки або списку',
    image: require('../assets/onboarding2.png'),
  },
  {
    key: 'three',
    title: 'Офлайн + Синхронізація',
    text: 'Працюйте навіть без інтернету — все синхронізується пізніше',
    image: require('../assets/onboarding3.png'),
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const sliderRef = useRef<AppIntroSlider>(null);

  const renderItem = ({ item, index }: any) => (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={[styles.slide, { backgroundColor: colors.background }]}
    >
      <Image source={item.image} style={styles.image} />
      <Text variant="titleLarge" style={[styles.title, { color: '#00b894' }]}>
        {item.title}
      </Text>
      <Text style={[styles.text, { color: colors.onBackground }]}>{item.text}</Text>
    </Animated.View>
  );

  const onDone = () => navigation.replace('Register');

  const renderNextButton = () => (
    <Button mode="contained-tonal" style={styles.button}>
      Далі
    </Button>
  );

  const renderSkipButton = () => (
    <Button mode="text" style={styles.button}>
      Пропустити
    </Button>
  );

  const renderDoneButton = () => (
    <Button mode="contained" style={[styles.button, { backgroundColor: '#00b894' }]}>
      Почати
    </Button>
  );

  const renderPrevButton = () => (
    <Button mode="outlined" style={styles.button}>
      Назад
    </Button>
  );

  return (
    <AppIntroSlider
      ref={sliderRef}
      data={slides}
      renderItem={renderItem}
      onDone={onDone}
      onSkip={onDone}
      showSkipButton
      showPrevButton
      renderNextButton={renderNextButton}
      renderSkipButton={renderSkipButton}
      renderDoneButton={renderDoneButton}
      renderPrevButton={renderPrevButton}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  button: {
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 12,
  },
});
