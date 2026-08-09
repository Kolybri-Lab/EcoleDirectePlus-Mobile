import { NavigationContainer } from "@react-navigation/native";
import * as Network from "expo-network";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MainLayout } from "../components";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useActiveThemeMode } from "@/hooks/useThemeStore";
import { useNetworkStore } from "@/hooks/useNetworkStore";
import authService from "@/services/login/authService";
import { tryLoginWithStoredCreds, tryRestoreToken } from "@/services/login/tools/bootstrapAsync";
import SplashScreen from "@/screens/Splash/SplashScreen";
import { THEMES_ASSOCIATIONS } from "@/themes/themes";
import Auth from "./display/auth/Auth";
import Client from "./display/client/Client";
import NetworkBanner from "@/components/error/NetworkBanner";
import ErrorToast from "@/components/error/ErrorToast";
import ErrorBoundary from "@/components/error/ErrorBoundary";

export default function AuthNavigator() {
    const activeMode = useActiveThemeMode();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isBooting = useAuthStore((state) => state.isBooting);
    const setActiveNetworkStatus = useNetworkStore((state) => state.setActiveNetworkStatus);

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const credentials = await authService.restoreCredentials();
                const hasCipher = Boolean(credentials?.cipherText);
                const hasLoginCreds = Boolean(credentials?.password);

                if (hasCipher) {
                    const success = await tryLoginWithStoredCreds({
                        cipherText: credentials.cipherText,
                    });
                    if (success) return;
                }

                if (hasLoginCreds) {
                    const restored = await tryRestoreToken({
                        credentialsPassword: credentials.password,
                    });
                    if (restored) return;
                }

                useAuthStore.getState().setBooting(false);
            } catch (error) {
                console.error("ERROR IN BOOTSTRAPASYNC", error);
                useAuthStore.getState().setBooting(false);
            }
        };

        bootstrapAsync();
    }, []);

    useEffect(() => {
        const initializeNetwork = async () => {
            try {
                const connectionStatus = await Network.getNetworkStateAsync();
                const airplaneStatus = await Network.isAirplaneModeEnabledAsync();

                if (
                    connectionStatus.isConnected &&
                    connectionStatus.isInternetReachable
                ) {
                    console.log("### ONLINE");
                } else {
                    console.log("### OFFLINE");
                }

                setActiveNetworkStatus({
                    ...connectionStatus,
                    inAirplaneMode: airplaneStatus,
                });
            } catch (error) {
                console.error("Error when init network:", error);
            }
        };

        const subscription = Network.addNetworkStateListener((networkData) => {
            console.log("Connection change:", networkData);
            setActiveNetworkStatus((prevState) => ({
                ...prevState,
                ...networkData,
            }));
        });

        initializeNetwork();

        return () => {
            if (subscription && subscription.remove) {
                subscription.remove();
            }
        };
    }, [setActiveNetworkStatus]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ErrorBoundary>
                <NavigationContainer theme={THEMES_ASSOCIATIONS[activeMode]}>
                    {isBooting ? (
                        <SplashScreen />
                    ) : isAuthenticated ? (
                        <MainLayout>
                            <Client />
                        </MainLayout>
                    ) : (
                        <Auth />
                    )}
                </NavigationContainer>
                <NetworkBanner />
                <ErrorToast />
            </ErrorBoundary>
        </GestureHandlerRootView>
    );
}

