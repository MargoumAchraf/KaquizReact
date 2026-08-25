import React from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { styles } from './style';



export default function FriendsList() {

  const friends = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com' }
  ];

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
          placeholder={"placeholder"}
          placeholderTextColor="#94a3b8"
          
        />
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <Text style={styles.friendName}>{item.name}</Text>
            <Text style={styles.friendEmail}>{item.email}</Text>
          </View>
        )}
        style={styles.list}
      />
    </>
  );
}
