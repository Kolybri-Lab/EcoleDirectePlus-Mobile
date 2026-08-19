import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { Text } from "../core";
import { Chevron } from "../svg";

/* options: [{ id, name }, ...] */
/* selectorPosition: "left" | "right" | "center" (default: "left") */

const POSITIONS = {
    left: "flex-start",
    right: "flex-end",
    center: "center",
};

export default function DropDownMenu({
    options = [],
    placeholder = "Select...",
    value,
    onSelect,
    disabled = false,
    minWidth = "auto",
    selectorPosition = "left",
    customButtonStyle = {},
    customDropDownStyle = {},
}) {
    const [isDeployed, setIsDeployed] = useState(false);
    const [internalSelected, setInternalSelected] = useState(value);

    const transitionProgress = useSharedValue(0);
    const opacityProgress = useSharedValue(0);
    const pressScale = useSharedValue(1);

    const isControlled = value !== undefined;
    const selected = isControlled ? value : internalSelected;
    const toggleDeployed = useCallback(() => {
        if (disabled) return;

        const next = !isDeployed;

        setIsDeployed(next);

        transitionProgress.value = withSpring(next ? 1 : 0, {
            damping: 47,
            stiffness: 600,
        });

        opacityProgress.value = withTiming(next ? 1 : 0, {
            duration: 250,
        });
    }, [disabled, isDeployed]);

    const closeDropdown = useCallback(() => {
        setIsDeployed(false);

        transitionProgress.value = withSpring(0, {
            damping: 47,
            stiffness: 600,
        });

        opacityProgress.value = withTiming(0, {
            duration: 250,
        });
    }, []);
    const handleSelected = useCallback(
        (item) => {
            closeDropdown();

            if (!isControlled) {
                setInternalSelected(item);
            }

            onSelect?.(item);
        },
        [closeDropdown, isControlled, onSelect]
    );
    const dropDownStyle = useAnimatedStyle(() => ({
        opacity: opacityProgress.value,
        transform: [
            {
                translateY: interpolate(transitionProgress.value, [0, 1], [-8, 0]),
            },
            {
                scale: interpolate(transitionProgress.value, [0, 1], [0.98, 1]),
            },
        ],
    }));
    const buttonSyle = useAnimatedStyle(() => ({
        transform: [{ scale: pressScale.value }],
    }));
    const chevronStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate:
                    interpolate(transitionProgress.value, [0, 1], [90, 270]) + "deg",
            },
        ],
    }));

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            closeDropdown();
        }
    }, [isFocused, closeDropdown]);
    return (
        <View style={{ width: "100%" }}>
            <Animated.View style={buttonSyle}>
                <Pressable
                    onPress={toggleDeployed}
                    disabled={disabled}
                    onPressIn={() => {
                        pressScale.value = withSpring(0.94, {
                            damping: 10,
                            stiffness: 140,
                            mass: 0.7,
                        });
                    }}
                    onPressOut={() => {
                        pressScale.value = withSpring(1, {
                            damping: 12,
                            stiffness: 170,
                            mass: 1.1,
                        });
                    }}
                    style={[
                        {
                            backgroundColor: "hsla(0, 0%, 100%, 0.12)",
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            borderRadius: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            justifyContent: "space-between",
                        },
                        customButtonStyle,
                    ]}
                >
                    <Text preset="label1" oneLine style={{ flexShrink: 1 }}>
                        {selected?.name ?? placeholder}
                    </Text>
                    <Animated.View style={chevronStyle}>
                        <Chevron size={13} />
                    </Animated.View>
                </Pressable>
            </Animated.View>

            {options.length > 0 && (
                <Animated.View
                    pointerEvents={isDeployed ? "auto" : "none"}

                    style={[
                        {
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: 6,
                            flexDirection: "row",
                            justifyContent: POSITIONS[selectorPosition],
                            zIndex: 2,
                        },
                        dropDownStyle,
                        customDropDownStyle,
                    ]}
                >
                    <View
                        style={{
                            backgroundColor: "hsl(235, 28%, 22%)",
                            borderRadius: 15,
                            overflow: "hidden",
                        }}
                    >
                        {options.map((item) => {
                            const isSelected = selected?.id === item.id;

                            return (
                                <Pressable
                                    onPress={() => handleSelected(item)}
                                    key={item.id}
                                    style={{
                                        backgroundColor: isSelected
                                            ? "hsla(0, 0%, 100%, 0.4)"
                                            : "hsla(0, 0%, 100%, 0.12)",
                                        padding: 12,
                                        minWidth,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text preset="label2">{item.name}</Text>

                                    {isSelected && (
                                        <View
                                            style={{
                                                width: 7,
                                                height: 7,
                                                backgroundColor:
                                                    "hsla(0, 0%, 100%, 1)",
                                                borderRadius: 5,
                                            }}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>
            )}
        </View>
    );
}
