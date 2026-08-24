import { memo, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "@/hooks/useThemeStore";

import { Text } from "@/components/core";
import { adjustLightness } from "@/utils/colorGenerator";

export const HomeworkDateItem = memo(
    ({ contracted, isEvaluation, isActive, allTasksCompleted, onPress }) => {
        const { colors } = useTheme();
        return (
            <TouchableOpacity
                style={{
                    width: 65,
                    height: isActive ? 90 : 65,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.secondary,
                        borderRadius: 16,
                        borderWidth: allTasksCompleted ? 1.5 : 0,
                        borderColor: "#129e43ff",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: "SemiBold",
                            color: isEvaluation ? "#ff4b4b" : colors.contrast,
                        }}
                    >
                        {contracted[1]}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: "SemiBold",
                            color: isEvaluation ? "#ff4b4b" : colors.contrast,
                            marginTop: -12,
                        }}
                    >
                        {contracted[0]}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
);

export default function HomeworkDatesRow({
    homeworksDates,
    dates,
    activeDate,
    onSelectDate,
    setActiveDate,
    mergedHomeworks,
    style,
}) {
    const datesData = dates ?? homeworksDates;
    const handleSelect = onSelectDate ?? setActiveDate;

    const renderDateItem = useCallback(
        ({ item }) => {
            const [date, meta] = item;
            const { contracted = ["", ""], isEvaluation } = meta || {};

            const tasks = mergedHomeworks ? (mergedHomeworks[date] ?? []) : [];
            const allTasksCompleted =
                tasks.length > 0 && tasks.every(({ isDone }) => isDone === "done");

            return (
                <HomeworkDateItem
                    date={date}
                    contracted={contracted}
                    isEvaluation={isEvaluation}
                    isActive={date === activeDate}
                    allTasksCompleted={allTasksCompleted}
                    onPress={() => handleSelect?.(date)}
                />
            );
        },
        [activeDate, mergedHomeworks, handleSelect]
    );

    if (!datesData || Object.keys(datesData).length === 0) return null;

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    paddingHorizontal: 9,
                    alignContent: "flex-end",
                },
                style,
            ]}
        >
            <FlatList
                data={Object.entries(datesData)}
                horizontal
                renderItem={renderDateItem}
                contentContainerStyle={{
                    gap: 12,
                    paddingHorizontal: 6,
                    alignItems: "flex-end",
                }}
                keyExtractor={([date]) => date}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

