import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function ProfileComponent() {
  

  const [user, setUser] = useState<ApiUser | null>(null);

  const [loading, setLoading] = useState(true);

  const invites: Invite[] = [];

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
          throw new Error(
            `Request failed with status ${response.status}`
          );
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
      <Text style={styles.title}>
        Profile
      </Text>

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
          <View
            style={[
              styles.avatar,
              styles.avatarPlaceholder,
            ]}
          >
            <Text style={styles.avatarInitial}>
              {user.username
                ?.charAt(0)
                .toUpperCase() ?? '?'}
            </Text>
          </View>
        )}
      </View>

      {/* Username */}
      <Text style={styles.name}>
        {user.username}
      </Text>

      {/* Email */}
      <Text style={styles.email}>
        {user.email ?? 'No email'}
      </Text>

      {/* Stats */}
      <View style={styles.statsCard}>

        {/* Friends */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {user.countFriends}
          </Text>

          <Text style={styles.statLabel}>
            Friends
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Friend Requests */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {user.countFriendRequests}
          </Text>

          <Text style={styles.statLabel}>
            Requests
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Location */}
        <View style={styles.statItem}>
          <Text style={styles.statValueText}>
            {user.latitude.toFixed(2)},
            {user.longitude.toFixed(2)}
          </Text>

          <Text style={styles.statLabel}>
            Location
          </Text>
        </View>

      </View>

    
      

    </SafeAreaView>
  );
}