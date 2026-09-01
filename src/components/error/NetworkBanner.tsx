import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, Text } from "react-native";
//import { Text } from "@/components";
import { useErrorStore } from "@/hooks/useErrorStore";
import { useNetworkStore } from "@/hooks/useNetworkStore";
import { useNetwork } from "@/hooks/network";
import { useAuthStore } from "@/hooks/useAuthStore";

export interface NetworkBannerProps {
    // Props personnalisables si besoin
    onPressRetry?: () => void;
}

export function NetworkBanner({ onPressRetry }: NetworkBannerProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isBooting = useAuthStore((state) => state.isBooting);
    const { isOnline } = useNetwork();
    const errors = useErrorStore((state) => state.errors);
    const hasStaleData = useErrorStore((state) => state.hasStaleData);
    const clearNetworkErrors = useErrorStore((state) => state.clearNetworkErrors);

    const networkError = useMemo(
        () => errors.find((e) => e.error.type === "network")?.error,
        [errors]
    );

    const isOffline = !isOnline || Boolean(networkError);
    const isStale = hasStaleData && !isOffline;

    const [isJustResolved, setIsJustResolved] = useState(false);
    const prevHadErrorRef = useRef(false);

    useEffect(() => {
        const hasError = isOffline || isStale;

        if (prevHadErrorRef.current && !hasError) {
            setIsJustResolved(true);
            const timer = setTimeout(() => {
                setIsJustResolved(false);
            }, 1500);
            return () => clearTimeout(timer);
        }

        prevHadErrorRef.current = hasError;
    }, [isOffline, isStale]);

    const isVisible = isAuthenticated && !isBooting && (isOffline || isStale || isJustResolved);

    let message = "";
    if (isOffline) {
        message = "Erreur de connexion : Données obsolètes";
    } else if (isStale) {
        message = "Données obsolètes";
    } else {
        message = "Données réactualisées";
    }

    let color = "red";
    if (isOffline || isStale) {
        color = "red";
    } else {
        color = "green";
    }

    const translateY = useRef(new Animated.Value(-48)).current;
    const shouldBeVisible = isOffline || isStale || isJustResolved;

    useEffect(() => {
        if (shouldBeVisible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: -48,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [shouldBeVisible]);

    return (
        <Animated.View
            pointerEvents={shouldBeVisible ? "auto" : "none"}
            style={{
                position: "absolute",
                top: 20,
                left: 0,
                right: 0,
                zIndex: 999,
                height: 28,
                width: "100%",
                backgroundColor: "#0C0C20",
                justifyContent: "center",
                alignItems: "center",
                transform: [{ translateY }],
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 7,
                }}
            >
                <View
                    style={{
                        height: 7,
                        width: 7,
                        backgroundColor: color,
                        borderRadius: 5,
                    }}
                />
                <Text style={{ fontSize: 11, color: "#FFFFFF" }}>{message}</Text>
            </View>
        </Animated.View>
    );
}

export default NetworkBanner;

