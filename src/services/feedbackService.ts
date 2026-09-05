import { WEBHOOK_URL } from "@/constants/config";
import { useErrorStore } from "@/hooks/useErrorStore";
import { useUserStore } from "@/hooks/useUserStore";
import * as Device from "expo-device";
import * as Updates from "expo-updates";
import { Dimensions, Platform } from "react-native";

let lastSentTimestamp = 0;
const RATE_LIMIT_DELAY_MS = 1000 * 30; // 30s

export interface ReportOptions {
    userMessage?: string;
    type: "error" | "feedback";
}

export const sendDevReport = async ({
    userMessage,
    type = "feedback",
}: ReportOptions): Promise<{ success: boolean; message?: string }> => {
    // Anti-spam
    const now = Date.now();
    if (now - lastSentTimestamp < RATE_LIMIT_DELAY_MS) {
        const waitSeconds = Math.ceil(
            (RATE_LIMIT_DELAY_MS - (now - lastSentTimestamp)) / 1000
        );
        return {
            success: false,
            message: `Veuillez patienter ${waitSeconds}s avant d'envoyer un autre rapport.`,
        };
    }

    const preferences = useUserStore.getState().preferences;

    const screen = Dimensions.get("screen");
    const window = Dimensions.get("window");
    const screenInfo =
        preferences.dataPreferences.screenInfo === true
            ? `${Math.round(screen.width)}x${Math.round(screen.height)} px (scale: ${screen.scale}x, fontScale: ${screen.fontScale.toFixed(2)})`
            : "Données refusées";
    const windowInfo =
        preferences.dataPreferences.screenInfo === true
            ? `Zone utile: ${Math.round(window.width)}x${Math.round(window.height)} px`
            : "Données refusées";

    const brand =
        preferences.dataPreferences.osInfo === true
            ? (Device.brand ?? "Inconnu")
            : "Données refusées";
    const modelName =
        preferences.dataPreferences.osInfo === true
            ? (Device.modelName ?? "Modèle inconnu")
            : "Données refusées";
    const osVersion =
        preferences.dataPreferences.osInfo === true
            ? `${Platform.OS.toUpperCase()} ${Platform.Version}`
            : "Données refusées";
    const osBuild =
        preferences.dataPreferences.osInfo === true
            ? Device.osBuildId
                ? `(Build: ${Device.osBuildId})`
                : ""
            : "Données refusées";

    const errors = useErrorStore.getState().errors;
    let formattedError = "Aucune erreur";
    if (errors.length > 0) {
        formattedError = errors
            .map((item, index) => {
                const err = item.error;
                const time = new Date(item.timestamp).toLocaleTimeString("fr-FR");
                let extra = "";
                if (err.type === "api-business") {
                    extra = ` (Code: ${err.code}${err.feature ? `, Module: ${err.feature}` : ""})`;
                } else if (err.type === "auth") {
                    extra = ` (Raison: ${err.reason}, Code: ${err.code})`;
                }
                return `**${index + 1}. [${err.type.toUpperCase()}]** - ${time}${extra}\n\`\`\`\n${err.message.slice(0, 300)}\n\`\`\``;
            })
            .join("\n")
            .slice(0, 1000);
    }

    const runtimeVersion = Updates.runtimeVersion;

    const payload = {
        embeds: [
            {
                title:
                    type === "error"
                        ? "🚨 Erreur / Crash signalé"
                        : "💬 Retour utilisateur",
                fields: [
                    {
                        name: "📱 Appareil",
                        value: `• **Modèle :** ${brand} ${modelName}\n• **OS :** ${osVersion} ${osBuild}\n• **Écran :** ${screenInfo}\n• **Fenêtre :** ${windowInfo}`,
                        inline: false,
                    },
                    {
                        name: "📦 Version App",
                        value: `v${runtimeVersion}`,
                        inline: true,
                    },
                    ...(type === "error"
                        ? [
                              {
                                  name: "⚠️ Détails de l'erreur",
                                  value: formattedError,
                                  inline: false,
                              },
                          ]
                        : []),
                    {
                        name: "📝 Message",
                        value:
                            userMessage && userMessage.trim().length > 0
                                ? userMessage.slice(0, 1000)
                                : "*Aucun message*",
                        inline: false,
                    },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
    };

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            lastSentTimestamp = now;
            return { success: true };
        }

        return {
            success: false,
            message: `Erreur serveur Discord (${res.status})`,
        };
    } catch (err: any) {
        return {
            success: false,
            message: err?.message ?? "Erreur réseau inconnue",
        };
    }
};
