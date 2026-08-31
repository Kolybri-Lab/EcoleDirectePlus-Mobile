import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingSectionLayout from "./components/SettingSectionLayout";

export default function ReleaseNotesScreen({ route }) {
    const { label } = route.params;

    return (
        <SettingSectionLayout label={label}>
            <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "hsla(0, 0%, 100%, .24)",
                        borderRadius: 32,
                        marginBottom: 30,
                        marginHorizontal: 10,
                    }}
                ></View>
            </SafeAreaView>
        </SettingSectionLayout>
    );
}
