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

export default function LocationCard() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    getLocation();
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