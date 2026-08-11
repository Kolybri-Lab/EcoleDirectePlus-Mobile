import { Text } from "@/components";
import { useMessageContent } from "@/features/messaging/hooks/useMessaging";
import { formatDate } from "@/utils/date";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const RECOVERY_MODE_BY_TYPE = {
    received: "recipient",
    sent: "sender",
    draft: null, // TODO: gérer les brouillons
    archived: null, // TODO: gérer les messages archivés
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
    console.log(messageContent);

    return (
        <SafeAreaView style={{ paddingTop: 80, paddingHorizontal: 20 }}>
            <Text preset="h2">{subject}</Text>
            <View
            // style={{
            //     borderColor: "red",
            //     borderWidth: 1,
            //     padding: 16,
            //     borderRadius: 15,
            // }}
            >
                <Text preset="title2">{sender.fullName}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text preset="label2">
                        {formatDate(new Date(date))} à {date.split("T")[1]}
                    </Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
                <Text preset="body1">{messageContent.content}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
