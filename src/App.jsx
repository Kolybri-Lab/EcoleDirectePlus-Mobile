import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import RootProviders from "./provider";
import AuthNavigator from "./router/AuthNavigator";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontLoaded] = useFonts({
        "Luciole-Regular": require("assets/fonts/Luciole-Regular.ttf"),
        "Lexend-Light": require("assets/fonts/Lexend-Light.ttf"),
        "Lexend-Regular": require("assets/fonts/Lexend-Regular.ttf"),
        "Lexend-Medium": require("assets/fonts/Lexend-Medium.ttf"),
        "Lexend-Bold": require("assets/fonts/Lexend-Bold.ttf"),
        Regular: require("assets/fonts/Baloo2-Regular.ttf"),
        Medium: require("assets/fonts/Baloo2-Medium.ttf"),
        SemiBold: require("assets/fonts/Baloo2-SemiBold.ttf"),
        Bold: require("assets/fonts/Baloo2-Bold.ttf"),
        ExtraBold: require("assets/fonts/Baloo2-ExtraBold.ttf"),
    });

    useEffect(() => {
        if (fontLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontLoaded]);
    if (!fontLoaded) return null;

    // useEffect(() => {
    //     authService.deleteStoredApiDatas();
    // }, []);
    return (
        <RootProviders>
            <AuthNavigator />
        </RootProviders>
    );
}

