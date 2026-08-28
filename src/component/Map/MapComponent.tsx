import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

interface Coords {
  latitude: number;
  longitude: number;
}

type MapComponentProps = {
  userId: number;
};
async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message: 'This app needs your location to show it on the map.',
      buttonPositive: 'OK',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}
export default function MapComponent({ userId }: MapComponentProps) {
  const [position, setPosition] = useState<Coords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission().then((allowed) => {
      if (!allowed) {
        setErrorMsg('Location permission denied');
        return;
      }
      Geolocation.getCurrentPosition(
        (pos) =>
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (error) => setErrorMsg(error.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }, []);

  if (!position) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{errorMsg ?? 'Getting your location…'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: position.latitude, longitude: position.longitude }}
          title="My Location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFill },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666' },
});