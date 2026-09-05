import { GoBackHeader, ScreenStack, Text } from "@/components";
import { ScrollView, View } from "react-native";

export default function SettingSectionLayout({
    label = undefined,
    subtitle = undefined,
    children,
}) {
    return (
        <ScreenStack
            horizontalSpacing={18}
            style={{ backgroundColor: "hsl(230, 30%, 8%)" }}
        >
            <GoBackHeader />
            <View style={{ marginBottom: 38, marginTop: 8, gap: 6 }}>
                <Text preset="h1">{label}</Text>
                <Text preset="label2" color="hsla(0, 0%, 100%, .5)">
                    {subtitle}
                </Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {children}
            </ScrollView>
        </ScreenStack>
    );
}
