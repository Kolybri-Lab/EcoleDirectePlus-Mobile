import { CustomTopHeader, Text } from "@/components";
import { useMessageContent } from "@/features/messaging/hooks/useMessaging";
import { useTheme } from "@/hooks/useThemeStore";
import { formatDate } from "@/utils/date";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const RECOVERY_MODE_BY_TYPE = {
    received: "recipient",
    sent: "sender",
    draft: null, // TODO: handle drafts
    archived: null, // TODO: handle achived messages
};

export default function MessagingDetails({ route }) {
    const { token, message } = route.params;
    const {
        id: messageId,
        type: typeOfRecovery,
        answered,
        canAnswer,
        date,
        files,
        folder,
        read,
        recipientType,
        sender,
        subject,
        transferred,
    } = message;
    const recoveryMode = RECOVERY_MODE_BY_TYPE[typeOfRecovery] ?? null;

    const {
        data: messageContent,
        isLoading,
        isError,
    } = useMessageContent(token, messageId, recoveryMode);
    const { colors } = useTheme();

    if (isLoading) {
        return (
            <View
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isError || !messageContent) {
        return (
            <View style={{ padding: 16 }}>
                <Text>Une erreur est survenue lors du chargement du message.</Text>
            </View>
        );
    }

    return (
        <>
            <CustomTopHeader
                headerTitle={"Retour aux messages"}
                backArrow={{ color: colors.contrast, size: 24 }}
                height={33}
                backgroundColor={colors.background.gradient}
            />
            <>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 14 }}
                >
                    <Text preset="h3" style={{ marginTop: 80, marginBottom: 10 }}>
                        {subject}
                    </Text>

                    <View
                        style={{
                            backgroundColor: "hsl(235, 28%, 15%)",
                            padding: 14,
                            borderRadius: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 40,
                                marginTop: 12,
                                gap: 8,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    backgroundColor: "hsla(219, 100%, 69%, 0.12)",
                                    padding: 6,
                                    borderRadius: 30,
                                    flexShrink: 1,
                                    minWidth: 0,
                                }}
                            >
                                <View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 18,
                                        backgroundColor: "hsla(217, 91%, 60%, 1)",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Text preset="label1" style={{ color: "white" }}>
                                        {sender.initials[1] ?? "??"}
                                    </Text>
                                </View>
                                <Text
                                    preset="label2"
                                    numberOfLines={1}
                                    style={{ flexShrink: 1 }}
                                >
                                    {sender.fullName}
                                </Text>
                            </View>

                            <Text
                                preset="label2"
                                numberOfLines={1}
                                style={{ flexShrink: 0 }}
                            >
                                {formatDate(new Date(date), "full")}
                            </Text>
                        </View>

                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                        <Text preset="body1">{messageContent.content}</Text>
                    </View>
                </ScrollView>
            </>
        </>
    );
}

