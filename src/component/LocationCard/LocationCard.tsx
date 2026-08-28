import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import geocoder from 'react-native-geocoder-reborn';
import { styles } from './style';
import { api } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Location = {
  latitude: number;
  longitude: number;
  locality?: string;
};

async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | undefined> {
  try {
    const placemarks = await geocoder.geocodePosition({
      lat,
      lng: lon,
    });

    if (placemarks.length > 0) {
      const { locality } = placemarks[0];

      return locality ?? undefined;
    }

    return undefined;
  } catch (err) {
    console.error('Geocoding request failed:', err);
    return undefined;
  }
}


async function authHeaders() {
  const token = await AsyncStorage.getItem('jwt');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function LocationCard() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setError('Location permission denied');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        const locality = await reverseGeocode(latitude, longitude);

        setLocation({
          latitude,
          longitude,
          locality,
        });

        setError(null);
      },
      err => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  const postLocation = async () => {
    if (location) {
       const headers = await authHeaders();
      try {
        const response = await fetch(`${api}/api/locations`, {
          method: 'POST',
          headers,
          body: JSON.stringify(location),
        });

        if (!response.ok) {
          throw new Error('Failed to post location');
        }
      } catch (err) {
        console.error('Error posting location:', err);
      }
    }
  };
  useEffect(() => {
    getLocation();
    postLocation();
  }, []);

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.label}>Location</Text>

        <View style={styles.row}>
          {location ? (
            <Text style={styles.value}>
              {location.locality ?? 'Unknown location'}
            </Text>
          ) : error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : (
            <ActivityIndicator size="small" />
          )}
        </View>
      </View>
    </View>
  );
}