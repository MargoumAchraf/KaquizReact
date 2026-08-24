import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const ORANGE = '#E8631C';

export default function LoginComponent({ navigation }: { navigation?: any }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: wire up to auth logic
    console.log({ emailOrPhone, password });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>
      </SafeAreaView>

      <ScrollView
       
      >
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Email or Phone number"
              placeholderTextColor="#9B9B9B"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
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
        </View>

        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupWrap}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSafeArea: {
    backgroundColor: ORANGE,
  },
  header: {
    backgroundColor: ORANGE,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 90,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#fff',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    marginTop: 16,
  },

  card: {
    backgroundColor: '#fff',
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#333',
    padding: 0,
  },
  eyeIcon: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDEDED',
  },
  forgotWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  forgotText: {
    color: '#9B9B9B',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: ORANGE,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  signupWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  signupText: {
    color: '#9B9B9B',
    fontSize: 15,
  },
  signupLink: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: '700',
  },
});