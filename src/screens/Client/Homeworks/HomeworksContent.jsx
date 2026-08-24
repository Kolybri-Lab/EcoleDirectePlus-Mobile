import { useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Text } from "@/components/core";
import { Plus } from "@/components/svg";
import { motivationSentences } from "@/constants/features/homeworksConfig";
import HomeworkCard from "@/features/homeworks/components/HomeworkCard";
import HomeworkDatesRow from "@/features/homeworks/components/HomeworkDatesRow";
import HomeworkProgress from "@/features/homeworks/components/HomeworkProgress";

import NewHomeworkModal from "@/features/homeworks/components/NewHomeworkModal";
import { useHomework } from "@/features/homeworks/context/HomeworkContext";
import { useHomeworksHandler } from "@/features/homeworks/hooks/useHomeworksHandler";
import { formatFrenchDate } from "@/utils/date";

import { ScreenStack } from "@/components";
import { useHomeworks } from "@/features/homeworks";
import { useCustomDataStore } from "@/hooks/useCustomDataStore";
import { useUserStore } from "@/hooks/useUserStore";
import { objectsEqual } from "@/utils/json";

export default function HomeworksContent() {
    const token = useUserStore((state) => state.token);
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

    const renderHomework = useCallback(
        ({ item }) => <HomeworkCard dispatch={dispatch} homework={item} />,
        [dispatch]
    );

    return (
        <>
            <NewHomeworkModal visible={modalOpen} />
            <ScreenStack>
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

                <HomeworkProgress
                    completedCount={completedTasks.length}
                    totalCount={displayTasks.length}
                    progression={progression}
                    encouragementSentence={encouragementSentence}
                />

                <View style={{ flex: 1 }}>
                    <HomeworkDatesRow
                        homeworksDates={homeworksDates}
                        activeDate={activeDate}
                        setActiveDate={setActiveDate}
                        mergedHomeworks={mergedHomeworks}
                    />
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "hsl(240, 29%, 11%)",
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            paddingTop: 24,
                            paddingHorizontal: 24,
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
                            }}
                        />
                    </View>
                </View>
            </ScreenStack>
        </>
    );
}

