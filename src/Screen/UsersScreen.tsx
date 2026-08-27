import { StyleSheet, Text, View } from "react-native";
import TabBar from "../component/Bar/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";
import UsersComponent from "../component/UsersComponent/UsersComponent";

export default function UsersScreen() {

    return (
       <SafeAreaView style={styles.container}>
          <UsersComponent/>
          <TabBar/>
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