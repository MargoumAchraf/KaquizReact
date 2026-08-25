import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./src/Screen/HomeScreen";
import ProfileScreen from "./src/Screen/ProfileScreen";
import RegisterScreen from "./src/Screen/RegisterScrene";
import LoginScreen from "./src/Screen/LoginScrene";
import UsersScreen from "./src/Screen/UsersScreen";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useEffect } from 'react';

function App() {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    SystemNavigationBar.setNavigationColor('#000000', 'light');
  }, []);
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;