import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { styles } from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

const API_URL = 'https://crusader-arming-riverboat.ngrok-free.dev/api/friends';
const IMAGE_BASE_URL = 'https://crusader-arming-riverboat.ngrok-free.dev';

type Friend = {
  id: number;
  username: string;
  email: string | null;
  image: string;
  authProvider: 'LOCAL' | 'GOOGLE' | string;
  countFriendRequests: number;
  countFriends: number;
  latitude: number;
  longitude: number;
};

export type RootStackParamList = {
  Map: { userId: number };
  FriendsList: undefined;
  // ...other screens
};
type MapRouteProp = RouteProp<RootStackParamList, 'Map'>;

export default function FriendsList() {



  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function authHeaders() {
    const token = await AsyncStorage.getItem('jwt');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    let isMounted = true;

    const fetchFriends = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = await authHeaders();
        const response = await fetch(API_URL, { headers });

        if (!response.ok) {
          console.log(response.status);
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: Friend[] = await response.json();

        if (isMounted) {
          setFriends(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load friends');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFriends();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFriends = useMemo(() => {
    if (!search.trim()) return friends;
    const query = search.toLowerCase();
    return friends.filter((f) => f.username.toLowerCase().includes(query));
  }, [friends, search]);

  // image field is sometimes a relative path (local uploads) and
  // sometimes a full URL (e.g. Google-hosted avatars)
  const resolveImageUri = (image: string) =>
    image.startsWith('http') ? image : `${IMAGE_BASE_URL}${image}`;

  if (loading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Error: {error}</Text>
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No friends found</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Map', { userId: item.id })} >
            <View style={styles.friendRow}>
              <Image
                source={{ uri: resolveImageUri(item.image) }}
                style={styles.friendAvatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName} numberOfLines={1}>
                  {item.username}
                  {item.email ? (
                    <Text style={styles.friendEmail}> · {item.email}</Text>
                  ) : null}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

        )}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No matches for "{search}"</Text>
          </View>
        }
      />
    </>
  );
}