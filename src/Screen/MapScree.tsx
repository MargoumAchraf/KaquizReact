import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapComponent from "../component/Map/MapComponent";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../component/FriendsList/FriendsList";
type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

export default function MapScreen() {
    const route = useRoute<MapScreenRouteProp>();
    const { userId } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <MapComponent userId={userId} />
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