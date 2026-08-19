import { useNavigation, useTheme } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import canardman from "assets/lottie/canardman_walking.json";

import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DropDownMenu } from "@/components";
import { API } from "@/constants/api/api";
import Discipline from "@/features/grades/models/Discipline";
import Period from "@/features/grades/models/Period";
import AddGradeModal from "@/features/grades/components/SimulateGradeModal";
import DisciplineGroupItem from "@/features/grades/components/DisciplineGroupItem";
import GradeFlame from "@/features/grades/components/GradeFlame";
import { useGrade } from "@/features/grades/context/GradeContext";
import { useSimulation } from "@/features/grades/hooks/useSimulation";
import { useGrades } from "@/features/grades";
import { useUserStore } from "@/hooks/useUserStore";

export default function GradesContent() {
    const { colors, shadow } = useTheme();

    const token = useUserStore((state) => state.token);
    const { data: gradesData, isLoading, isError } = useGrades(token);
    const { state, dispatch } = useGrade();
    const [periodes, setPeriodes] = useState([]);
    const [displayPeriode, setDisplayPeriode] = useState({});
    const [displayPeriodeName, setDisplayPeriodeName] = useState(
        API.DEFAULT_PERIOD_KEY
    );
    const [generalAverage, setGeneralAverage] = useState(0);
    const [globalStreakScore, setGlobalStreakScore] = useState(0);

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
            const validPeriodEntries = Object.entries(gradesData).filter(
                ([key, val]) =>
                    key !== "lastGrades" &&
                    key !== "activePeriod" &&
                    val &&
                    typeof val === "object" &&
                    val.groups
            );

            const formattedPeriodes = validPeriodEntries.map(
                ([value, { periodName }]) => ({
                    label: periodName,
                    value,
                })
            );

            setPeriodes(formattedPeriodes);

            const initialPeriodKey =
                gradesData.activePeriod?.periodCode ||
                (gradesData[API.DEFAULT_PERIOD_KEY]
                    ? API.DEFAULT_PERIOD_KEY
                    : validPeriodEntries[0]?.[0]);

            if (initialPeriodKey && gradesData[initialPeriodKey]) {
                setDisplayPeriode(gradesData[initialPeriodKey]);
                setDisplayPeriodeName(initialPeriodKey);
            }
        } catch (err) {
            console.error("Error while loading grades:", err);
        }
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
                new Period(
                    displayPeriode,
                    displayPeriodeName
                ).makeGeneralAverage()
            );

            setGlobalStreakScore(displayPeriode.globalStreakScore);
        } catch (error) {
            console.error("Error when try to load periods:", error);
        }
    }, [displayPeriode]);

    const handleItemPress = useCallback((chain) => {
        setExpandedChain((prev) => (prev === chain ? null : chain));
    }, []);

    const styles = createStyles(colors, shadow);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >
                {periodes.length > 0 && (
                    <View
                        style={{
                            marginTop: 50,
                            zIndex: 10,
                            paddingHorizontal: 14,
                        }}
                    >
                        <DropDownMenu
                            value={
                                periodes.find(
                                    (p) =>
                                        p.value === displayPeriodeName ||
                                        p.id === displayPeriodeName
                                ) || periodes[0]
                            }
                            onSelect={(item) => {
                                const value = item?.value ?? item?.id ?? item;
                                const changedPeriod = gradesData[value];
                                setDisplayPeriode(changedPeriod);
                                setDisplayPeriodeName(value);
                            }}
                            options={periodes}
                        />
                    </View>
                )}
                <View style={styles.flammesContainer}>
                    <GradeFlame
                        color="orange"
                        value={globalStreakScore}
                        label="Streak"
                        width="30%"
                    />
                    <GradeFlame
                        color="violet"
                        value={generalAverage}
                        label="Moyenne"
                        width="30%"
                    />
                </View>

                <View
                    style={{
                        gap: 16,
                        paddingHorizontal: 14,
                        marginTop: 10,
                    }}
                >
                    {displayPeriode.groups?.map((group, gIndex) => (
                        <DisciplineGroupItem
                            key={`group-${group.libelle || group.name || gIndex}-${gIndex}`}
                            group={group}
                            groupIndex={gIndex}
                            expandedChain={expandedChain}
                            onItemPress={handleItemPress}
                            dispatch={dispatch}
                        />
                    ))}
                </View>
            </ScrollView>

            <AddGradeModal
                visible={state.simulation.modalOpen}
                disciplineCodes={simulatedDisciplineCodes}
            />
            <LottieView
                source={canardman}
                autoPlay
                loop
                style={styles.canardman}
                colorFilters={[
                    {
                        keyPath: "eVpvGSAbUci5_to.**",
                        color: colors?.canardman ?? "#FFD700",
                    },
                ]}
            />
        </View>
    );
}

function flattenDisciplines(groups) {
    const result = [];

    groups?.forEach((group) => {
        result.push(group);

        if (Array.isArray(group.disciplines)) {
            group.disciplines.forEach((discipline) => {
                result.push(discipline);
            });
        }
    });

    return result;
}

const createStyles = (colors, shadow) =>
    StyleSheet.create({
        flammesContainer: {
            zIndex: -1,
            marginTop: 20,
            left: "5%",
            flexDirection: "row",
            alignItems: "flex-start",
        },
        canardman: {
            position: "absolute",
            top: 12,
            right: -148,
            width: 336,
            height: 336,
            transform: [{ rotate: "5deg" }, { scaleX: -1 }],
            zIndex: -1,
        },
    });

