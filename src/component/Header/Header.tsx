import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { api } from '../../Service/Api';
import { styles } from './style';

interface user {
  username?: string;
  email?: string;
  image?: string;
}


export default function Header() {

  const [user, setUser] = useState({} as user);


useEffect(() => {
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
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('User data:', data);
      setUser(data);
      // setUserData(data) or whatever you need to do with it
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);





  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Image source={{ uri: `${api}${user.image}` }} style={styles.avatar} />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user.username}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} >

      </TouchableOpacity>
    </View>
  );
}
