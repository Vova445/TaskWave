import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
  Switch,
} from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import '../locales/i18n';
import { useTranslation } from 'react-i18next';
import CountryFlag from "react-native-country-flag";



const defaultAvatar = 'https://www.gravatar.com/avatar?d=mp';
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showPasswordSuccessDialog, setShowPasswordSuccessDialog] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showAvatarSuccessDialog, setShowAvatarSuccessDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showImageSizeError, setShowImageSizeError] = useState(false);
  const [showGenericErrorDialog, setShowGenericErrorDialog] = useState(false);
  const [showDeleteAvatarDialog, setShowDeleteAvatarDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);


  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const toggleOldPasswordVisibility = () => setShowOldPassword(prev => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev);
  const { t, i18n } = useTranslation();

  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Не вдалося отримати профіль');

        setFullName(data.name);
        setEmail(data.email);
        setPhoneNumber(data.phone);
        setAvatarUrl(data.avatar ?? null);

        if (data.language) {
          setLanguage(data.language.toUpperCase());
          i18n.changeLanguage(data.language.toLowerCase());
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [refresh]);

  const handleAvatarPress = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Доступ відхилено', 'Потрібен дозвіл на доступ до галереї');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          quality: 1,
        });

        if (result.canceled || result.assets.length === 0) return;

        const image = result.assets[0];

        const imageInfo = await FileSystem.getInfoAsync(image.uri);

        if (!imageInfo.exists || !imageInfo.size || imageInfo.size > 2 * 1024 * 1024) {
          setShowImageSizeError(true);
          return;
        }


        const formData = new FormData();
        formData.append('avatar', {
          uri: image.uri,
          name: `avatar.${image.uri.split('.').pop()}`,
          type: `image/${image.uri.split('.').pop()}`,
        } as any);


        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/avatar`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Помилка оновлення аватару');
        if (data.avatar) {
          setAvatarUrl(data.avatar);
          setShowAvatarSuccessDialog(true);

        }

        setShowAvatarSuccessDialog(true);

      } catch (err) {
        setShowGenericErrorDialog(true);
      }

    });
  };



  const handleDeleteAvatar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/avatar`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Не вдалося видалити аватар');

      setAvatarUrl(null);
      setShowDeleteAvatarDialog(false);
    } catch (err) {
      setShowGenericErrorDialog(true);
    }
  };



  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Implement password change functionality.');
  };

  const handleLanguageChange = () => {
    setShowLanguageDialog(true);
  };


  const handleSetLanguage = async (code: string) => {
    try {
      setLanguage(code.toUpperCase());
      i18n.changeLanguage(code.toLowerCase());
      setShowLanguageDialog(false);

      const token = await AsyncStorage.getItem('token');
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/language`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: code.toLowerCase() }),
      });
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  };


  const handleSync = () => {
    Alert.alert('Sync', 'Synchronizing with server...', [{ text: 'OK' }]);
  };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert('Logout', 'Ви вийшли з акаунта');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      Alert.alert('Помилка', 'Не вдалося вийти');
    }
  };

  const handleUpdateProfile = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
  };

  const handleNameSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Помилка', "Ім'я не може бути порожнім");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: fullName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setFullName(data.name);
      setIsEditingName(false);
    } catch (err) {

    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
        <TouchableOpacity onPress={() => setShowLogoutDialog(true)}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.avatarSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: avatarUrl || defaultAvatar }} style={styles.avatar} />
                <View style={styles.avatarOverlay}>
                </View>
              </View>
              {avatarUrl && (
                <TouchableOpacity onPress={() => setShowDeleteAvatarDialog(true)}
                  style={styles.deleteAvatarButton}>
                  <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.nameRow}>
            {isEditingName ? (
              <TextInput
                mode="flat"
                value={fullName}
                onChangeText={setFullName}
                style={styles.nameInput}
                underlineColor="#00b894"
                activeUnderlineColor="#00b894"
              />
            ) : (
              <Text style={styles.profileName}>{fullName}</Text>
            )}
            <TouchableOpacity
              style={styles.editNameButton}
              onPress={() => {
                isEditingName ? handleNameSave() : setIsEditingName(true);
              }}
            >
              <MaterialCommunityIcons name={isEditingName ? "check" : "pencil"} size={18} color="#00b894" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.changePasswordButton} onPress={() => setShowChangePasswordDialog(true)}>
            <MaterialCommunityIcons name="lock-reset" size={16} color="#00b894" />
            <Text style={styles.changePasswordText}> {t('change_password')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#00b894" style={styles.fieldIcon} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t('phone_number')}</Text>
              <Text style={styles.fieldValue}>{phoneNumber}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.fieldRow}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#00b894" style={styles.fieldIcon} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t('email')}</Text>
              <Text style={styles.fieldValue}>{email}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.fieldRow} onPress={handleLanguageChange}>
            <MaterialCommunityIcons name="translate" size={20} color="#00b894" style={styles.fieldIcon} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t('language')}</Text>
              <Text style={styles.fieldValue}>{language}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#00b894" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.fieldRow} onPress={handleSync}>
            <MaterialCommunityIcons name="sync" size={20} color="#00b894" style={styles.fieldIcon} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>{t('sync')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#00b894" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchIconContainer}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#00b894" />
            </View>
            <Text style={styles.switchLabel}>{t('notifications')}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: '#00b894' }}
              thumbColor={notificationsEnabled ? '#00b894' : '#fff'}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchIconContainer}>
              <MaterialCommunityIcons name="weather-night" size={20} color="#00b894" />
            </View>
            <Text style={styles.switchLabel}>{t('dark_mode')}</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ccc', true: '#00b894' }}
              thumbColor={darkMode ? '#00b894' : '#fff'}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Update Profile Button */}
      {/* <View style={styles.fixedButtonContainer}>
        <Button
          mode="contained"
          style={styles.updateButton}
          labelStyle={styles.updateButtonLabel}
          onPress={handleUpdateProfile}
        >
          Update Profile
        </Button>
      </View> */}
      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 8,
            elevation: 8,
          }}
        >
          <Dialog.Icon icon="logout-variant" size={44} color="#00b894" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 10,
            }}
          >
            {t('logout.title')}
          </Dialog.Title>

          <Dialog.Content style={{ alignItems: 'center', marginTop: -8, marginBottom: 0 }}>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#636e72',
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 0,
              }}
            >
              {t('logout.description')}
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'space-evenly', paddingBottom: 12 }}>
            <Button
              mode="outlined"
              onPress={() => setShowLogoutDialog(false)}
              textColor="#00b894"
              style={{
                borderColor: '#00b894',
                borderRadius: 10,
                paddingHorizontal: 24,
              }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('buttons.cancel')}
            </Button>

            <Button
              mode="contained"
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem('token');
                  setShowLogoutDialog(false);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                } catch (err) {
                  Alert.alert(t('errors.logoutTitle'), t('errors.logoutFail'));
                }
              }}
              buttonColor="#00b894"
              textColor="#fff"
              style={{
                borderRadius: 10,
                paddingHorizontal: 28,
                elevation: 2,
              }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('buttons.logout')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>


      <Portal>
        <Dialog
          visible={showChangePasswordDialog}
          onDismiss={() => setShowChangePasswordDialog(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            elevation: 8,
          }}
        >
          <Dialog.Icon icon="lock-reset" size={44} color="#00b894" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 8,
            }}
          >
            {t('changePassword.title')}
          </Dialog.Title>

          <Dialog.Content style={{ paddingBottom: 4 }}>
            <TextInput
              label={t('changePassword.oldPassword')}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
              style={{ marginBottom: 14, backgroundColor: 'transparent' }}
              underlineColor="#00b894"
              activeUnderlineColor="#00b894"
              right={
                <TextInput.Icon
                  icon={showOldPassword ? 'eye-off' : 'eye'}
                  onPress={toggleOldPasswordVisibility}
                  forceTextInputFocus={false}
                />
              }
            />

            <TextInput
              label={t('changePassword.newPassword')}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              style={{ backgroundColor: 'transparent' }}
              underlineColor="#00b894"
              activeUnderlineColor="#00b894"
              right={
                <TextInput.Icon
                  icon={showNewPassword ? 'eye-off' : 'eye'}
                  onPress={toggleNewPasswordVisibility}
                  forceTextInputFocus={false}
                />
              }
            />
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'space-evenly', paddingBottom: 12, paddingTop: 24 }}>
            <Button
              mode="outlined"
              onPress={() => setShowChangePasswordDialog(false)}
              textColor="#00b894"
              style={{
                borderColor: '#00b894',
                borderRadius: 10,
                paddingHorizontal: 24,
              }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('changePassword.cancel')}
            </Button>

            <Button
              mode="contained"
              onPress={async () => {
                try {
                  const token = await AsyncStorage.getItem('token');
                  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/change-password`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ oldPassword, newPassword }),
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message);

                  setShowChangePasswordDialog(false);
                  setOldPassword('');
                  setNewPassword('');
                  setShowPasswordSuccessDialog(true);
                } catch (err) {
                  console.error(err);
                }
              }}
              textColor="#fff"
              buttonColor="#00b894"
              style={{ borderRadius: 10, paddingHorizontal: 28 }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('changePassword.change')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>




      <Portal>
        <Dialog
          visible={showPasswordSuccessDialog}
          onDismiss={() => setShowPasswordSuccessDialog(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 12,
            elevation: 6,
          }}
        >
          <Dialog.Icon icon="check-circle" size={44} color="#00b894" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 10,
            }}
          >
            {t('passwordSuccess.title')}
          </Dialog.Title>

          <Dialog.Content style={{ alignItems: 'center', marginTop: -8 }}>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#636e72',
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('passwordSuccess.message')}
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 12 }}>
            <Button
              mode="contained"
              onPress={() => setShowPasswordSuccessDialog(false)}
              buttonColor="#00b894"
              textColor="#fff"
              style={{ borderRadius: 10, paddingHorizontal: 28 }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('passwordSuccess.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>


      <Portal>
        <Dialog
          visible={showAvatarSuccessDialog}
          onDismiss={() => setShowAvatarSuccessDialog(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 12,
            elevation: 6,
          }}
        >
          <Dialog.Icon icon="check-circle" size={44} color="#00b894" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 10,
            }}
          >
            {t('avatarSuccess.title')}
          </Dialog.Title>

          <Dialog.Content style={{ alignItems: 'center' }}>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#636e72',
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('avatarSuccess.message')}
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 12 }}>
            <Button
              onPress={() => {
                setShowAvatarSuccessDialog(false);
                setRefresh(prev => !prev);
              }}
              buttonColor="#00b894"
              textColor="#fff"
              style={{ borderRadius: 10, paddingHorizontal: 28 }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('avatarSuccess.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>




      <Portal>
        <Dialog
          visible={showImageSizeError}
          onDismiss={() => setShowImageSizeError(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 12,
            elevation: 6,
          }}
        >
          <Dialog.Icon icon="alert-circle" size={44} color="#d63031" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 10,
            }}
          >
            {t('imageSizeError.title')}
          </Dialog.Title>

          <Dialog.Content style={{ alignItems: 'center' }}>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#636e72',
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('imageSizeError.message')}
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 12 }}>
            <Button
              onPress={() => setShowImageSizeError(false)}
              buttonColor="#00b894"
              textColor="#fff"
              style={{ borderRadius: 10, paddingHorizontal: 28 }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('imageSizeError.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={showGenericErrorDialog}
          onDismiss={() => setShowGenericErrorDialog(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 12,
            elevation: 6,
          }}
        >
          <Dialog.Icon icon="alert-circle-outline" size={44} color="#d63031" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 10,
            }}
          >
            {t('genericError.title')}
          </Dialog.Title>

          <Dialog.Content style={{ alignItems: 'center' }}>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#636e72',
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('genericError.message')}
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 12 }}>
            <Button
              onPress={() => setShowGenericErrorDialog(false)}
              buttonColor="#00b894"
              textColor="#fff"
              style={{ borderRadius: 10, paddingHorizontal: 28 }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('genericError.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={showDeleteAvatarDialog}
          onDismiss={() => setShowDeleteAvatarDialog(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            marginHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 12,
            elevation: 6,
          }}
        >
          <Dialog.Icon icon="alert-circle-outline" size={44} color="#d63031" />

          <Dialog.Title
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 22,
              color: '#2d3436',
              marginBottom: 10,
            }}
          >
            {t('deleteAvatar.title')}
          </Dialog.Title>

          <Dialog.Content style={{ alignItems: 'center' }}>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#636e72',
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('deleteAvatar.message')}
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'space-evenly', paddingBottom: 12 }}>
            <Button
              mode="outlined"
              onPress={() => setShowDeleteAvatarDialog(false)}
              textColor="#00b894"
              style={{
                borderColor: '#00b894',
                borderRadius: 10,
                paddingHorizontal: 24,
              }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('deleteAvatar.cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleDeleteAvatar}
              buttonColor="#d63031"
              textColor="#fff"
              style={{
                borderRadius: 10,
                paddingHorizontal: 28,
              }}
              labelStyle={{ fontWeight: '600' }}
            >
              {t('deleteAvatar.delete')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>


      <Portal>
  <Dialog
    visible={showLanguageDialog}
    onDismiss={() => setShowLanguageDialog(false)}
    style={{
      backgroundColor: '#ffffff',
      borderRadius: 20,
      marginHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 12,
      elevation: 6,
    }}
  >
    <Dialog.Icon icon="translate" size={44} color="#00b894" />
    <Dialog.Title
      style={{
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 22,
        color: '#2d3436',
        marginBottom: 10,
      }}
    >
      {t('languageDialog.title')}
    </Dialog.Title>

    <Dialog.Content style={{ maxHeight: 300, paddingBottom: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {[
          { code: 'en', label: 'English', iso: 'GB' },
          { code: 'ua', label: 'Українська', iso: 'UA' },
          { code: 'pl', label: 'Polski', iso: 'PL' },
          { code: 'de', label: 'Deutsch', iso: 'DE' },
          { code: 'es', label: 'Español', iso: 'ES' },
          { code: 'fr', label: 'Français', iso: 'FR' },
          { code: 'it', label: 'Italiano', iso: 'IT' },
          { code: 'pt', label: 'Português', iso: 'PT' },
          { code: 'tr', label: 'Türkçe', iso: 'TR' },
          { code: 'zh', label: '中文', iso: 'CN' },
          { code: 'ja', label: '日本語', iso: 'JP' },
          { code: 'ko', label: '한국어', iso: 'KR' },
          { code: 'sv', label: 'Svenska', iso: 'SE' },
          { code: 'ar', label: 'العربية', iso: 'SA' },
        ].map(({ code, label, iso }) => (
          <TouchableOpacity
            key={code}
            onPress={() => {
              i18n.changeLanguage(code);
              setLanguage(code.toUpperCase());
              setShowLanguageDialog(false);
              handleSetLanguage(code);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              width: '100%',
              padding: 8,
              borderRadius: 10,
              backgroundColor: language === code.toUpperCase() ? '#dff9fb' : 'transparent',
            }}
          >
            <CountryFlag isoCode={iso} size={20} style={{ marginRight: 12, borderRadius: 3 }} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2d3436' }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Dialog.Content>

    <Dialog.Actions style={{ justifyContent: 'center', paddingTop: 4 }}>
      <Button
        onPress={() => setShowLanguageDialog(false)}
        buttonColor="#00b894"
        textColor="#fff"
        style={{ borderRadius: 10, paddingHorizontal: 28 }}
        labelStyle={{ fontWeight: '600' }}
      >
        {t('languageDialog.close')}
      </Button>
    </Dialog.Actions>
  </Dialog>
</Portal>


    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    backgroundColor: '#00b894',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    // paddingBottom: 120,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#00b894',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',


  },
  avatar: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00b894',
    borderRadius: 16,
    padding: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  editNameButton: {
    marginLeft: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    padding: 0,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  changePasswordText: {
    color: '#00b894',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fieldIcon: {
    marginRight: 12,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchIconContainer: {
    marginRight: 12,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f7f9fc',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  updateButton: {
    borderRadius: 10,
    backgroundColor: '#00b894',
    height: 50,
    justifyContent: 'center',
  },
  updateButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  deleteAvatarButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#d63031',
    borderRadius: 16,
    padding: 4,
  },

});
