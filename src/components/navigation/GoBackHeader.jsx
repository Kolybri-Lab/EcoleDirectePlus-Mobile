import { BackArrow } from "@/components/svg";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoBackHeader({}) {
    const navigation = useNavigation();

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView
            style={{
                alignItems: "center",
                flexDirection: "row",
            }}
        >
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleGoBack}
                style={{
                    top: 8,
                }}
            >
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        backgroundColor: "hsla(0, 0%, 100%, 0.25)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <BackArrow size={26} />
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
