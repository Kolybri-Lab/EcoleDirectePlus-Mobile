import dynamicBorderRadius from "@/utils/borderRadius";
import { Pressable, View } from "react-native";
import { Text } from "../core";

export default function Section({
    disabled = false,
    onPress,
    index = 0,
    totalLength = 0,
    radiusExt = 12,
    backgroundColor = "hsla(0, 0%, 100%, .1)",
    radiusInt = 5,
    label,
    subtitle,
    icon,
    height = 54,
    children,
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => ({
                backgroundColor,
                height,
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
                <View>
                    <Text preset="title2">{label}</Text>
                    {subtitle ? (
                        <Text preset="label2" color="hsla(0, 0%, 100%, .5)">
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </View>
            {children}
        </Pressable>
    );
}
