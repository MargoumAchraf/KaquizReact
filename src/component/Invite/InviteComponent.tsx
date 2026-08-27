import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../Service/Api';

type InviteTab = 'incoming' | 'outgoing';

// Raw shape returned by the API for a single friend request
interface ApiInvite {
  id: number;
  username: string;
  image?: string;
}

interface Invite {
  id: string;
  name: string;
  imageUrl?: string;
}

async function authHeaders() {
  const token = await AsyncStorage.getItem('jwt');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function InviteComponent() {
  const [activeTab, setActiveTab] = useState<InviteTab>('incoming');
  const [incoming, setIncoming] = useState<Invite[]>([]);
  const [outgoing, setOutgoing] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    try {
      setError(null);
      const headers = await authHeaders();

      const res = await fetch(`${api}/api/invites`, { headers });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: { incoming: ApiInvite[]; outgoing: ApiInvite[] } =
        await res.json();

      const mapInvite = (item: ApiInvite): Invite => ({
        id: String(item.id),
        name: item.username,
        imageUrl: item.image ? `${api}${item.image}` : undefined,
      });

      setIncoming((data.incoming ?? []).map(mapInvite));
      setOutgoing((data.outgoing ?? []).map(mapInvite));
    } catch (err) {
      console.error('Error fetching invites:', err);
      setError('Could not load invites. Pull down to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);




  const declineIncoming = async (id: string) => {
    setIncoming((prev) => prev.filter((invite) => invite.id !== id));
    try {
      const headers = await authHeaders();
      const res = await fetch(`${api}/api/invites/${id}/accept`, {
        method: 'POST', // guess — confirm with backend
        headers,
      });
      if (!res.ok) throw new Error(`Failed to decline request ${id}`);
    } catch (err) {
      console.error(err);
      fetchInvites();
    }
  };

  const cancelOutgoing = async (id: string) => {
    console.log('Canceling outgoing invite with id:', id);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${api}/api/invites/${id}/decline`, {
        method: 'DELETE', // guess — confirm with backend
        headers,
      });
      if (!res.ok) throw new Error(`Failed to cancel request ${id}`);
      fetchInvites();

    } catch (err) {
      console.error(err);
      fetchInvites();
    }
  };

  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Invites</Text>

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
            activeTab === 'outgoing' && styles.toggleButtonActive,
          ]}
          onPress={() => setActiveTab('outgoing')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'outgoing' && styles.toggleTextActive,
            ]}
          >
            {'\u2197'} Outgoing
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={currentList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchInvites}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.inviteRow}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <Text style={styles.inviteName}>{item.name}</Text>

              {activeTab === 'incoming' ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.acceptIconButton]}
                    onPress={() => declineIncoming(item.id)}
                  >
                    <Text style={styles.acceptIconText}>{'\u2713'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.denyIconButton]}
                    onPress={() => cancelOutgoing(item.id)}
                  >
                    <Text style={styles.denyIconText}>{'\u2715'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                
                >
                  <Text style={styles.actionButtonText}>Pending</Text>
                </TouchableOpacity>
              )}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e05a63',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#e05a63',
  },
  toggleText: {
    color: '#e05a63',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#c0392b',
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#e05a63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: '700',
  },
  inviteName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
  },
  denyButton: {
    backgroundColor: '#95a5a6',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  acceptIconButton: {},
  denyIconButton: {},
  acceptIconText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '700',
  },
  denyIconText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
});