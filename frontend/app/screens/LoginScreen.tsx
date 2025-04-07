import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TextInput, Button, Text, useTheme, Switch } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed');

      await AsyncStorage.setItem('token', result.token);
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        <Text variant="displayMedium" style={[styles.title, { color: '#00b894' }]}>
          TaskWave
        </Text>
        <Text variant="titleMedium" style={[styles.subtitle, { color: colors.onBackground }]}>
          Log in to your account
        </Text>
      </Animated.View>

      <Animated.View
        style={[styles.surface, { backgroundColor: colors.elevation.level2 }]}
        entering={FadeInDown.delay(200).duration(600).springify()}
      >
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                error={!!errors.password}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          {errors.password && (
            <Text style={[styles.error, { color: colors.error }]}>{errors.password.message}</Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              thumbColor={rememberMe ? '#00b894' : '#f4f3f4'}
              trackColor={{ false: '#ccc', true: '#00b894' }}
            />
            <Text style={{ marginLeft: 8, fontWeight: '600' }}>Remember me</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            style={[styles.button, { backgroundColor: '#00b894' }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Log In
          </Button>

          <Text
            style={[styles.loginText, { color: colors.outline }]}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            Forgot your password? <Text style={{ color: '#00b894' }}>Reset</Text>
          </Text>

          <Text
            style={[styles.loginText, { color: colors.outline }]}
            onPress={() => navigation.navigate('Register')}
          >
            Don't have an account?{' '}
            <Text style={[styles.loginLink, { color: '#00b894' }]}>Sign Up</Text>
          </Text>
        </View>
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
  loginText: {
    marginTop: 20,
    textAlign: 'center',
  },
  loginLink: {
    fontWeight: '600',
  },
});
