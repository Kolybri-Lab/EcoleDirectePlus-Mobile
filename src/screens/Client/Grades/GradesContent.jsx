import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { GradeArrow } from "@/components/svg";
import BottomSheet from "@/components/layout/BottomSheet";

import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropDown, ScrollableStack } from "@/components";
import { API } from "@/constants/api/api";
import { cssHslaToHsla } from "@/utils/colorGenerator";
import { parseNumber } from "@/features/grades/utils/averages";
import Discipline from "@/features/grades/models/Discipline";
import Period from "@/features/grades/models/Period";
import AddGradeModal from "@/features/grades/components/SimulateGradeModal";
import DisciplineItem from "@/features/grades/components/DisciplineItem";
import DisciplineGroupItem from "@/features/grades/components/DisciplineGroupItem";

import { Text } from "@/components/core";
import { useGrade } from "@/features/grades/context/GradeContext";
import { calculateStrengthsWeaknesses, formatGradeText } from "@/features/grades/utils/helpers";
import { useSimulation } from "@/features/grades/hooks/useSimulation";

import { useGrades } from "@/features/grades";
import { useUserStore } from "@/hooks/useUserStore";

const { width } = Dimensions.get("window");

export default function GradesContent() {
    const { state, dispatch } = useGrade();

    const token = useUserStore((state) => state.token);
    const { data: gradesData, isLoading, isError } = useGrades(token);

    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    const [displayPeriodeName, setDisplayPeriodeName] = useState(
        API.DEFAULT_PERIOD_KEY
    ); // DEFAULT A001
    const [generalAverage, setGeneralAverage] = useState(0);
    const [globalStreakScore, setGlobalStreakScore] = useState(0);

    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);

    const [bottomSheetOpened, setBottomSheetOpened] = useState(false);
    const [renderDisciplinesArray, setRenderDisciplineArray] = useState([]);
    const [expandedChain, setExpandedChain] = useState(null);

    const [simulatedDisciplineCodes, setSimulatedDisciplineCodes] = useState({});

    useSimulation({
        dispatch,
        displayPeriodeName,
        setSimulatedDisciplineCodes,
        state,
        setRenderDisciplineArray,
        renderDisciplinesArray,
        displayPeriode,
        setGeneralAverage,
    });

    const fetchAndProcessGrades = useCallback(() => {
        try {
            // setLoading(true);
            setPeriodes(
                Object.entries(gradesData).map(([value, { periodName }]) => ({
                    label: periodName,
                    value,
                }))
            );
            setDisplayPeriode(gradesData[API.DEFAULT_PERIOD_KEY]);
        } catch (err) {
            console.error("Error while loading grades:", err);
        }
        // finally {
        //     setLoading(false);
        // }
    }, [gradesData]);

    useEffect(() => {
        if (!gradesData || Object.keys(gradesData).length === 0) return;
        fetchAndProcessGrades();
    }, [gradesData]);

    useEffect(() => {
        if (!displayPeriode || Object.keys(displayPeriode).length === 0) return;

        try {
            setRenderDisciplineArray(flattenDisciplines(displayPeriode.groups));
            setGeneralAverage(
                new Period({
                    groups: displayPeriode.groups,
                }).makeGeneralAverage()
            );

            setGlobalStreakScore(displayPeriode.globalStreakScore);
        } catch (error) {
            console.error("Error when try to load periods:", error);
        }
    }, [displayPeriode]);

    useEffect(() => {
        if (Object.keys(displayPeriode).length === 0) return;

        try {
            const { strengths, weaknesses } = calculateStrengthsWeaknesses(
                displayPeriode,
                3
            );

            const formattedStrengths = strengths.map((item) => ({
                subject: item.subject.libelle || item.subject.code,
                average: parseNumber(item.subject.averageDatas?.userAverage),
            }));

            const formattedWeaknesses = weaknesses.map((item) => ({
                subject: item.subject.libelle || item.subject.code,
                average: parseNumber(item.subject.averageDatas?.userAverage),
            }));

            setStrengths(formattedStrengths);
            setWeaknesses(formattedWeaknesses);
        } catch (error) {
            console.error("Error when calculate strength/weakness:", error);
            setStrengths([]);
            setWeaknesses([]);
        }
    }, [displayPeriode]);

    const handleItemPress = useCallback((chain) => {
        setExpandedChain((prev) => (prev === chain ? null : chain));
    }, []);

    const renderItem = ({ item, index }) => {
        const discipline = new Discipline(item);

        if (discipline.isDisciplineGroup) {
            return (
                <DisciplineGroupItem
                    discipline={discipline}
                    dataLength={renderDisciplinesArray.length}
                    index={index}
                />
            );
        } else {
            return (
                <DisciplineItem
                    discipline={discipline}
                    index={index}
                    dataLength={renderDisciplinesArray.length}
                    isExpanded={
                        expandedChain ===
                        `${discipline.code}-${discipline.libelle}`
                    }
                    onPress={() =>
                        handleItemPress(
                            `${discipline.code}-${discipline.libelle}`
                        )
                    }
                    dispatch={dispatch}
                />
            );
        }
    };

    const keyExtractor = useCallback(
        (item, index) => item.id?.toString() || `${item.libelle}-${index}`,
        []
    );



    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flex: 0.4,
                    pointerEvents: bottomSheetOpened ? "none" : "auto",
                }}
            >
                <SafeAreaView
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: 3,
                        zIndex: 1,
                    }}
                >
                    {periodes.length > 0 && (
                        <DropDown
                            onSelect={(value) => {
                                const changedPeriod = gradesData[value];
                                setDisplayPeriode(changedPeriod);

                                setDisplayPeriodeName(value);
                            }}
                            options={periodes}
                        />
                    )}
                </SafeAreaView>
                <ScrollableStack
                    horizontal
                    paging
                    contentContainerStyle={{ alignItems: "center" }}
                    gap={0}
                >
                    <HeaderStatsCarousel
                        item={{
                            key: "streak",
                            text: "Ta streak",
                            value: globalStreakScore,
                            gradient: {
                                colors: ["rgb(255, 15, 0)", "rgba(255, 150, 0, .7)"],
                                locations: [0.24, 0.68],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            },
                        }}
                    />
                    <HeaderStatsCarousel
                        item={{
                            key: "average",
                            text: "Moyenne Générale",
                            value: formatGradeText(generalAverage),
                            gradient: {
                                colors: ["rgb(68, 55, 149)", "rgb(119, 29, 124)"],
                                locations: [0.21, 0.66],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            },
                        }}
                    />
                </ScrollableStack>
            </View>
            <View
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            >
                <BottomSheet
                    style={{
                        backgroundColor: "hsl(240, 35%, 11%)",
                        borderTopLeftRadius: 42,
                        borderTopRightRadius: 42,
                        zIndex: 1000,
                    }}
                    displayLine
                    opened={(state) => setBottomSheetOpened(state)}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 14,
                            backgroundColor: "hsl(240, 28%, 26%)",
                            borderRadius: 18,
                            padding: 16,
                            marginTop: 24,
                        }}
                    >
                        <ScrollableStack
                            horizontal
                            paging
                            contentContainerStyle={{
                                width: "200%",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    gap: 8,
                                    width: "100%",
                                }}
                            >
                                <StrengthsAndWeakness
                                    firstColor={"hsla(115, 79%, 41%, 0.8)"}
                                    data={strengths}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    gap: 8,
                                    width: "100%",
                                }}
                            >
                                <StrengthsAndWeakness
                                    firstColor={"hsla(5, 79%, 41%, 0.8)"}
                                    data={weaknesses}
                                />
                            </View>
                        </ScrollableStack>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            margin: 14,
                        }}
                    >
                        <FlatList
                            data={renderDisciplinesArray}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            contentContainerStyle={{ gap: 3 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </BottomSheet>
            </View>
            <AddGradeModal
                visible={state.simulation.modalOpen}
                disciplineCodes={simulatedDisciplineCodes}
            />
        </View>
    );
}

