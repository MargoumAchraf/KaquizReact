import Geocoder from 'react-native-geocoder-reborn';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

import { styles } from './style';
import { api } from '../../Service/Api';

interface Invite {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ApiUser {
  id: number;
  username: string;
  email: string | null;
  image?: string;
  authProvider: string;
  countFriends: number;
  countFriendRequests: number;
  latitude: number;
  longitude: number;
}

interface Coords {
  latitude: number;
  longitude: number;
}

// No API key needed: OpenStreetMap's Nominatim service is free for
// reasonable, low-volume use. If you outgrow it, move geocoding to your
// own backend and keep any paid provider key server-side, never in the app bundle.
async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | undefined> {
  try {
    const placemarks = await Geocoder.geocodePosition({ lat, lng: lon });
    if (placemarks.length > 0) {
      const { locality } = placemarks[0];
      return locality ?? undefined;
    }
    return undefined;
  } catch (err) {
    console.error(`Geocoding request failed: ${err}`);
    throw new Error(`Geocoding request failed: ${err}`);
  }
}

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message: 'This app needs your location to show it on your profile.',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // iOS: permission is requested implicitly via Info.plist usage
  // description the first time getCurrentPosition is called.
  return true;
}

function getCurrentPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}

export default function ProfileComponent() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>('...');
  const [locating, setLocating] = useState(false);

  const invites: Invite[] = [];

  // Fetch user profile
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');

        const url = `${api}/api/user/me`;

        console.log('Fetching user data from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: ApiUser = await response.json();

        console.log('User data:', data);

        if (!data || typeof data.username !== 'string') {
          throw new Error(
            `Unexpected /api/user/me response: ${JSON.stringify(data)}`
          );
        }

        if (isMounted) {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Reverse-geocode once we have the user's coordinates from the backend
  useEffect(() => {
    let isMounted = true;

    if (user?.latitude && user?.longitude) {
      reverseGeocode(user.latitude, user.longitude)
        .then((result) => {
          if (isMounted) setCity(result);
        })
        .catch((error) => {
          console.error('Error reverse geocoding:', error);
          if (isMounted) setCity('Unknown');
        });
    }

    return () => {
      isMounted = false;
    };
  }, [user?.latitude, user?.longitude]);

  // Let the user refresh their location from the device itself instead of
  // relying only on whatever the backend has stored.
  const handleUseCurrentLocation = useCallback(async () => {
    setLocating(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission denied');
        return;
      }

      const { latitude, longitude } = await getCurrentPosition();
      const result = await reverseGeocode(latitude, longitude);
      setCity(result);

      // Optionally sync the fresh coordinates back to your backend here, e.g.:
      // await fetch(`${api}/api/user/me/location`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ latitude, longitude }),
      // });
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLocating(false);
    }
  }, []);

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // No user
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Unable to load profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {user.image ? (
          <Image
            source={{
              uri: `${api}${user.image}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {user.username?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
        )}
      </View>

      {/* Username */}
      <Text style={styles.name}>{user.username}</Text>

      {/* Email */}
      <Text style={styles.email}>{user.email ?? 'No email'}</Text>

      {/* Stats */}
      <View style={styles.statsCard}>
        {/* Friends */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.countFriends}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>

        <View style={styles.divider} />

        {/* Friend Requests */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.countFriendRequests}</Text>
          <Text style={styles.statLabel}>Requests</Text>
        </View>

        <View style={styles.divider} />

        {/* Location */}
        <TouchableOpacity
          style={styles.statItem}
          onPress={handleUseCurrentLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.statValueText}>{city}</Text>
          )}
          <Text style={styles.statLabel}>Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}