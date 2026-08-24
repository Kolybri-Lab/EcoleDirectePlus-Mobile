import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/core";
import { ProgressBar } from "@/components/progression/ProgressBar";

export default function HomeworkProgress({
    completedCount = 0,
    totalCount = 0,
    progression,
    encouragementSentence = "",
    sentence,
    style,
}) {
    const computedProgression =
        progression !== undefined
            ? progression
            : totalCount > 0
            ? Math.round((completedCount / totalCount) * 100) / 100
            : 0;

    const textSentence = sentence ?? encouragementSentence;

    return (
        <SafeAreaView
            style={[
                {
                    height: "25%",
                    justifyContent: "space-between",
                    paddingTop: 14,
                },
                style,
            ]}
        >
            <View
                style={{
                    backgroundColor: "hsl(240, 19%, 38%)",
                    alignSelf: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    borderRadius: 9,
                }}
            >
                <Text align="center" preset="h3">
                    {completedCount}/{totalCount}
                </Text>
            </View>
            <ProgressBar
                progression={computedProgression}
                style={{
                    marginHorizontal: 50,
                    backgroundColor: "hsl(240, 15%, 33%)",
                }}
            />

            <Text preset="custom1" align="center" color="hsl(240, 34%, 77%)">
                {textSentence}
            </Text>
        </SafeAreaView>
    );
}