const HeaderStatsCarousel = ({ item }) => (
    <View style={{ width, height: "100%", flex: 1 }}>
        <LinearGradient
            colors={item.gradient.colors}
            start={item.gradient.start}
            end={item.gradient.end}
            locations={item.gradient.locations}
            style={{ width, height: "100%", flex: 1 }}
        >
            <View
                style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            >
                <Text size={38} weight="bold" align="center">
                    {item.text}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    {Array.from({ length: 3 }).map((_, i) => (
                        <GradeArrow key={`left-${i}`} />
                    ))}
                    <Text size={64} weight="bold">
                        {item.value}
                    </Text>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <GradeArrow key={`right-${i}`} miroired />
                    ))}
                </View>
            </View>
        </LinearGradient>
    </View>
);

const StrengthsAndWeakness = ({ data, firstColor }) => {
    const [tint, saturation, lightness, opacity] = cssHslaToHsla(firstColor);
    const colors = [
        firstColor,
        `hsla(${tint + 3}, ${saturation - 4}%, ${lightness - 6}%, ${opacity})`,
        `hsla(${tint + 7}, ${saturation - 3}%, ${lightness - 14}%, ${opacity})`,
    ];

    return (
        <>
            {data.map(({ subject, average }, i) => (
                <View
                    style={{
                        backgroundColor: colors[i],
                        borderRadius: 50,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: 8,
                        alignItems: "center",
                    }}
                    key={i}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 6,
                            marginRight: 8,
                        }}
                    >
                        <Text preset="label1">{i + 1} · </Text>
                        <Text oneLine preset="label2" style={{ flexShrink: 1 }}>
                            {subject}
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingHorizontal: 9,
                            paddingVertical: 4,
                            backgroundColor: "hsla(240, 26%, 13%, 0.35)",
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: "18%",
                        }}
                    >
                        <Text preset="label1">{formatGradeText(average)}</Text>
                    </View>
                </View>
            ))}
        </>
    );
};

function flattenDisciplines(groups) {
    const result = [];

    groups.forEach((group) => {
        result.push(group);

        if (Array.isArray(group.disciplines)) {
            group.disciplines.forEach((discipline) => {
                result.push(discipline);
            });
        }
    });

    return result;
}
