import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';

interface Invite {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ProfileUser {
  name: string;
  email: string;
  imageUrl?: string;
  friendsCount: number;
  mutualCount: number;
  location: string;
}

// Replace with real data from your API / state
const user: ProfileUser = {
  name: 'Achraf Margoum',
  email: 'achrafmargouma@gmail.com',
  imageUrl: undefined, // put avatar URL here
  friendsCount: 0,
  mutualCount: 0,
  location: 'Ahl Angad, Maroc',
};

export default function ProfileComponent() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const invites: Invite[] = []; // populate from API

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {user.imageUrl ? (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Name + email */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {/* Stats card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.friendsCount}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.mutualCount}</Text>
          <Text style={styles.statLabel}>Mutual</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statValueText}>{user.location}</Text>
          <Text style={styles.statLabel}>Location</Text>
        </View>
      </View>

      {/* Incoming / Outgoing toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'incoming' && styles.toggleButtonActive,
          ]}
          onPress={() => setActiveTab('incoming')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'incoming' && styles.toggleTextActive,
            ]}
          >
            {'\u2199'} Incoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonOutline,
            activeTab === 'outgoing' && styles.toggleButtonActive,
          ]}
          onPress={() => setActiveTab('outgoing')}
        >
          <Text
            style={[
              styles.toggleText,
              styles.toggleTextOutline,
              activeTab === 'outgoing' && styles.toggleTextActive,
            ]}
          >
            {'\u2197'} Outgoing
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Invite list / empty state */}
      <FlatList
        data={invites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.inviteRow}>
            <Text>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === 'incoming' ? 'No incoming invites' : 'No outgoing invites'}
            </Text>
          </View>
        }
      />

    </SafeAreaView>
  );
}
