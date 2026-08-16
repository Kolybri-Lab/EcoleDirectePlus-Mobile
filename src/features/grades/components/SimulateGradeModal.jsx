import { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/core";
import { getTodayDateString } from "@/utils/date";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useGrade } from "../context/GradeContext";
import Grade from "../models/Grade";
import { parseNumber } from "../utils/averages";

const PLACEHOLDERS = { coef: 1, grade: 15, outOf: 20 };

export default function AddGradeModal({ visible, disciplineCodes }) {
    const { state, dispatch } = useGrade();

    const [simulatedGrade, setSimulatedGrade] = useState(PLACEHOLDERS);
    const [simulationCount, setSimulationCount] = useState(1);
    const [isRendered, setIsRendered] = useState(false);

    const translateY = useSharedValue(500);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            setIsRendered(true);
            translateY.value = withTiming(0, {
                duration: 450,
            });
            opacity.value = withTiming(1, { duration: 250 });
        } else {
            translateY.value = withTiming(
                500,
                {
                    duration: 350,
                },
                () => {
                    scheduleOnRN(setIsRendered, false);
                }
            );
            opacity.value = withTiming(0, { duration: 250 });
        }
    }, [visible]);

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const handleClose = () => {
        dispatch({ type: "CLOSE_SIMULATION_MODAL" });
    };

    if (!isRendered) return null;

    return (
        <View
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1000,
            }}
        >
            <Animated.View
                style={[
                    {
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.7)",
                    },
                    backdropStyle,
                ]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    style={{ flex: 1 }}
                />
            </Animated.View>

            <Animated.View
                style={[
                    {
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "hsl(240, 35%, 11%)",
                        borderTopLeftRadius: 42,
                        borderTopRightRadius: 42,
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 40,
                        minHeight: 400,
                        maxHeight: "85%",
                    },
                    modalStyle,
                ]}
            >
                <View
                    style={{
                        width: 50,
                        height: 5,
                        backgroundColor: "hsla(240, 20%, 60%, 0.4)",
                        borderRadius: 3,
                        alignSelf: "center",
                        marginBottom: 24,
                    }}
                />

                <View style={{ marginBottom: 24 }}>
                    <Text preset="h2">Ajouter une note</Text>
                    <Text
                        style={{
                            marginTop: 4,
                        }}
                        preset="body2"
                    >
                        Simulez une note pour voir son impact
                    </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8 }} preset="label1">
                            Note
                        </Text>
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                    borderRadius: 13,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderWidth: 1,
                                    borderColor: "hsla(240, 20%, 40%, 0.3)",
                                }}
                            >
                                <TextInput
                                    placeholder={String(PLACEHOLDERS.grade)}
                                    placeholderTextColor={"hsla(0, 100%, 100%, .25)"} // EDIT
                                    onChangeText={(text) =>
                                        setSimulatedGrade((prev) => ({
                                            ...prev,
                                            grade: parseNumber(text),
                                        }))
                                    }
                                    keyboardType="numeric"
                                    style={{ fontSize: 16 }}
                                />
                            </View>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    opacity: 0.5,
                                }}
                                preset="h4"
                            >
                                /
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                    borderRadius: 13,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderWidth: 1,
                                    borderColor: "hsla(240, 20%, 40%, 0.3)",
                                }}
                            >
                                <TextInput
                                    placeholder={String(PLACEHOLDERS.outOf)}
                                    placeholderTextColor={"hsla(0, 100%, 100%, .25)"} // EDIT
                                    onChangeText={(text) =>
                                        setSimulatedGrade((prev) => ({
                                            ...prev,
                                            outOf: parseNumber(text),
                                        }))
                                    }
                                    keyboardType="numeric"
                                    style={{ fontSize: 16 }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8 }} preset="label1">
                            Coefficient
                        </Text>
                        <View
                            style={{
                                backgroundColor: "hsla(240, 30%, 20%, 0.8)",
                                borderRadius: 13,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderWidth: 1,
                                borderColor: "hsla(240, 20%, 40%, 0.3)",
                            }}
                        >
                            <TextInput
                                placeholder={String(PLACEHOLDERS.coef)}
                                placeholderTextColor={"hsla(0, 100%, 100%, .25)"} // EDIT
                                onChangeText={(text) =>
                                    setSimulatedGrade((prev) => ({
                                        ...prev,
                                        coef: parseNumber(text),
                                    }))
                                }
                                keyboardType="numeric"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>
                </ScrollView>

                {simulatedGrade.grade > simulatedGrade.outOf && (
                    <View
                        style={{
                            backgroundColor: "hsla(0, 70%, 50%, 0.2)",
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: "hsla(0, 70%, 50%, 0.5)",
                            flex: 1,
                        }}
                    >
                        <Text preset="body2" color="hsla(0, 70%, 70%, 1)">
                            ⚠️ La note ne peut pas être supérieure au barème
                        </Text>
                    </View>
                )}

                <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={{
                            flex: 1,
                            backgroundColor: "hsla(240, 30%, 25%, 0.8)",
                            paddingVertical: 16,
                            borderRadius: 13,
                            alignItems: "center",
                        }}
                    >
                        <Text preset="label1">Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: "hsl(240, 50%, 55%)",
                            paddingVertical: 16,
                            borderRadius: 13,
                            alignItems: "center",
                        }}
                        onPress={() => {
                            setSimulationCount((prev) => prev + 1);
                            const generateGradeSimulation = new Grade({
                                data: simulatedGrade,
                                codes: {
                                    discipline: disciplineCodes.discipline,
                                    period: disciplineCodes.period,
                                },
                                date: getTodayDateString(),
                                disciplineName: disciplineCodes.libelle,
                                libelle: `Simulation #${simulationCount}`,
                                notSignificant: false,
                                onlySkills: false,
                                isSimulation: true,
                            });

                            dispatch({
                                type: "CREATE_SIMULATED_GRADE",
                                payload: generateGradeSimulation.getGrade(),
                            });
                            setSimulatedGrade(PLACEHOLDERS);
                            handleClose();
                        }}
                    >
                        <Text preset="label1">Simuler</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}
