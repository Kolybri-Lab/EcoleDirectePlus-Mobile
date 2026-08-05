import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Text } from "@/components/core";
import { Plus } from "@/components/svg";
import { motivationSentences } from "@/constants/features/homeworksConfig";
import HomeworkCard from "@/features/homeworks/components/HomeworkCard";
import { SafeAreaView } from "react-native-safe-area-context";

import NewHomeworkModal from "@/features/homeworks/components/NewHomeworkModal";
import { useHomework } from "@/features/homeworks/context/HomeworkContext";
import { useHomeworksHandler } from "@/features/homeworks/hooks/useHomeworksHandler";
import { adjustLightness } from "@/utils/colorGenerator";
import { formatFrenchDate } from "@/utils/date";

import { ProgressBar } from "@/components/progression/ProgressBar";
import { useHomeworks } from "@/features/homeworks";
import { useCustomDataStore } from "@/hooks/useCustomDataStore";
import { useTabPadding } from "@/hooks/useTabPadding";
import { useUserStore } from "@/hooks/useUserStore";
import { objectsEqual } from "@/utils/json";

export default function HomeworksContent() {
    const token = useUserStore((state) => state.token);
    const tabPadding = useTabPadding();
    const {
        data: homeworksData,
        isLoading,
        isError,
        toggleHomework,
        error,
        isDataEmpty,
    } = useHomeworks(token);
    const customHomeworksData = useCustomDataStore((state) => state.customHomeworks);
    const { dispatch } = useHomework();

    const mergedHomeworks = useMemo(() => {
        if (!homeworksData) return null;
        const merged = JSON.parse(JSON.stringify(homeworksData));
        customHomeworksData.forEach((hw) => {
            if (!merged[hw.date]) {
                merged[hw.date] = [];
                if (!merged.formatedDates) merged.formatedDates = {};
                const frenchDate = formatFrenchDate(hw.date);
                const contractedDate = [
                    frenchDate.charAt(0).toLowerCase() + frenchDate.slice(1, 3),
                    frenchDate.split(" ")[1],
                ];
                merged.formatedDates[hw.date] = {
                    long: frenchDate,
                    contracted: contractedDate,
                    isEvaluation: hw.isEvaluation,
                    allTasksCompleted: false,
                };
            }
            const alreadyExists = merged[hw.date].some((h) => h.id === hw.id);
            if (!alreadyExists) {
                merged[hw.date].push(hw);
            }
        });
        return merged;
    }, [homeworksData, customHomeworksData]);

    const [homeworksDates, setHomeworksDates] = useState();
    const [formatedDates, setFormatedDates] = useState();
    const [activeDate, setActiveDate] = useState("");
    const [progression, setProgression] = useState(0);
    const [displayTasks, setDisplayTasks] = useState([]);
    const [encouragementSentence, setEncouragemementSentence] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);

    useHomeworksHandler({
        setModalOpen,
        toggleHomework,
    });

    const pickSentence = useCallback(
        (progression) => {
            let key;

            if (progression === 0) {
                setEncouragemementSentence("");
                return;
            } else if (progression < 0.25) key = "0.25";
            else if (progression < 0.5) key = "0.5";
            else if (progression < 1) key = "0.75";
            else key = "1";

            const sentences = motivationSentences[key];
            setEncouragemementSentence(
                sentences[Math.floor(Math.random() * sentences.length)]
            );
        },
        [progression]
    );
    useEffect(() => {
        if (!mergedHomeworks || Object.keys(mergedHomeworks).length === 0) return;

        setHomeworksDates(mergedHomeworks.formatedDates);
        setFormatedDates(mergedHomeworks.formatedDates);

        if (!activeDate || !mergedHomeworks.formatedDates[activeDate]) {
            setActiveDate(Object.keys(mergedHomeworks.formatedDates)[0]);
        }
    }, [mergedHomeworks]);

    useEffect(() => {
        if (!activeDate || !mergedHomeworks) return;

        const datas = mergedHomeworks[activeDate] || [];
        setDisplayTasks(datas);
        const completed = datas.filter(({ isDone }) => isDone === "done");
        setCompletedTasks(completed);
        const progression =
            datas.length > 0
                ? Math.round((completed.length / datas.length) * 100) / 100
                : 0;
        setProgression(progression);
        pickSentence(progression);
    }, [activeDate, mergedHomeworks]);

    useEffect(() => {
        if (!homeworksDates || !activeDate || !homeworksDates[activeDate]) return;
        setHomeworksDates((prev) => {
            if (!prev[activeDate]) return prev;
            prev[activeDate].allTasksCompleted = progression === 1;
            return { ...prev };
        });
    }, [progression, activeDate]);

    const renderDateItem = useCallback(
        ({ item }) => {
            const [date, { contracted, isEvaluation }] = item;

            const tasks = mergedHomeworks[date] ?? [];
            const allTasksCompleted =
                tasks.length > 0 && tasks.every(({ isDone }) => isDone === "done");

            return (
                <DateItem
                    date={date}
                    contracted={contracted}
                    isEvaluation={isEvaluation}
                    isActive={date === activeDate}
                    allTasksCompleted={allTasksCompleted}
                    onPress={() => setActiveDate(date)}
                />
            );
        },
        [activeDate, mergedHomeworks]
    );
    const renderHomework = useCallback(
        ({ item }) => <HomeworkCard dispatch={dispatch} homework={item} />,
        [dispatch]
    );


    return (
        <>
            <NewHomeworkModal visible={modalOpen} />
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        position: "absolute",
                        top: "5%",
                        right: "5%",
                        gap: 2,
                        zIndex: 1,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 6,
                            backgroundColor: "hsl(240, 56%, 60%)",
                            borderRadius: 12,
                        }}
                        onPress={() => dispatch({ type: "OPEN_NEW_HOMEWORK_MODAL" })}
                    >
                        <Plus size={36} />
                    </TouchableOpacity>
                </View>

                <SafeAreaView
                    style={{
                        height: "25%",
                        justifyContent: "space-between",
                        paddingTop: 14,
                    }}
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
                            {completedTasks.length}/{displayTasks.length}
                        </Text>
                    </View>
                    <ProgressBar
                        progression={progression}
                        style={{
                            marginHorizontal: 50,
                            backgroundColor: "hsl(240, 15%, 33%)",
                        }}
                    />

                    <Text preset="custom1" align="center" color="hsl(240, 34%, 77%)">
                        {encouragementSentence}
                    </Text>
                </SafeAreaView>
                <View style={{ flex: 1 }}>
                    {homeworksDates && (
                        <View style={{ flexDirection: "row", paddingHorizontal: 9 }}>
                            <FlatList
                                data={Object.entries(homeworksDates)}
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
                    )}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "hsl(240, 29%, 11%)",
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            padding: 24,
                        }}
                    >
                        {objectsEqual({}, homeworksData) && (
                            <Text>
                                Chouette, vous n'avez pas de devoirs donnés par votre
                                établissement !
                                <Text preset="label3" color="grey">
                                    (annonce immonde a revoir et penser a faire un
                                    compteur de devoir etab et devoirs custom)
                                </Text>
                            </Text>
                        )}
                        <View
                            style={{
                                flexDirection: "row",
                                alignSelf: "center",
                                marginBottom: 24,
                            }}
                        >
                            <Text preset="custom2">
                                {activeDate &&
                                    formatedDates &&
                                    formatedDates[activeDate].long}
                            </Text>
                        </View>
                        <FlatList
                            data={displayTasks}
                            renderItem={renderHomework}
                            keyExtractor={({ id }) => id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                gap: 10,
                                paddingBottom: tabPadding,
                            }}
                        />
                    </View>
                </View>
            </View>
        </>
    );
}

const DateItem = memo(
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

