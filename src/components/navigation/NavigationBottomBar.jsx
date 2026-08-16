// components/CustomNavbar.js
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../core";

const ROUTES_NAMES = {
    client_grades: "Notes",
    client_homeworks: "Tâches",
    client_home: "Accueil",
    client_timetable: "Cours",
    client_messaging: "Messages",
};
const BAR_WIDTH = 36;
const SPRING_CONFIG = {
    damping: 50,
    stiffness: 80,
    mass: 1,
    overshootClamping: false,
};
const NavigationBottomBar = ({ state, descriptors, navigation }) => {
    const [isPressedIn, setIsPressedIn] = useState();
    const [isLongPressed, setIsLongPressed] = useState();

    const tabLayouts = useRef({});
    const hasMeasuredActive = useRef(false);

    const indicatorX = useSharedValue(0);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
    }));

    const moveIndicatorTo = (index, animated = true) => {
        const layout = tabLayouts.current[index];
        if (!layout) return;
        const centeredX = layout.x + layout.width / 2 - BAR_WIDTH / 2;

        if (animated) {
            indicatorX.value = withSpring(centeredX, SPRING_CONFIG);
        } else {
            indicatorX.value = centeredX;
        }
    };

    const onTabLayout = (index, event) => {
        const { x, width } = event.nativeEvent.layout;
        tabLayouts.current[index] = { x, width };

        if (index === state.index && !hasMeasuredActive.current) {
            hasMeasuredActive.current = true;
            moveIndicatorTo(index, false);
        }
    };

    useEffect(() => {
        moveIndicatorTo(state.index, true);
    }, [state.index]);

    return (
        <SafeAreaView
            edges={["bottom"]}
            style={{ backgroundColor: "hsla(240, 19%, 27%, 0.92)" }}
        >
            <View>
                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            top: 0,
                            width: BAR_WIDTH,
                            height: 3,
                            borderRadius: 6,
                            backgroundColor: "#C7CCFD",
                        },
                        animatedIndicatorStyle,
                    ]}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                    }}
                >
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        if (!options.inNavbar) return null;
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };
                        const IconComponent = options.icon;

                        return (
                            <TabButton
                                key={index}
                                index={index}
                                route={route}
                                options={options}
                                isFocused={isFocused}
                                onPress={onPress}
                                onLayout={(e) => onTabLayout(index, e)}
                                setIsPressedIn={setIsPressedIn}
                                setIsLongPressed={setIsLongPressed}
                                IconComponent={IconComponent}
                            />
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
};

const TabButton = ({
    route,
    options,
    isFocused,
    onPress,
    onLayout,
    setIsPressedIn,
    setIsLongPressed,
    IconComponent,
}) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1.2 : 1, {
            damping: 10,
            mass: 0.6,
            stiffness: 200,
        });
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onPressIn={() => {
                setIsPressedIn(true);
                scale.value = withSpring(0.9, { damping: 12, stiffness: 250 });
            }}
            onPressOut={() => {
                setIsPressedIn(false);
                setIsLongPressed(false);
                scale.value = withSpring(isFocused ? 1.2 : 1, {
                    damping: 10,
                    mass: 0.6,
                    stiffness: 200,
                });
            }}
            onLongPress={() => setIsLongPressed(true)}
            onLayout={onLayout}
            style={{}}
        >
            <View
                style={{
                    padding: 14,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Animated.View style={animatedIconStyle}>
                    <IconComponent
                        width={26}
                        height={26}
                        color={isFocused ? "#C7CCFD" : "#838CEB"}
                    />
                </Animated.View>
                <Text
                    preset="label2"
                    weight={isFocused ? "bold" : "medium"}
                    color={isFocused ? "#C7CCFD" : "#838CEB"}
                >
                    {ROUTES_NAMES[route.name] ?? "N/A"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default NavigationBottomBar;
