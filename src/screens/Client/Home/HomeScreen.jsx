import { Text } from "@/components";
import { useGrades } from "@/features/grades";
import ActiveCourseCard from "@/features/home/components/ActiveCourseCard";
import GeneralAveragePreview from "@/features/home/components/GeneralAveragePreview";
import HomeworksPreview from "@/features/home/components/HomeworksPreview";
import LastGrades from "@/features/home/components/LastGrades";
import getGreetingMessage from "@/features/home/utils/getGreetingMessage";
import { useHomeworks } from "@/features/homeworks";
import { useTimetable } from "@/features/timetable";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useCustomDataStore } from "@/hooks/useCustomDataStore";
import { useSignIn } from "@/hooks/useSignIn";
import { useUserStore } from "@/hooks/useUserStore";
import { getTodayDateString } from "@/utils/date";
import { objectsEqual } from "@/utils/json";
import {
    convertTimeHoursMinToMinutes,
    getTimeInterval,
    isInInterval,
} from "@/utils/time";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
    const { signOut } = useSignIn();
    const navigation = useNavigation();

    const token = useUserStore((state) => state.token);
    const profile = useUserStore((state) => state.profile);
    const name = profile?.name ?? "";
    const { data: timetableData } = useTimetable(token);
    const { data: gradesData } = useGrades(token);

    const { data: homeworksData } = useHomeworks(token);
    const customDataStore = useCustomDataStore();
    const currentTime = useCurrentTime();
    const [greetingMessage] = useState(getGreetingMessage);

    const activeDate = useMemo(() => {
        if (!Array.isArray(timetableData)) return null;
        return (
            timetableData.find(({ date }) => date === getTodayDateString()) ?? null
        );
    }, [timetableData]);

    const activeCourse = useMemo(() => {
        if (!activeDate) return {};
        return (
            activeDate.courses.find(({ startCourse, endCourse }) =>
                isInInterval(currentTime.time, startCourse.time, endCourse.time)
            ) ?? {}
        );
    }, [activeDate, currentTime.time]);

    const progression = useMemo(() => {
        if (objectsEqual(activeCourse, {})) return 0;
        const [activeMinutes, startMinutes, endMinutes] =
            convertTimeHoursMinToMinutes(
                currentTime.time,
                activeCourse.startCourse.time,
                activeCourse.endCourse.time
            );
        return parseFloat(
            ((activeMinutes - startMinutes) / (endMinutes - startMinutes)).toFixed(4)
        );
    }, [activeCourse, currentTime.time]);

    const { nextCourse, nextDate, isLastCourseOfTheDay } = useMemo(() => {
        if (!activeDate)
            return { nextCourse: {}, nextDate: null, isLastCourseOfTheDay: null };

        const activeCourseIndex = !objectsEqual(activeCourse, {})
            ? activeDate.courses.indexOf(activeCourse)
            : -1;
        const isLastCourseOfTheDay =
            activeCourseIndex === -1 ||
            activeCourseIndex === activeDate.courses.length - 1;

        if (isLastCourseOfTheDay) {
            const activeDateIndex = timetableData.indexOf(activeDate);
            const hasNoNextDate =
                activeDateIndex === -1 ||
                activeDateIndex === timetableData.length - 1;

            if (hasNoNextDate) {
                return {
                    nextCourse: {},
                    nextDate: null,
                    isLastCourseOfTheDay,
                };
            }
            const followingDate = timetableData[activeDateIndex + 1];
            return {
                nextCourse: {
                    course: followingDate.courses[0] ?? {},
                    timeRemaining: getTimeInterval(
                        `${currentTime.date}T${currentTime.time}`,
                        `${followingDate.courses[0].startCourse.date}T${followingDate.courses[0].startCourse.time}`
                    ),
                },
                nextDate: followingDate,
                isLastCourseOfTheDay,
            };
        }
        const nextCourse = activeDate.courses[activeCourseIndex + 1];

        return {
            nextCourse: {
                course: nextCourse,
                timeRemaining: getTimeInterval(
                    `${currentTime.date}T${currentTime.time}`,
                    `${nextCourse.startCourse.date}T${nextCourse.startCourse.time}`
                ),
            },
            nextDate: activeDate,
            isLastCourseOfTheDay,
        };
    }, [activeDate, activeCourse, timetableData, currentTime]);

    const activeStatus = useMemo(() => {
        return {
            inClass: !objectsEqual(activeCourse, {}),
            nextCourseKnown: !objectsEqual(nextCourse, {}),
        };
    }, [activeCourse, nextCourse]);
    return (
        <LinearGradient
            colors={["hsla(228, 70%, 18%, 1)", "hsla(228, 30%, 8%, 0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.3 }}
            style={{ flex: 1, paddingHorizontal: 20 }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                overScrollMode="never"
            >
                <View
                    style={{
                        marginTop: "20%",
                        marginBottom: 28,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <View>
                        <Text size={26} color="hsla(1, 0%, 100%, 0.4)">
                            {greetingMessage}
                        </Text>
                        <Text size={38}>{name}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={signOut}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 14,
                            borderRadius: 10,
                            backgroundColor: "hsla(0, 70%, 50%, 0.2)",
                            borderWidth: 1,
                            borderColor: "hsla(0, 70%, 50%, 0.4)",
                            marginTop: 8,
                        }}
                    >
                        <Text size={14} color="hsla(0, 100%, 80%, 1)">
                            Déconnexion
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", gap: 20 }}>
                    <ActiveCourseCard
                        progression={progression}
                        activeCourse={activeCourse}
                        nextCourse={nextCourse}
                        activeStatus={activeStatus}
                        isLast={isLastCourseOfTheDay}
                    />
                    <GeneralAveragePreview gradesData={gradesData} />
                    {gradesData?.lastGrades ? (
                        <LastGrades lastGradesObject={gradesData.lastGrades} />
                    ) : null}
                    <HomeworksPreview
                        customHomeworks={customDataStore?.customHomeworks ?? {}}
                        homeworksDatas={homeworksData}
                    />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

