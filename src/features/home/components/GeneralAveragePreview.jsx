import { Text } from "@/components";
import Period from "@/features/grades/models/Period";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useHaptic } from "@/hooks/useHaptics";
import { routesNames } from "@/router/config/routesNames";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

export default function GeneralAveragePreview({ gradesData }) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const currentTime = useCurrentTime();
    const haptic = useHaptic("light");
    const generalAverage = useMemo(() => {
        if (!gradesData?.activePeriod) return null;
        return new Period(
            gradesData[gradesData.activePeriod.periodCode]
        ).makeGeneralAverage();
    }, [gradesData]);

    if (!gradesData?.activePeriod) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={() => {
                haptic();
                navigation.navigate(routesNames.client.grades.group, {
                    screen: routesNames.client.grades.content,
                });
            }}
            style={{
                width: "100%",
                backgroundColor: colors.secondary,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 19,
                paddingVertical: 24,
            }}
        >
            <View style={{ gap: 5 }}>
                <Text preset="title1" color="hsl(228, 100%, 69%)">
                    {"Moyenne Générale".toUpperCase() /* j'autorise les jugements */}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text preset="label2" color="hsla(0, 0%, 100%, 0.55)">
                        {gradesData.activePeriod.periodName}
                    </Text>
                    <View
                        style={{
                            width: 4,
                            height: 4,
                            borderRadius: 10,
                            backgroundColor: "hsla(0, 0%, 100%, 0.55)",
                        }}
                    />
                    <Text preset="label2" color="hsla(0, 0%, 100%, 0.55)">
                        {currentTime.date.split("-")[0]}
                    </Text>
                </View>
            </View>
            <Text size={34} weight="bold">
                {generalAverage}
                <Text size={16} color="hsla(0, 0%, 100%, 0.55)">
                    /20
                </Text>
            </Text>
        </TouchableOpacity>
    );
}

