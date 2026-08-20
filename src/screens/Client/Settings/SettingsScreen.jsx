import { ScreenStack, Text } from "@/components";
import { Chevron, Info, Merge, Person, SafetyShield, Sun } from "@/components/svg";
import { useThemeStore } from "@/hooks/useThemeStore";
import dynamicBorderRadius from "@/utils/borderRadius";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RADIUS_INT = 5;
const RADIUS_EXT = 12;
const ICON_SIZE = 18;

function SettingsSection({ options }) {
    return (
        <View style={{ gap: 2, marginTop: 8 }}>
            {options.map((opt, index) => (
                <Pressable
                    key={opt.label}
                    onPress={opt.onPress}
                    style={{
                        backgroundColor: "hsla(0, 0%, 100%, .1)",
                        paddingVertical: 16,
                        paddingHorizontal: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        ...dynamicBorderRadius(
                            index,
                            options.length,
                            RADIUS_INT,
                            RADIUS_EXT
                        ),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        {opt.icon}
                        <Text preset="title2">{opt.label}</Text>
                    </View>
                    {opt.showChevron !== false && (
                        <Chevron size={16} fill="hsla(0, 0%, 100%, 0.3)" />
                    )}
                </Pressable>
            ))}
        </View>
    );
}

export default function SettingsScreen({}) {
    const themeMode = useThemeStore((state) => state.themeMode);
    const setThemeMode = useThemeStore((state) => state.setThemeMode);

    const accountOptions = [
        {
            label: "Compte",
            icon: <Person size={ICON_SIZE} />,
            onPress: () => {},
        },
        {
            label: "Données et confidentialité",
            icon: <SafetyShield size={ICON_SIZE} />,
            onPress: () => {},
        },
    ];
    const appOptions = [
        {
            label: "Thèmes",
            icon: <Sun size={ICON_SIZE} />,
            onPress: () => {},
        },
    ];
    const aboutOptions = [
        {
            label: "Notes de version",
            icon: <Merge size={ICON_SIZE} />,
            onPress: () => {},
        },
        {
            label: "À propos",
            icon: <Info size={ICON_SIZE} />,
            onPress: () => {},
        },
    ];

    return (
        <ScreenStack
            horizontalSpacing={40}
            style={{ backgroundColor: "hsl(230, 30%, 8%)" }}
        >
            <SafeAreaView>
                <Text>Paramètres</Text>
            </SafeAreaView>
            <View style={{ flex: 1, gap: 2 }}>
                <Text
                    preset="label2"
                    style={{ marginTop: 26 }}
                    color="hsla(0, 0%, 100%, .6)"
                >
                    Paramètres de compte
                </Text>
                <SettingsSection options={accountOptions} />
                <Text
                    preset="label2"
                    style={{ marginTop: 26 }}
                    color="hsla(0, 0%, 100%, .6)"
                >
                    Paramètres de l'app
                </Text>
                <SettingsSection options={appOptions} />
                <Text
                    preset="label2"
                    style={{ marginTop: 26 }}
                    color="hsla(0, 0%, 100%, .6)"
                >
                    À propos
                </Text>
                <SettingsSection options={aboutOptions} />
            </View>
        </ScreenStack>
    );
}
