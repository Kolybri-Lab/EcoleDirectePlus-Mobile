import { ScreenStack, Text } from "@/components";
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
import { useErrorStore } from "@/hooks/useErrorStore";
import { useSignIn } from "@/hooks/useSignIn";
import { useUserStore } from "@/hooks/useUserStore";
import { getTodayDateString } from "@/utils/date";
import { objectsEqual } from "@/utils/json";
import {
    convertTimeHoursMinToMinutes,
    getTimeInterval,
    isAfter,
    isBefore,
    isInInterval,
} from "@/utils/time";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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
    const [shouldCrashRender, setShouldCrashRender] = useState(false);

    if (shouldCrashRender) {
        throw new Error(
            "TypeError: Cannot read property 'courses' of undefined\n" +
                "    at HomeScreen (HomeScreen.jsx:59:24)\n" +
                "    at renderWithHooks (react-dom.development.js:16305)\n" +
                "    at mountIndeterminateComponent (react-dom.development.js:20074)\n" +
                "    at beginWork (react-dom.development.js:21587)\n" +
                "    at performUnitOfWork (react-dom.development.js:26560)\n" +
                "    at workLoopSync (react-dom.development.js:26473)\n" +
                "    at renderRootSync (react-dom.development.js:26446)\n" +
                "    at performConcurrentWorkOnRoot (react-dom.development.js:25738)\n" +
                "    at workLoop (scheduler.development.js:266)\n" +
                "    at flushWork (scheduler.development.js:239)\n" +
                "    at performWorkUntilDeadline (scheduler.development.js:533)\n" +
                "    at dispatchAction (react-dom.development.js:16139)\n" +
                "    at handlePress (TouchableOpacity.js:112)\n" +
                "    at invokeGuardedCallback (react-dom.development.js:4158)\n" +
                "    at executeDispatch (react-dom.development.js:8243)" +
                "    at renderWithHooks (react-dom.development.js:16305)\n" +
                "    at mountIndeterminateComponent (react-dom.development.js:20074)\n" +
                "    at beginWork (react-dom.development.js:21587)\n" +
                "    at performUnitOfWork (react-dom.development.js:26560)\n" +
                "    at workLoopSync (react-dom.development.js:26473)\n" +
                "    at renderRootSync (react-dom.development.js:26446)\n" +
                "    at performConcurrentWorkOnRoot (react-dom.development.js:25738)\n" +
                "    at workLoop (scheduler.development.js:266)\n" +
                "    at flushWork (scheduler.development.js:239)\n" +
                "    at performWorkUntilDeadline (scheduler.development.js:533)\n" +
                "    at dispatchAction (react-dom.development.js:16139)\n" +
                "    at handlePress (TouchableOpacity.js:112)\n" +
                "    at invokeGuardedCallback (react-dom.development.js:4158)\n" +
                "    at executeDispatch (react-dom.development.js:8243)"
        );
    }

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

    function buildNextCourseResult(course, nextDate, isLastCourseOfTheDay) {
        return {
            nextCourse: {
                course,
                timeRemaining: getTimeInterval(
                    `${currentTime.date}T${currentTime.time}`,
                    `${course.startCourse.date}T${course.startCourse.time}`
                ),
            },
            nextDate,
            isLastCourseOfTheDay,
        };
    }

    const { nextCourse, nextDate, isLastCourseOfTheDay } = useMemo(() => {
        const EMPTY_RESULT = {
            nextCourse: {},
            nextDate: null,
            isLastCourseOfTheDay: null,
        };

        if (!activeDate) {
            return EMPTY_RESULT;
        }

        const courses = activeDate.courses;
        const firstCourse = courses[0];
        const lastCourse = courses[courses.length - 1];

        const activeCourseIndex = !objectsEqual(activeCourse, {})
            ? courses.findIndex((c) => objectsEqual(c, activeCourse))
            : -1;

        const isLastCourseOfTheDay = activeCourseIndex === courses.length - 1;

        // --- Détermine dans quelle phase de la journée on se trouve ---
        const isBeforeSchoolDay = isBefore(
            currentTime.time,
            firstCourse.startCourse.time
        );
        const isDuringCourseHours = isInInterval(
            currentTime.time,
            firstCourse.startCourse.time,
            lastCourse.endCourse.time
        );
        const isAfterSchoolDay = !isBeforeSchoolDay && !isDuringCourseHours;
        const isOnBreakBetweenCourses =
            isDuringCourseHours && activeCourseIndex === -1;
        const isInsideACourse = activeCourseIndex !== -1;
        // before the start of th day, next course is the first
        if (isBeforeSchoolDay) {
            return buildNextCourseResult(
                firstCourse,
                activeDate,
                isLastCourseOfTheDay
            );
        }
        // break between 2 courses, find the next that's about to start
        if (isOnBreakBetweenCourses) {
            const nextCourseIndex = courses.findIndex(({ startCourse }) =>
                isAfter(startCourse.time, currentTime.time)
            );

            if (nextCourseIndex === -1) {
                console.error("Big error: no next course found during course hours");
                return { ...EMPTY_RESULT, isLastCourseOfTheDay };
            }

            return buildNextCourseResult(
                courses[nextCourseIndex],
                activeDate,
                isLastCourseOfTheDay
            );
        }

        // normal case
        if (isInsideACourse && !isLastCourseOfTheDay) {
            return buildNextCourseResult(
                courses[activeCourseIndex + 1],
                activeDate,
                isLastCourseOfTheDay
            );
        }

        // day ended or last course, next course is the first of the next day
        if (isLastCourseOfTheDay || isAfterSchoolDay) {
            const activeDateIndex = timetableData.findIndex((d) =>
                objectsEqual(d, activeDate)
            );
            const followingDate = timetableData[activeDateIndex + 1];

            if (!followingDate) {
                return { nextCourse: {}, nextDate: null, isLastCourseOfTheDay };
            }

            return buildNextCourseResult(
                followingDate.courses[0],
                followingDate,
                isLastCourseOfTheDay
            );
        }

        // bruh
        console.error("Big error: unhandled next-course state");
        return EMPTY_RESULT;
    }, [activeDate, activeCourse, timetableData, currentTime]);

    const activeStatus = useMemo(() => {
        return {
            inClass: !objectsEqual(activeCourse, {}),
            nextCourseKnown: !objectsEqual(nextCourse, {}),
        };
    }, [activeCourse, nextCourse]);
    return (
        <ScreenStack>
            <LinearGradient
                colors={["hsla(228, 70%, 18%, 1)", "hsla(228, 30%, 8%, 0.85)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}
                style={{ paddingHorizontal: 20 }}
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
                        <View style={{ flex: 1, marginRight: 10 }}>
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
                        {token === "guest_token" && (
                            <View
                                style={{
                                    marginTop: 24,
                                    padding: 16,
                                    borderRadius: 16,
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderWidth: 1,
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    width: "100%",
                                    gap: 10,
                                }}
                            >
                                <Text size={16} color="hsla(1, 0%, 100%, 0.8)">
                                    🧪 Zone de Test Erreurs, Bandeau & Toasts
                                </Text>

                                {/* BANDEAUX */}
                                <TouchableOpacity
                                    onPress={() =>
                                        useErrorStore.getState().pushError({
                                            type: "network",
                                            message:
                                                "Connexion Internet interrompue",
                                            isRetryable: true,
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#EF4444">
                                        🔴 Bandeau : Panne Réseau
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        useErrorStore
                                            .getState()
                                            .setHasStaleData(true)
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#F59E0B">
                                        🟡 Bandeau : Données Obsolètes
                                    </Text>
                                </TouchableOpacity>

                                {/* TOASTS API ED & UNKNOWN */}
                                <TouchableOpacity
                                    onPress={() =>
                                        useErrorStore.getState().pushError({
                                            type: "api-business",
                                            code: 403,
                                            message:
                                                "ED 403 : Adresse IP enregistrée / WAF",
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(249, 115, 22, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#F97316">
                                        🟠 Toast : ED Code 403 (WAF Rate-limit)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        useErrorStore.getState().pushError({
                                            type: "api-business",
                                            code: 535,
                                            message:
                                                "ED 535 : Établissement indisponible",
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(236, 72, 153, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#EC4899">
                                        🏢 Toast : ED Code 535 (Établissement fermé)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        useErrorStore.getState().pushError({
                                            type: "api-business",
                                            code: 517,
                                            message:
                                                "ED 517 : Version d'API obsolète",
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(168, 85, 247, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#A855F7">
                                        ⚠️ Toast : ED Code 517 (API périmée)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        useErrorStore.getState().pushError({
                                            type: "unknown",
                                            message:
                                                "Erreur inattendue au traitement des données",
                                            endpoint: "/v3/eleves/notes.awp",
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(99, 102, 241, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#6366F1">
                                        ❓ Toast : Erreur Inconnue / Mapping
                                    </Text>
                                </TouchableOpacity>

                                {/* CRASHS BLOQUANTS & ERROR BOUNDARY */}
                                <TouchableOpacity
                                    onPress={() => setShouldCrashRender(true)}
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(220, 38, 38, 0.3)",
                                        borderWidth: 1,
                                        borderColor: "#DC2626",
                                    }}
                                >
                                    <Text size={13} color="#FCA5A5">
                                        💥 Crash : Rendu Component React
                                        (ErrorBoundary)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        const invalidObject = null;
                                        invalidObject.triggerNullPointerMethod();
                                    }}
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(185, 28, 28, 0.3)",
                                        borderWidth: 1,
                                        borderColor: "#B91C1C",
                                    }}
                                >
                                    <Text size={13} color="#FCA5A5">
                                        💣 Crash : Exception JS Null Pointer /
                                        TypeError
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        useErrorStore.getState().pushError({
                                            type: "auth",
                                            reason: "session_expired",
                                            message:
                                                "Session expirée, veuillez vous reconnecter",
                                        });
                                        signOut();
                                    }}
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(217, 119, 6, 0.3)",
                                        borderWidth: 1,
                                        borderColor: "#D97706",
                                    }}
                                >
                                    <Text size={13} color="#FDE68A">
                                        🔑 Crash : Session Expirée ED (Auto-Logout)
                                    </Text>
                                </TouchableOpacity>

                                {/* RÉSOLUTION & EFFACEMENT */}
                                <TouchableOpacity
                                    onPress={() => {
                                        useErrorStore.getState().clearAll();
                                    }}
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                                    }}
                                >
                                    <Text size={13} color="#10B981">
                                        🟢 Résoudre / Effacer Toutes les Erreurs
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>
        </ScreenStack>
    );
}

