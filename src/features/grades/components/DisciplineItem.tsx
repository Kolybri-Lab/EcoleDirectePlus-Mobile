import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { Text as CoreText } from "@/components/core";
const Text = CoreText as any;
import { addOpacityToCssRgb } from "@/utils/colorGenerator";
import { formatGradeText } from "@/features/grades/utils/helpers";
import Discipline from "../models/Discipline";
import Grade from "../models/Grade";
import GradeItem from "./GradeItem";
import SimulatedGradeItem from "./SimulatedGradeItem";

interface DisciplineItemProps {
    discipline: Discipline;
    index?: number;
    dataLength?: number;
    isFirst?: boolean;
    isLast?: boolean;
    isExpanded: boolean;
    onPress: () => void;
    dispatch: (action: any) => void;
}

export default function DisciplineItem({
    discipline,
    index = 0,
    dataLength = 1,
    isFirst = index === 0,
    isLast = index === dataLength - 1,
    isExpanded,
    onPress,
    dispatch,
}: DisciplineItemProps) {
    const { colors } = useTheme() as any;
    const [shouldRenderContent, setShouldRenderContent] = useState(isExpanded);
    const expandProgress = useSharedValue(isExpanded ? 1 : 0);

    useEffect(() => {
        if (isExpanded) {
            setShouldRenderContent(true);
        }
        expandProgress.value = withTiming(
            isExpanded ? 1 : 0,
            { duration: 300 },
            (finished) => {
                if (finished && !isExpanded) {
                    runOnJS(setShouldRenderContent)(false);
                }
            }
        );
    }, [isExpanded]);

    const topRadiusClosed = isFirst ? 16 : 8;
    const bottomRadiusClosed = isLast ? 16 : 8;

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        borderTopLeftRadius: interpolate(
            expandProgress.value,
            [0, 0.5, 1],
            [topRadiusClosed, 11, 16],
            Extrapolation.CLAMP
        ),
        borderTopRightRadius: interpolate(
            expandProgress.value,
            [0, 0.5, 1],
            [topRadiusClosed, 11, 16],
            Extrapolation.CLAMP
        ),
        borderBottomLeftRadius: interpolate(
            expandProgress.value,
            [0, 0.5, 1],
            [bottomRadiusClosed, 11, 16],
            Extrapolation.CLAMP
        ),
        borderBottomRightRadius: interpolate(
            expandProgress.value,
            [0, 0.5, 1],
            [bottomRadiusClosed, 11, 16],
            Extrapolation.CLAMP
        ),
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        maxHeight: interpolate(
            expandProgress.value,
            [0, 1],
            [0, 800],
            Extrapolation.CLAMP
        ),
        opacity: interpolate(
            expandProgress.value,
            [0, 0.3, 1],
            [0, 0, 1],
            Extrapolation.CLAMP
        ),
        paddingBottom: interpolate(
            expandProgress.value,
            [0, 1],
            [0, 18],
            Extrapolation.CLAMP
        ),
        overflow: "hidden",
    }));

    const averages = [
        { label: "Classe", value: discipline.averageDatas?.classAverage },
        { label: "Max.", value: discipline.averageDatas?.maxAverage },
        { label: "Min", value: discipline.averageDatas?.minAverage },
    ];

    const mainColor = colors?.secondary ?? "hsla(240, 11%, 20%, 1.00)";
    const secondaryColor = colors?.secondary ?? "hsl(240, 27%, 16%)";
    const txt1Color = colors?.txt1 ?? colors?.txt?.txt1 ?? "#FFFFFF";

    const boxStyle = {
        backgroundColor: addOpacityToCssRgb(mainColor, 0.3),
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    };

    const teachersText = Array.isArray(discipline.teachers)
        ? discipline.teachers.length > 1
            ? `${discipline.teachers[0]}...`
            : discipline.teachers[0] || ""
        : discipline.teachers || "";

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <Animated.View
                style={[
                    {
                        backgroundColor: secondaryColor,
                        overflow: "hidden",
                        borderWidth: isExpanded ? 1 : 0,
                        borderColor: addOpacityToCssRgb(mainColor, 0.4),
                    },
                    containerAnimatedStyle,
                ]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        height: 80,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 15,
                            flex: 1,
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 500,
                                width: 42,
                                height: 42,
                                borderWidth: 2,
                                borderColor: "white",
                                backgroundColor: secondaryColor,
                            }}
                        >
                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    overflow: "hidden",
                                    backgroundColor:
                                        discipline.streakCount === 0
                                            ? "transparent"
                                            : "hsl(35, 100%, 50%)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text align="center" preset="h3">
                                    {discipline.streakCount}
                                </Text>
                            </View>
                        </View>
                        <View style={{ maxWidth: "68%", flexShrink: 1 }}>
                            <Text
                                oneLine
                                style={{
                                    fontFamily: "Lexend-SemiBold",
                                    fontSize: 17,
                                }}
                            >
                                {discipline.libelle}
                            </Text>
                            {teachersText.length > 0 && (
                                <Text
                                    style={{ opacity: 0.72 }}
                                    oneLine
                                    preset="label2"
                                >
                                    {teachersText}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Text preset="h3">
                        {formatGradeText(discipline.averageDatas?.userAverage)}
                    </Text>
                </View>

                <Animated.View style={[{ gap: 8 }, contentAnimatedStyle]}>
                    <View
                        style={{
                            backgroundColor: addOpacityToCssRgb(txt1Color, 0.4),
                            height: 2,
                            borderRadius: 5,
                            marginHorizontal: 20,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        {averages.map(({ label, value }, idx) => (
                            <View
                                key={idx}
                                style={{
                                    alignItems: "center",
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={{ marginBottom: 8 }}>{label}</Text>
                                <View style={boxStyle}>
                                    <Text preset="label2">
                                        {formatGradeText(value)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {shouldRenderContent &&
                        discipline.grades
                            ?.filter((grade) => !grade.isSimulation)
                            .map((gradeData, idx) => {
                                const gradeObj = new Grade(gradeData);
                                return (
                                    <GradeItem
                                        key={`grade-${idx}`}
                                        grade={gradeObj}
                                        dispatch={dispatch}
                                    />
                                );
                            })}

                    {shouldRenderContent && (
                        <TouchableOpacity
                            onPress={() =>
                                dispatch({
                                    type: "OPEN_SIMULATION_MODAL",
                                    payload: {
                                        discipline: discipline.code,
                                        libelle: discipline.libelle,
                                    },
                                })
                            }
                            style={{ alignSelf: "center", marginVertical: 4 }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: addOpacityToCssRgb(
                                        mainColor,
                                        0.8
                                    ),
                                    width: 55,
                                    height: 30,
                                    borderRadius: 20,
                                }}
                            >
                                <Text preset="h3" align="center" marginTop={-3}>
                                    +
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {shouldRenderContent &&
                        discipline.grades
                            ?.filter((grade) => grade.isSimulation)
                            .map((gradeData, idx) => {
                                const gradeObj = new Grade(gradeData);
                                return (
                                    <SimulatedGradeItem
                                        key={`simulated-grade-${idx}`}
                                        grade={gradeObj}
                                        dispatch={dispatch}
                                    />
                                );
                            })}
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
}

