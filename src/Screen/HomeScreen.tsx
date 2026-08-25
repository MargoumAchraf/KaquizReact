import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../component/Header/Header';
import LocationCard from '../component/LocationCard/LocationCard';
import FriendsList from '../component/FriendsList/FriendsList';
import TabBar from '../component/Bar/TabBar';
import { isTokenValid } from '../utils/Validators';
import { clearAuth } from '../utils/storage';

// Decode JWT payload without verifying signature (client-side expiry check only)




export default function HomeScreen() {
  const navigation = useNavigation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');

      if (isTokenValid(token)) {
        setCheckingAuth(false);
      } else {
        await clearAuth();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        });
      }
    } catch (e) {
      console.error('Error checking token', e);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    }
  };

  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <LocationCard />
      <FriendsList />
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});