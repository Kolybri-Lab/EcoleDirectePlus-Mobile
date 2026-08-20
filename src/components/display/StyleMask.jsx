import { useTheme } from "@react-navigation/native";
import { View } from "react-native";

export default function StyleMask({ children }) {
    const { colors } = useTheme();
    return (
        <View style={{ backgroundColor: colors.background.gradient, flex: 1 }}>
            {children}
        </View>
    );
}
