import { Text } from "@/components";
import { queryClient } from "@/provider/QueryProvider";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { resetGuestHomeworks, setGuestHomeworksEmpty } from "../guestData";

export default function HomeworksTestButtons() {
    return (
        <View style={{ gap: 8, width: "100%" }}>
            <Text size={13} color="rgba(255, 255, 255, 0.5)">
                📚 DEVOIRS
            </Text>

            <TouchableOpacity
                onPress={() => {
                    setGuestHomeworksEmpty(true);
                    queryClient.invalidateQueries({ queryKey: ["homeworks"] });
                }}
                style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                }}
            >
                <Text size={13} color="#FBBF24">
                    📭 Devoirs : Simuler Aucune Donnée
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    resetGuestHomeworks();
                    queryClient.invalidateQueries({ queryKey: ["homeworks"] });
                }}
                style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                }}
            >
                <Text size={13} color="#34D399">
                    🔄 Reset Tests Devoirs
                </Text>
            </TouchableOpacity>
        </View>
    );
}
