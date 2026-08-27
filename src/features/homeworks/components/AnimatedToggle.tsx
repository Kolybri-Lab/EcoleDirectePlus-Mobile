import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";

export interface AnimatedToggleProps {
    isDone?: "done" | "todo" | boolean;
    loadingState?: "idle" | "loading" | "error";
    onToggle?: () => void;
    onPress?: () => void;
    size?: number;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function AnimatedToggle({
    isDone = "todo",
    loadingState = "idle",
    onToggle,
    onPress,
    size = 40,
    disabled = false,
    style,
}: AnimatedToggleProps) {
    const handlePress = onToggle ?? onPress;

    let statusColor = "red";
    if (loadingState === "loading") {
        statusColor = "orange";
    } else if (loadingState === "error") {
        statusColor = "black";
    } else {
        const isCompleted = isDone === "done" || isDone === true;
        statusColor = isCompleted ? "green" : "red";
    }

    return (
        <TouchableOpacity
            style={[
                {
                    aspectRatio: 1,
                    width: size,
                    backgroundColor: statusColor,
                    borderRadius: size / 2,
                    zIndex: 2000,
                },
                style,
            ]}
            onPress={handlePress}
            hitSlop={12}
            disabled={disabled || loadingState === "loading" || loadingState === "error"}
            activeOpacity={0.7}
        />
    );
}
