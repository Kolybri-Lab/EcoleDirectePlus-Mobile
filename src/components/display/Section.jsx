import dynamicBorderRadius from "@/utils/borderRadius";
import { Pressable, View } from "react-native";
import { Text } from "../core";

export default function Section({
    disabled = false,
    onPress,
    index = 0,
    totalLength = 0,
    radiusExt = 10,
    radiusInt = 10,
    label,
    icon,
    children,
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => ({
                backgroundColor: "hsla(0, 0%, 100%, .1)",
                paddingVertical: 16,
                paddingHorizontal: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: pressed ? 0.6 : 1,
                ...dynamicBorderRadius(index, totalLength, radiusInt, radiusExt),
            })}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                {icon}
                <Text preset="title2">{label}</Text>
            </View>
            {children}
        </Pressable>
    );
}
