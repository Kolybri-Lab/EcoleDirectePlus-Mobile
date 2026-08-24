import { memo, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Text } from "@/components/core";
import { adjustLightness } from "@/utils/colorGenerator";

export const HomeworkDateItem = memo(
    ({ contracted, isEvaluation, isActive, allTasksCompleted, onPress }) => {
        let dateBackgroundColor;
        if (isEvaluation && allTasksCompleted) {
            dateBackgroundColor = "hsl(28, 48%, 33%)"; //temp color
        } else if (isEvaluation) {
            dateBackgroundColor = "hsl(2, 63%, 43%)"; // temp color
        } else if (allTasksCompleted) {
            dateBackgroundColor = "hsl(115, 33%, 38%)"; // maybe good ?
        } else {
            dateBackgroundColor = "hsl(240, 19%, 36%)"; // keep this
        }
        return (
            <TouchableOpacity
                style={{
                    width: 58,
                    height: 58,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                }}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: dateBackgroundColor,
                        borderRadius: 10,
                        ...(isActive && {
                            boxShadow: [
                                {
                                    offsetX: 0,
                                    offsetY: 0,
                                    blurRadius: 6,
                                    spreadDistance: 3,
                                    color: adjustLightness(dateBackgroundColor, 30),
                                },
                            ],
                        }),
                    }}
                >
                    <Text preset="label1">{contracted[1]}</Text>
                    <Text preset="label2">{contracted[0]}</Text>
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
                meta?.allTasksCompleted ??
                (tasks.length > 0 && tasks.every(({ isDone }) => isDone === "done"));

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
        <View style={[{ flexDirection: "row", paddingHorizontal: 9 }, style]}>
            <FlatList
                data={Object.entries(datesData)}
                horizontal
                renderItem={renderDateItem}
                contentContainerStyle={{
                    gap: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 6,
                }}
                keyExtractor={([date]) => date}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}
