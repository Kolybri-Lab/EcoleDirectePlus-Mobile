import { Text } from "@/components";
import { ProgressBar } from "@/components/progression/ProgressBar";
import { BackArrow } from "@/components/svg";
import { useHaptic } from "@/hooks/useHaptics";
import { routesNames } from "@/router/config/routesNames";
import { formatDuration, getTimeInterval } from "@/utils/time";
import { useNavigation, useTheme } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";

export default function ActiveCourseCard({
    progression,
    activeCourse,
    nextCourse,
    activeStatus,
    isLast,
}) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const haptic = useHaptic("light");
    const { message, color, displayComponents, extras } = getStatus(activeStatus);
    const dataByComponent = new Map([
        [
            Course,
            {
                courseData: activeCourse,
                color,
                message,
                progression,
                isLast: isLast,
            },
        ],
        [NextCourse, { courseData: nextCourse, extras }],
        [AnyCourse, {}],
    ]);

    return (
        <TouchableOpacity
            onPress={() => {
                {
                    haptic();
                    navigation.navigate(routesNames.client.timetable.group, {
                        screen: routesNames.client.timetable.content,
                    });
                }
            }}
            style={{
                backgroundColor: colors.secondary,
                borderColor: "hsla(219, 100%, 69%, 0.6)",
                borderWidth: 1,
                borderRadius: 22,
                width: "100%",
                padding: 19,
            }}
        >
            {displayComponents.map((Component, index) => (
                <Component key={index} data={dataByComponent.get(Component)} />
            ))}
        </TouchableOpacity>
    );
}

const Course = ({ data }) => {
    const { courseData, color, message, progression, isLast } = data;
    return (
        <>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        backgroundColor: color,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                    }}
                />
                <Text color={color}>
                    {isLast ? "DERNIER COURS DE LA JOURNÉE !" : message}
                </Text>
            </View>
            <View
                style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginBottom: 5,
                }}
            >
                <Text
                    color="hsla(1, 100%, 100%, 0.9)"
                    preset="h3"
                    oneLine
                    style={{ flexShrink: 1 }}
                >
                    {courseData?.libelle}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <BackArrow
                        props={{ transform: [{ rotate: "180deg" }] }}
                        fill={"hsla(1, 100%, 100%, 0.9)"}
                        size={22}
                    />
                    <Text
                        preset="label1"
                        color="hsla(1, 100%, 100%, 0.9)"
                        style={{ flexShrink: 1 }}
                    >
                        {courseData?.endCourse?.time}
                    </Text>
                </View>
            </View>
            <View style={{ justifyContent: "space-between", marginBottom: 12 }}>
                <ProgressBar
                    progression={progression}
                    color="hsla(228, 100%, 69%, 0.85)"
                    style={{
                        backgroundColor: "hsla(228, 100%, 69%, .25)",
                        height: 10,
                    }}
                />
            </View>
        </>
    );
};
const NextCourse = ({ data }) => {
    const { courseData, extras } = data;
    const resizeBars = !Boolean(extras.find((e) => e?.resizeBars)?.resizeBars);
    return (
        <>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        flex: resizeBars ? 1 : 0.25,
                        height: 1,
                        backgroundColor: "hsla(0, 0%, 100%, 0.4)",
                    }}
                />

                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "hsla(0, 0%, 100%, 0.1)",
                        backgroundColor: "hsla(0, 0%, 100%, 0.08)",
                        borderRadius: 20,
                        paddingHorizontal: 18,
                        paddingVertical: 4,
                        marginHorizontal: 8,
                    }}
                >
                    <Text>Dans {formatDuration(courseData.timeRemaining)}</Text>
                </View>
                <View
                    style={{
                        flex: resizeBars ? 1 : 0.25,
                        height: 1,
                        backgroundColor: "hsla(0, 0%, 100%, 0.4)",
                    }}
                />
            </View>

            <View style={{ gap: 7 }}>
                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <Text
                        oneLine
                        style={{ flexShrink: 1 }}
                        preset="h2"
                        color="hsla(1, 0%, 100%, .9)"
                    >
                        {courseData.course.libelle}
                    </Text>
                    <View
                        style={{
                            backgroundColor: "hsla(219, 100%, 69%, 0.12)",
                            alignSelf: "flex-end",
                            borderColor: "hsla(219, 100%, 69%, 0.20)",
                            borderWidth: 1,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 8,
                        }}
                    >
                        <Text color="hsl(219, 100%, 69%)" style={{ flexShrink: 1 }}>
                            {courseData.course.room ?? "Aucune salle"}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            flexShrink: 1,
                            maxWidth: "50%",
                        }}
                    >
                        <Text
                            color="hsla(1, 0%, 100%, .9)"
                            oneLine
                            style={{ flexShrink: 1 }}
                        >
                            {courseData.course.teacher ?? "Pas de prof."}
                        </Text>
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                backgroundColor: "hsla(0, 0%, 100%, 0.9)",
                                borderRadius: 12,
                                flexShrink: 0,
                            }}
                        />
                        <Text color="hsla(1, 0%, 100%, .9)" oneLine>
                            {formatDuration(
                                getTimeInterval(
                                    `${courseData.course.startCourse.date}T${courseData.course.startCourse.time}`,
                                    `${courseData.course.endCourse.date}T${courseData.course.endCourse.time}`
                                ),
                                "short"
                            )}
                        </Text>
                    </View>
                    <Text
                        color="hsla(1, 0%, 100%, .9)"
                        oneLine
                        style={{ maxWidth: "50%" }}
                    >
                        {courseData.course.startCourse.time} /{" "}
                        {courseData.course.endCourse.time}
                    </Text>
                </View>
            </View>
        </>
    );
};

const AnyCourse = ({}) => {
    return <Text>Et non ta pas cours</Text>;
};

const STATUS_CONFIG = {
    "true-true": {
        message: "EN COURS",
        color: "hsla(219, 100%, 69%, 1)",
        displayComponents: [Course, NextCourse],
        extras: [],
    },
    "true-false": {
        message: "DERNIER COURS CONNU",
        color: "hsla(295, 64%, 71%, 1)",
        displayComponents: [Course],
        extras: [],
    },
    "false-true": {
        message: "PROCHAIN COURS",
        color: "transparent", // useless but... prevent bugs
        displayComponents: [NextCourse],
        extras: [{ resizeBars: true }],
    },
    "false-false": {
        message: "PLUS DE COURS",
        color: "transparent", // same
        displayComponents: [AnyCourse],
        extras: [],
    },
};

const getStatus = ({ inClass, nextCourseKnown }) => {
    return STATUS_CONFIG[`${inClass}-${nextCourseKnown}`];
};

