import { Section, Text } from "@/components";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { Platform, View } from "react-native";
import SettingSectionLayout from "../components/SettingSectionLayout";

export default function PlusScreen({ route }) {
    const { label } = route.params;

    const { major, minor, patch } = Platform.constants.reactNativeVersion;
    const rnVersion = `${major}.${minor}.${patch}`; // ex: "0.74.5"

    const infos = {
        "Nom de l'application": Application.applicationName,
        Version: Application.nativeApplicationVersion,
        "Numéro de build": Application.nativeBuildVersion,
    };

    const debug = {
        "React Native": rnVersion,
        Expo: Constants?.expoConfig?.sdkVersion,
    };

    const infosEntries = Object.entries(infos);
    const debugEntries = Object.entries(debug);

    return (
        <SettingSectionLayout label={label}>
            <View style={{ gap: 3 }}>
                <Text
                    style={{ marginBottom: 12 }}
                    preset="label2"
                    color="hsla(0, 0%, 100%, .6)"
                >
                    Informations
                </Text>
                {infosEntries.map(([key, value], index) => (
                    <Section
                        key={key}
                        label={key}
                        subtitle={String(value)}
                        index={index}
                        totalLength={infosEntries.length}
                    />
                ))}
            </View>
            <View style={{ gap: 3, marginTop: 20 }}>
                <Text
                    style={{ marginBottom: 12 }}
                    color="hsla(0, 0%, 100%, .6)"
                    preset="label2"
                >
                    Debug
                </Text>
                {debugEntries.map(([key, value], index) => (
                    <Section
                        key={key}
                        label={key}
                        subtitle={String(value)}
                        index={index}
                        totalLength={debugEntries.length}
                    />
                ))}
            </View>
        </SettingSectionLayout>
    );
}
