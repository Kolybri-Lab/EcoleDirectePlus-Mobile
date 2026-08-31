import { GoBackHeader, ScreenStack, Text } from "@/components";
import { ScrollView } from "react-native";

export default function SettingSectionLayout({ label = undefined, children }) {
    return (
        <ScreenStack
            horizontalSpacing={18}
            style={{ backgroundColor: "hsl(230, 30%, 8%)" }}
        >
            <GoBackHeader />
            <Text preset="h1" style={{ marginTop: 8, marginBottom: 38 }}>
                {label}
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {children}
            </ScrollView>
        </ScreenStack>
    );
}

