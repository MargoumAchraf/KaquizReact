import { StyleSheet, Text, View } from "react-native";
import TabBar from "../component/Bar/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                This is a test app. You can edit the code in App.tsx to see changes reflected here.
            </Text>
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