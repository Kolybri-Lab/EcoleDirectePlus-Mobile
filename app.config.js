const APP_ENV = process.env.APP_ENV || process.env.EAS_BUILD_PROFILE || "production";

const IS_DEV = APP_ENV === "development" || APP_ENV === "dev" || APP_ENV === "build";
const IS_PREVIEW = APP_ENV === "preview";

const getAppName = () => {
    if (IS_DEV) return "Ecole Directe Plus (Dev)";
    if (IS_PREVIEW) return "Ecole Directe Plus (Preview)";
    return "Ecole Directe Plus";
};

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return {
            android: "com.as2pick.ecoledirecteplus.dev",
            ios: "com.as2pick.EcoleDirectePlusMobileEPO.dev",
        };
    }
    if (IS_PREVIEW) {
        return {
            android: "com.as2pick.ecoledirecteplus.preview",
            ios: "com.as2pick.EcoleDirectePlusMobileEPO.preview",
        };
    }
    return {
        android: "com.as2pick.ecoledirecteplus",
        ios: "com.as2pick.EcoleDirectePlusMobileEPO",
    };
};

const getScheme = () => {
    if (IS_DEV) return "ecoledirecteplus-dev";
    if (IS_PREVIEW) return "ecoledirecteplus-preview";
    return "ecoledirecteplus";
};

const identifiers = getUniqueIdentifier();

export default {
    expo: {
        name: getAppName(),
        slug: "ecoledirecteplus-mobile",
        sdkVersion: "54.0.0",
        extra: {
            eas: {
                projectId: "9b9101a7-7d93-4cd9-b9ba-d3149e8b3401",
            },
        },
        scheme: getScheme(),
        plugins: [
            "expo-dev-client",
            "expo-secure-store",
            "expo-font",
            "expo-splash-screen",
        ],

        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icons/icon.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        platforms: ["android", "ios"],
        splash: {
            image: "./assets/icons/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#181829",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: identifiers.ios,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            },
        },
        android: {
            package: identifiers.android,
            adaptiveIcon: {
                foregroundImage: "./assets/icons/colored-icon.png",
                monochromeImage: "./assets/icons/monochromatic-icon.png",
                backgroundColor: "#181829",
                predictiveBackGestureEnabled: true,
            },
        },

        owner: "as2pick",
        githubUrl: "https://github.com/as2pick/EcoleDirectePlus-Mobile",
    },
};

