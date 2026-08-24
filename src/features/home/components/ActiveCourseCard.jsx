import { Text } from "@/components";
import { ProgressBar } from "@/components/progression/ProgressBar";
import { BackArrow } from "@/components/svg";
import { useHaptic } from "@/hooks/useHaptics";
import { routesNames } from "@/router/config/routesNames";
import { addOpacity, addOpacityToCssRgb } from "@/utils/colorGenerator";
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

    const { inClass, nextCourseKnown } = activeStatus || {};

    const message = nextCourseKnown ? "EN COURS" : "DERNIER COURS CONNU";
    const color = nextCourseKnown ? colors.main : "hsla(295, 64%, 71%, 1)";
    const extras = inClass ? [] : [{ resizeBars: true }];

    return (
        <View style={{ width: "100%", gap: 7 }}>
            {inClass && (
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginTop: -6,
                            marginBottom: 0,
                            paddingHorizontal: 6,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: addOpacityToCssRgb(
                                    colors.main,
                                    0.9
                                ),
                                width: 6,
                                height: 6,
                                borderRadius: 5,
                            }}
                        />
                        <Text
                            color={addOpacityToCssRgb(colors.main, 0.9)}
                            style={{ fontFamily: "SemiBold", fontSize: 16 }}
                        >
                            {isLast ? "DERNIER COURS DE LA JOURNÉE !" : message}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            haptic();
                            navigation.navigate(routesNames.client.timetable.group, {
                                screen: routesNames.client.timetable.content,
                            });
                        }}
                        style={{ width: "100%" }}
                    >
                        <Course
                            data={{
                                courseData: activeCourse,
                                color,
                                message,
                                progression,
                                isLast,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            )}
            {nextCourseKnown && (
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: -6,
                            marginBottom: 0,
                            paddingHorizontal: 6,
                        }}
                    >
                        <Text
                            color={addOpacityToCssRgb(colors.main, 0.9)}
                            style={{ fontFamily: "SemiBold", fontSize: 16 }}
                        >
                            PROCHAIN COURS
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            haptic();
                            navigation.navigate(routesNames.client.timetable.group, {
                                screen: routesNames.client.timetable.content,
                            });
                        }}
                        style={{ width: "100%" }}
                    >
                        <NextCourse
                            data={{
                                courseData: nextCourse,
                                extras,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            )}
            {!inClass && !nextCourseKnown && <AnyCourse />}
        </View>
    );
}

