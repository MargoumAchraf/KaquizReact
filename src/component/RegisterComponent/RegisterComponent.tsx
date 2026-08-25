import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { isValidEmail, isValidUsername } from '../../utils/Validators';
import { Register } from '../../Service/auth/Register';
import { saveToken, saveUsername } from '../../utils/storage';
import { styles } from './style';

type ProfileFile = { uri: string; name: string; type: string };

export default function RegisterComponent({ navigation }: { navigation?: any }) {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [profileImage, setProfileImage] = useState<ProfileFile | undefined>(undefined);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel || response.errorCode) {
          if (response.errorCode) {
            console.warn('Image picker error:', response.errorMessage);
          }
          return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        // Backend/multipart needs uri + name + type — an incomplete
        // file object here is a common cause of "Network request
        // failed" on native, so build the full shape right here.
        const filename = asset.fileName ?? asset.uri.split('/').pop() ?? 'profile.jpg';
        const extMatch = /\.(\w+)$/.exec(filename);
        const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

        setProfileImage({
          uri: asset.uri,
          name: filename,
          type: asset.type ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        });
      },
    );
  };

  const handleRegister = async () => {
    const nextErrors: { name?: string; email?: string; password?: string } = {};

    if (!name) {
      nextErrors.name = 'Username is required';
    } else if (!isValidUsername(name)) {
      nextErrors.name = '3-20 chars, letters/numbers/./_ only';
    }

    if (!emailOrPhone) {
      nextErrors.email = 'Email is required';
    } else if (!isValidEmail(emailOrPhone)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!password || !confirmPassword) {
      nextErrors.password = 'Password is required';
    } else if (password !== confirmPassword) {
      nextErrors.password = 'Passwords do not match';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const data = await Register(name, emailOrPhone, password, profileImage);
      console.log(data);
      await saveToken(data.token);
      await saveUsername(data.username);

      // TODO: store token (e.g. AsyncStorage) before navigating
      navigation?.navigate?.('Home');
    } catch (error) {
      console.error('Registration failed:', error);
      // TODO: surface this to the user (Alert, inline banner, etc.)
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create Account</Text>
        </View>
      </SafeAreaView>

      <ScrollView>
        <View style={styles.avatarWrap}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPlaceholderText}>+</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarLabel}>
            {profileImage ? 'Change photo' : 'Add profile photo'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9B9B9B"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9B9B9B"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#9B9B9B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirm Password"
              placeholderTextColor="#9B9B9B"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.loginWrap}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
