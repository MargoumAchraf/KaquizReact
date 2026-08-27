import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import { styles } from './style';

type LocationInfo = {
  lat: number;
  lng: number;
  locality: string | undefined;
};

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true; // iOS handled via Info.plist + prompt
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'This app needs access to your location to show it here.',
      buttonPositive: 'OK',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  });
}

async function getCurrentLocationInfo(): Promise<LocationInfo | undefined> {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      console.log('Location permission denied');
      return undefined;
    }

    const { lat, lng } = await getCurrentPosition();

    console.log('GPS:', lat, lng);

    return {
      lat,
      lng,
      locality: undefined,
    };
  } catch (err) {
    console.error('Location error:', err);
    return undefined;
  }
}

export default function LocationCard() {
  const [location, setLocation] = useState<LocationInfo | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocationInfo()
      .then(setLocation)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.row}>
          <Text style={styles.value}>
            {loading ? 'Loading...' : location?.locality ?? 'Permission denied'}
          </Text>
        </View>
      </View>
    </View>
  );
}