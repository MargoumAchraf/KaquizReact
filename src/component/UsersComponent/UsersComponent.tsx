import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../Service/Api';

type User = {
    id: number;
    username: string;
    email: string | null;
    image: string;
    authProvider: string;
    countFriendRequests: number;
    countFriends: number;
    latitude: number;
    longitude: number;
};

type InviteStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function UsersComponent() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [inviteStatus, setInviteStatus] = useState<Record<number, InviteStatus>>({});

    const getUsers = async (pageNumber: number) => {
        if (loading || !hasMore) {
            return;
        }

        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('jwt');

            const response = await fetch(
                `${api}/api/all-users?page=${pageNumber}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            console.log('PAGE:', pageNumber);
            console.log('API:', data);

            const newUsers: User[] = data.users;

            setUsers(prevUsers => [...prevUsers, ...newUsers]);

            // If this page is empty, there are no more users
            if (newUsers.length === 0) {
                setHasMore(false);
            }

        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load first page
    useEffect(() => {
        getUsers(0);
    }, []);

    const loadMore = () => {
        if (loading || !hasMore) {
            return;
        }

        const nextPage = page + 1;

        console.log('Loading page:', nextPage);

        setPage(nextPage);

        getUsers(nextPage);
    };

    const handleInvite = async (userId: number) => {
        // prevent double taps while a request is in flight or already sent
        if (inviteStatus[userId] === 'sending' || inviteStatus[userId] === 'sent') {
            return;
        }

        setInviteStatus(prev => ({ ...prev, [userId]: 'sending' }));

        try {
            const token = await AsyncStorage.getItem('jwt');

            const response = await fetch(`${api}/api/invites/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            setInviteStatus(prev => ({ ...prev, [userId]: 'sent' }));
        } catch (error) {
            console.error('Error sending invite:', error);
            setInviteStatus(prev => ({ ...prev, [userId]: 'error' }));
        }
    };

    const renderUser = ({ item }: { item: User }) => {
        const status = inviteStatus[item.id] ?? 'idle';

        return (
            <View style={styles.userContainer}>
                {item.authProvider === 'LOCAL' && (
                    <Image
                        source={{
                            uri: `${api}${item.image}`,
                        }}
                        style={styles.image}
                    />
                )}{item.authProvider === 'GOOGLE' && (
                    <Image
                        source={{
                            uri: item.image,
                        }}
                        style={styles.image}
                    />
                )}

                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        {item.username}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.addButton,
                        status === 'sent' && styles.addButtonSent,
                        status === 'error' && styles.addButtonError,
                    ]}
                    onPress={() => handleInvite(item.id)}
                    disabled={status === 'sending' || status === 'sent'}
                >
                    {status === 'sending' ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.addButtonText}>
                            {status === 'sent' ? 'Sent' : status === 'error' ? 'Retry' : 'Add'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <FlatList
                data={users}

                keyExtractor={(item) =>
                    item.id.toString()
                }

                renderItem={renderUser}

                // Load next page when reaching the bottom
                onEndReached={loadMore}

                // Start loading when 50% from the bottom
                onEndReachedThreshold={0.5}

                // Loading indicator
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator
                            size="large"
                            style={styles.loader}
                        />
                    ) : undefined
                }

                // Show message when there are no users
                ListEmptyComponent={
                    !loading ? (
                        <Text style={styles.empty}>
                            No users found
                        </Text>
                    ) : undefined
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#eee',
    },

    userInfo: {
        marginLeft: 15,
        flex: 1,
    },

    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
    },

    friends: {
        fontSize: 13,
        color: '#444',
        marginTop: 5,
    },

    requests: {
        fontSize: 13,
        color: '#444',
        marginTop: 2,
    },

    loader: {
        padding: 20,
    },

    empty: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },

    addButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonSent: {
        backgroundColor: '#94a3b8',
    },

    addButtonError: {
        backgroundColor: '#dc2626',
    },

    addButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
});