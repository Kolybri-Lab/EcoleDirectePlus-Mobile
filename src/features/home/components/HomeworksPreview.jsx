import { Text } from "@/components";
import { injectHomeworksIntoModel } from "@/features/homeworks/utils/homeworks";
import { useHaptic } from "@/hooks/useHaptics";
import { routesNames } from "@/router/config/routesNames";

import { formatFrenchDate } from "@/utils/date";
import base64Handler from "@/utils/handleBase64";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

export default function HomeworksPreview({ homeworksDatas, customHomeworks }) {
    const navigation = useNavigation();
    const haptic = useHaptic("light");

    const mergedHomeworks = useMemo(() => {
        return injectHomeworksIntoModel(homeworksDatas, customHomeworks ?? []);
    }, [homeworksDatas, customHomeworks]);

    const groupedHomeworks = useMemo(() => {
        const { formatedDates = {}, ...dateGroups } = mergedHomeworks;

        return Object.entries(dateGroups)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, homeworks]) => ({
                date,
                homeworks,
                meta: formatedDates[date],
            }));
    }, [mergedHomeworks]);

    return (
        <View style={{ width: "100%", flex: 1 }}>
            {groupedHomeworks.map(({ date, homeworks, meta }) => (
                <View key={date}>
                    <DateHeader
                        date={date}
                        meta={meta}
                        countForDate={homeworks.length}
                    />

                    {homeworks.map((item, index) => (
                        <TouchableOpacity
                            key={item.customHomeworkMd5Key ?? `${date}-${item.id}`}
                            onPress={() => {
                                haptic();
                                navigation.navigate(
                                    routesNames.client.homeworks.group,
                                    {
                                        screen: routesNames.client.homeworks.details,
                                        params: { homeworksData: item },
                                    }
                                );
                            }}
                        >
                            <Homework
                                key={
                                    item.customHomeworkMd5Key ?? `${date}-${item.id}`
                                }
                                homework={item}
                                index={index}
                                countForDate={homeworks.length}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
}

const DateHeader = ({ date, meta, countForDate }) => (
    <View
        style={{
            paddingVertical: 8,
            paddingHorizontal: 4,
            flexDirection: "row",
            justifyContent: "space-between",
        }}
    >
        <Text preset="title1">
            {(meta?.long ?? `POUR ${formatFrenchDate(date)}`).toUpperCase()}
        </Text>
        <Text preset="h4" color="hsl(228, 100%, 69%)">
            {countForDate}
        </Text>
    </View>
);

const Homework = ({ homework, index, countForDate }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const decodedContent = useMemo(
        () => base64Handler.decode(homework.homeworksContent.content),
        [homework.homeworksContent.content]
    );
    let borderRadiusStyle = {};
    const BORDER_RADIUS_EXT = 28;
    const BORDER_RADIUS_INT = 8;
    if (index === 0 && countForDate > 1) {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_EXT,
            borderTopRightRadius: BORDER_RADIUS_EXT,
            borderBottomLeftRadius: BORDER_RADIUS_INT,
            borderBottomRightRadius: BORDER_RADIUS_INT,
        };
    } else if (index === countForDate - 1 && countForDate > 1) {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_INT,
            borderTopRightRadius: BORDER_RADIUS_INT,
            borderBottomLeftRadius: BORDER_RADIUS_EXT,
            borderBottomRightRadius: BORDER_RADIUS_EXT,
        };
    } else if (countForDate === 1) {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_EXT,
            borderTopRightRadius: BORDER_RADIUS_EXT,
            borderBottomLeftRadius: BORDER_RADIUS_EXT,
            borderBottomRightRadius: BORDER_RADIUS_EXT,
        };
    } else {
        borderRadiusStyle = {
            borderTopLeftRadius: BORDER_RADIUS_INT,
            borderTopRightRadius: BORDER_RADIUS_INT,
            borderBottomLeftRadius: BORDER_RADIUS_INT,
            borderBottomRightRadius: BORDER_RADIUS_INT,
        };
    }

    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: homework.isCustom
                        ? "hsl(235, 28%, 30%)"
                        : colors.secondary,
                    marginVertical: 2,
                    alignItems: "center",
                    flexDirection: "row",
                    padding: 19,
                    gap: 10,
                },
                borderRadiusStyle,
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    gap: 6,
                    minWidth: 0,
                }}
            >
                <Text
                    preset="title1"
                    style={{
                        flexShrink: 0,
                    }}
                >
                    {homework.discipline.name}
                </Text>

                <View style={{ flex: 1, flexShrink: 1, minWidth: 0 }}>
                    {homework.isCustom ? (
                        <Text
                            preset="label2"
                            color="hsla(1, 0%, 100%, 0.55)"
                            oneLine
                            style={{ flexShrink: 1 }}
                        >
                            {homework.homeworksContent.content}
                        </Text>
                    ) : (
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: decodedContent }}
                            baseStyle={{
                                color: "hsla(1, 0%, 100%, 0.55)",
                                fontSize: 13,
                            }}
                            defaultTextProps={{
                                numberOfLines: 1,
                                ellipsizeMode: "tail",
                            }}
                            enableExperimentalMarginCollapsing
                        />
                    )}
                </View>
            </View>

            {homework.isEvaluation && (
                <View
                    style={{
                        flexShrink: 1,
                        backgroundColor: "hsla(219, 100%, 69%, 0.75)",
                        borderColor: "hsla(219, 100%, 69%, 1)",
                        borderWidth: 1,
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                    }}
                >
                    <Text preset="label3">Contrôle</Text>
                </View>
            )}
        </View>
    );
};