const Course = ({ data }) => {
    const { colors } = useTheme();
    const { courseData, color, message, progression, isLast } = data;
    return (
        <View
            style={{
                gap: 7,
                width: "100%",
                height: 65,
                flexDirection: "row",
                flex: 1,
            }}
        >
            <View
                style={{
                    padding: 10,
                    alignItems: "center",
                    width: 65,
                    backgroundColor: colors.secondary,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 8,
                    paddingLeft: 14,
                    paddingRight: 12,
                }}
            >
                <Text style={{ flexShrink: 0, fontFamily: "Medium", fontSize: 14 }}>
                    {courseData.startCourse.time}
                </Text>
                <View
                    style={{
                        flex: 1,
                        width: 2,
                        borderRadius: 2,
                        backgroundColor: colors.contrast,
                        marginVertical: -2,
                    }}
                />
                <Text style={{ flexShrink: 0, fontFamily: "Medium", fontSize: 14 }}>
                    {courseData.endCourse.time}
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: colors.secondary,
                    borderColor: colors.main,
                    //borderWidth: 1,
                    borderRadius: 22,
                    flex: 1,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 16,
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        marginBottom: 2,
                    }}
                >
                    <Text
                        color={addOpacityToCssRgb(colors.contrast, 0.9)}
                        oneLine
                        style={{ flexShrink: 1, fontFamily: "Bold", fontSize: 18 }}
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
                            fill={addOpacityToCssRgb(colors.contrast, 0.9)}
                            size={22}
                        />
                        <Text
                            style={{
                                flexShrink: 1,
                                color: addOpacityToCssRgb(colors.contrast, 0.9),
                                fontFamily: "SemiBold",
                                fontSize: 16,
                            }}
                        >
                            {courseData?.endCourse?.time}
                        </Text>
                    </View>
                </View>
                <View style={{ justifyContent: "space-between", marginBottom: 7 }}>
                    <ProgressBar
                        progression={progression}
                        color={addOpacityToCssRgb(colors.main, 0.85)}
                        style={{
                            backgroundColor: addOpacityToCssRgb(colors.main, 0.25),
                            height: 10,
                        }}
                    />
                </View>
            </View>
        </View>
    );
};
const NextCourse = ({ data }) => {
    const { courseData, extras } = data;
    const { colors } = useTheme();
    const resizeBars = !Boolean(extras.find((e) => e?.resizeBars)?.resizeBars);
    return (
        <View
            style={{
                gap: 7,
                width: "100%",
                height: 65,
                flexDirection: "row",
                flex: 1,
            }}
        >
            <View
                style={{
                    padding: 10,
                    alignItems: "center",
                    width: 65,
                    backgroundColor: colors.secondary,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 8,
                    paddingLeft: 14,
                    paddingRight: 12,
                }}
            >
                <Text style={{ flexShrink: 0, fontFamily: "Medium", fontSize: 14 }}>
                    {courseData.course.startCourse.time}
                </Text>
                <View
                    style={{
                        flex: 1,
                        width: 2,
                        borderRadius: 2,
                        backgroundColor: colors.contrast,
                        marginVertical: -2,
                    }}
                />
                <Text style={{ flexShrink: 0, fontFamily: "Medium", fontSize: 14 }}>
                    {courseData.course.endCourse.time}
                </Text>
            </View>
            <View
                style={{
                    padding: 10,
                    paddingLeft: 16,
                    paddingRight: 14,
                    flex: 1,
                    backgroundColor: colors.secondary,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 16,
                    justifyContent: "space-between",
                    flexDirection: "row",
                }}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                        oneLine
                        style={{ fontSize: 18, fontFamily: "Bold" }}
                        color="hsla(1, 0%, 100%, .9)"
                    >
                        {courseData.course.libelle}
                    </Text>
                    <View
                        style={{
                            flexShrink: 0,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: -3,
                        }}
                    >
                        <Text
                            color="hsla(1, 0%, 100%, .9)"
                            oneLine
                            style={{
                                fontSize: 12,
                                fontFamily: "Medium",
                            }}
                        >
                            {courseData.course.teacher ?? "Pas de prof."}
                        </Text>
                        <Text
                            color="hsla(1, 0%, 100%, .9)"
                            oneLine
                            style={{
                                fontSize: 12,
                                fontFamily: "Medium",
                            }}
                        >
                            {courseData.course.room ?? "Aucune salle"}
                        </Text>
                    </View>
                </View>
            </View>
            {/*<View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    justifyContent: "center",
                }}
            >
                <Text style={{ fontFamily: "Medium", fontSize: 14 }}>
                    Dans {formatDuration(courseData.timeRemaining)}
                </Text>
            </View>

            <View style={{ gap: 7 }}>
                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <Text
                        oneLine
                        style={{ flexShrink: 1, fontSize: 22, fontFamily: "Bold" }}
                        color="hsla(1, 0%, 100%, .9)"
                    >
                        {courseData.course.libelle}
                    </Text>
                    <View
                        style={{
                            backgroundColor: addOpacityToCssRgb(colors.main, 0.12),
                            alignSelf: "flex-end",
                            borderColor: addOpacityToCssRgb(colors.main, 0.2),
                            borderWidth: 1,
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            borderRadius: 8,
                        }}
                    >
                        <Text
                            color={colors.main}
                            style={{
                                flexShrink: 1,
                                fontFamily: "Medium",
                                fontSize: 13,
                            }}
                        >
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
            </View>*/}
        </View>
    );
};

const AnyCourse = ({}) => {
    return <Text>Et non ta pas cours</Text>;
};

