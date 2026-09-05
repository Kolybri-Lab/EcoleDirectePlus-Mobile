import { Switch, Text } from "@/components";
import { useUserStore } from "@/hooks/useUserStore";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { useState } from "react";
import {
    Dimensions,
    PixelRatio,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingSectionLayout from "./components/SettingSectionLayout";

const THEMES_OPT = { dark: "Sombre", light: "Clair" };

const FEEDBACK_OPT = [
    { name: "Général", placeHolderMessage: "Comment trouvez vous l'application ?" },
    { name: "Style", placeHolderMessage: "Joli, trop sombre, coloré, petit..." },
    {
        name: "Fonctionnalités",
        placeHolderMessage: "Ce que vous voulez, ou ce qui est peu pratique",
    },
    {
        name: "Bug",
        placeHolderMessage: "Un comportement bizarre de l'app, soyez précis.",
    },
];

const { width, height } = Dimensions.get("window");
const scale = PixelRatio.get();

const MESSAGE_MAX_LENGTH = 500;
const TITLE_MAX_LENGTH = 50;

export default function FeedbackScreen({ route }) {
    const { label } = route.params;
    const dataPreferences = useUserStore((s) => s.preferences.dataPreferences);
    const preferences = useUserStore((s) => s.preferences);
    const setDataPreference = useUserStore((s) => s.setDataPreference);

    const [activeChip, setActiveChip] = useState(FEEDBACK_OPT[0]);

    const [formValues, setFormValues] = useState({
        title: "",
        message: "",
        tech: {
            appVersion: "",
            modelInfo: "",
            osInfo: "",
            screenInfo: "",
            theme: "",
        },
    });

    const updateField = (field, value) =>
        setFormValues((prev) => ({ ...prev, [field]: value }));

    const isFormValid =
        formValues.title.trim().length > 0 && formValues.message.trim().length > 0;

    console.log(formValues);
    const TECH_OPTIONS = [
        {
            storeKey: "appVersion", // key in store
            title: "Version de l'application",
            locked: true,
            subtitle: Application.nativeApplicationVersion,
        },
        {
            storeKey: "modelInfo",
            title: "Modèle du téléphone",
            subtitle: Device.modelName ?? "Modèle inconnu",
        },
        {
            storeKey: "osInfo",
            title: "Version du système",
            subtitle:
                `${Device.osName ?? Platform.OS} ${Device.osVersion ?? ""}`.trim(),
        },
        {
            storeKey: "screenInfo",
            title: "Dimensions de l'écran",
            subtitle: `${Math.round(width)} × ${Math.round(height)} px · échelle ${scale}x`,
        },
        {
            storeKey: "theme",
            title: "Thème utilisé",
            subtitle: THEMES_OPT[preferences.theme],
        },
    ];
    return (
        <SettingSectionLayout
            label={label}
            subtitle={"Un bug, une idée, un coup de gueule : on lit tout."}
        >
            <ScrollView contentContainerStyle={{ gap: 16, flex: 1 }}>
                <View style={{ gap: 8 }}>
                    <Text preset="label1">Sur quoi porte votre retour ?</Text>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ gap: 8 }}
                        showsHorizontalScrollIndicator={false}
                    >
                        {FEEDBACK_OPT.map((option) => {
                            const isActive = option.name === activeChip.name;

                            return (
                                <Pressable
                                    key={option.name}
                                    onPress={() => setActiveChip(option)}
                                    style={{
                                        paddingHorizontal: 15,
                                        paddingVertical: 6,
                                        borderRadius: 25,
                                        borderColor: isActive
                                            ? "hsl(236, 74%, 70%)"
                                            : "transparent",
                                        borderWidth: 1.5,
                                        backgroundColor: isActive
                                            ? "hsla(237, 76%, 71%, .16)"
                                            : "hsla(0, 0%, 100%, .12)",
                                    }}
                                >
                                    <Text
                                        preset="body1"
                                        color={
                                            isActive
                                                ? "hsl(236, 74%, 70%)"
                                                : "hsla(0, 0%, 100%, .6)"
                                        }
                                    >
                                        {option.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={{ gap: 8 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Text preset="label1">Titre</Text>
                        <Text preset="title1" color="hsl(236, 74%, 70%)">
                            *
                        </Text>
                    </View>
                    <TextInput
                        placeholder={"Résumez en quelques mots"}
                        maxLength={TITLE_MAX_LENGTH}
                        onChangeText={(text) => updateField("title", text)}
                        autoCapitalize="sentences"
                        style={{
                            backgroundColor: "hsla(0, 0%, 100%, .12)",
                            borderColor: "hsla(0, 0%, 100%, .16)",
                            borderWidth: 1.5,
                            borderRadius: 12,
                            paddingVertical: 13,
                            paddingHorizontal: 14,
                        }}
                        placeholderTextColor={"hsla(0, 0%, 100%, .4)"}
                    />
                </View>
                <View style={{ gap: 8 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Text preset="label1">Votre message</Text>
                        <Text preset="title1" color="hsl(236, 74%, 70%)">
                            *
                        </Text>
                    </View>
                    <View style={{ gap: 4 }}>
                        <TextInput
                            placeholder={activeChip.placeHolderMessage}
                            multiline
                            textAlignVertical="top"
                            maxLength={MESSAGE_MAX_LENGTH}
                            onChangeText={(text) => updateField("message", text)}
                            style={{
                                backgroundColor: "hsla(0, 0%, 100%, .12)",
                                borderColor: "hsla(0, 0%, 100%, .16)",
                                borderWidth: 1.5,
                                borderRadius: 12,
                                paddingVertical: 13,
                                paddingHorizontal: 14,
                                height: 110,
                            }}
                            placeholderTextColor={"hsla(0, 0%, 100%, .4)"}
                        />
                        <Text preset="body3" align="right">
                            {formValues.message.length}/{MESSAGE_MAX_LENGTH}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        height: 2,
                        backgroundColor: "hsla(0, 0%, 100%, .3)",
                        marginVertical: 10,
                    }}
                />
                <SafeAreaView edges={["bottom"]}>
                    <View
                        style={{
                            backgroundColor: "hsla(0, 0%, 100%, .09)",
                            padding: 16,
                            borderRadius: 20,
                            borderColor: "hsla(0, 0%, 100%, .13)",
                            borderWidth: 1,
                        }}
                    >
                        <View style={{ gap: 2 }}>
                            <Text preset="label1">
                                Informations techniques envoyées
                            </Text>
                            <Text preset="body3">
                                Elles aident les developpeurs à corriger les
                                problèmes.{"\n"}
                                Choisissez ce que vous partagez.
                            </Text>
                        </View>
                        {TECH_OPTIONS.map((option) => (
                            <Option
                                key={option.storeKey}
                                title={option.title}
                                subtitle={option.subtitle}
                                value={dataPreferences[option.storeKey]}
                                locked={option.locked}
                                onToggle={() =>
                                    setDataPreference(
                                        option.storeKey,
                                        !dataPreferences[option.storeKey]
                                    )
                                }
                            />
                        ))}
                    </View>
                </SafeAreaView>
            </ScrollView>
        </SettingSectionLayout>
    );
}
function Option({
    title,
    subtitle,
    value,
    onToggle,
    locked = false,
    isFirst = false,
}) {
    return (
        <View>
            {!isFirst && (
                <View
                    style={{
                        height: 1,
                        backgroundColor: "hsla(0, 0%, 100%, .1)",
                        marginVertical: 12,
                    }}
                />
            )}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <View style={{ gap: 2, flex: 1 }}>
                    <Text preset="body1">{title}</Text>
                    <Text preset="body3" color="hsla(0, 0%, 100%, .5)">
                        {subtitle}
                    </Text>
                </View>

                {locked ? (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "hsla(0, 0%, 100%, .1)",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 8,
                        }}
                    >
                        <Text preset="body3" color="hsla(0, 0%, 100%, .5)">
                            🔒 toujours incluse
                        </Text>
                    </View>
                ) : (
                    <Switch value={value} onValueChange={onToggle} />
                )}
            </View>
        </View>
    );
}
