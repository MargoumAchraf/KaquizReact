import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Save token ----
export const saveToken = async (token : string ) => {
  try {
    await AsyncStorage.setItem('jwt', token);
  } catch (e) {
    console.error('Error saving token', e);
  }
};

// ---- Get token ----
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('jwt');
  } catch (e) {
    console.error('Error getting token', e);
    return null;
  }
};

// ---- Save username ----
export const saveUsername = async (username : string) => {
  try {
    await AsyncStorage.setItem('username', username);
  } catch (e) {
    console.error('Error saving username', e);
  }
};

// ---- Get username ----
export const getUsername = async () => {
  try {
    return await AsyncStorage.getItem('username');
  } catch (e) {
    console.error('Error getting username', e);
    return null;
  }
};

// ---- Clear (logout) ----
export const clearAuth = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Error clearing auth', e);
  }
};