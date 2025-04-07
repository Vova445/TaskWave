import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TextInput, Button, Text, useTheme, Surface } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Невірний email' }),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((res) => setTimeout(res, 1000));
    setSent(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        <Text variant="displayMedium" style={[styles.title, { color: '#00b894' }]}>
          TaskWave
        </Text>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Скидання паролю
        </Text>
      </Animated.View>

      <Animated.View
        style={[styles.surface, { backgroundColor: colors.elevation.level2 }]}
        entering={FadeInDown.delay(200).duration(600).springify()}
      >
        {!sent ? (
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                  style={styles.input}
                />
              )}
            />
            {errors.email && (
              <Text style={[styles.error, { color: colors.error }]}>{errors.email.message}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              style={[styles.button, { backgroundColor: '#00b894' }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Скинути пароль
            </Button>
          </View>
        ) : (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 8, color: colors.primary }}>
              Лист надіслано!
            </Text>
            <Text style={{ textAlign: 'center', color: colors.onBackground }}>
              Якщо email існує, ми надішлемо посилання для скидання паролю.
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  surface: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },
  form: {
    gap: 10,
  },
  input: {
    borderRadius: 12,
  },
  error: {
    fontSize: 12,
    marginLeft: 4,
    marginTop: -4,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
