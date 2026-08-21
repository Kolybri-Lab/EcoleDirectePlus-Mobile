import { ScreenStack, Section, Text } from "@/components";
import {
    Chevron,
    Cross,
    Info,
    Merge,
    Person,
    SafetyShield,
    Sun,
} from "@/components/svg";
import { useThemeStore } from "@/hooks/useThemeStore";
import { routesNames } from "@/router/config/routesNames";
import { useNavigation } from "@react-navigation/native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RADIUS_INT = 5;
const RADIUS_EXT = 12;
const ICON_SIZE = 18;

function SettingsSection({ options }) {
    const navigation = useNavigation();
    return (
        <View style={{ gap: 2, marginTop: 8 }}>
            {options.map((opt, index) => (
                <Section
                    icon={opt.icon}
                    label={opt.label}
                    onPress={() => navigation.navigate(opt.route)}
                    index={index}
                    totalLength={options.length}
                    radiusExt={RADIUS_EXT}
                    radiusInt={RADIUS_INT}
                    key={opt.label}
                >
                    <Chevron size={16} fill="hsla(0, 0%, 100%, 0.3)" />
                </Section>
            ))}
        </View>
    );
}

export default function SettingsScreen({}) {
    const themeMode = useThemeStore((state) => state.themeMode);
    const setThemeMode = useThemeStore((state) => state.setThemeMode);
    const navigation = useNavigation();

    const accountOptions = [
        {
            label: "Compte",
            icon: <Person size={ICON_SIZE} opacity={0.6} />,
            route: routesNames.settings.account_settings.account,
        },
        {
            label: "Données et confidentialité",
            icon: <SafetyShield size={ICON_SIZE} opacity={0.6} />,
            route: routesNames.settings.account_settings.data_and_confidentiality,
        },
    ];
    const appOptions = [
        {
            label: "Thèmes",
            icon: <Sun size={ICON_SIZE} opacity={0.6} />,
            route: routesNames.settings.app_settings.theme,
        },
    ];
    const aboutOptions = [
        {
            label: "Notes de version",
            icon: <Merge size={ICON_SIZE} opacity={0.6} />,
            route: routesNames.settings.about_settings.release_notes,
        },
        {
            label: "À propos",
            icon: <Info size={ICON_SIZE} opacity={0.6} />,
            route: routesNames.settings.about_settings.about,
        },
    ];

    return (
        <ScreenStack
            horizontalSpacing={30}
            style={{ backgroundColor: "hsl(230, 30%, 8%)" }}
        >
            <SafeAreaView
                style={{
                    marginTop: 8,
                }}
            >
                <Pressable
                    style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
                    onPress={() => navigation.goBack()}
                >
                    <Cross size={ICON_SIZE} />
                    <Text preset="h4">Paramètres</Text>
                </Pressable>
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
            <SafeAreaView edges={["bottom"]} style={{ marginBottom: 20 }}>
                <View
                    style={{
                        backgroundColor: "hsla(0, 0%, 35%, .3)",
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                    }}
                >
                    <Text preset="label3" color="hsla(0, 0%, 100%, .6)">
                        Le meilleur reste à venir...
                    </Text>
                </View>
            </SafeAreaView>
        </ScreenStack>
    );
}
