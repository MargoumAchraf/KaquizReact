import { StyleSheet, Text, View } from "react-native";
import TabBar from "../component/Bar/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileComponent from "../component/Profile/ProfileComponent";
import InviteComponent from "../component/Invite/InviteComponent";

export default function ProfileScreen() {

    return (
        <SafeAreaView style={styles.container}>
            <ProfileComponent />
            <InviteComponent />
            <TabBar />
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});