import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

export const THEMES = {
    opulent: {
        isDark: false, // ou true si tu veux une version sombre
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            background: {
                //gradient: ["rgba(169, 169, 255, 1)", "rgba(230, 230, 255, 1)"], // App backround gradient
                gradient: "rgba(222, 222, 250, 1)",
                login: "rgba(230, 230, 255, 1)", // Login screen background
            },
            bg: {
                bg1: "rgba(35, 35, 207, 1)", // DON'T USE IT
                bg2: "rgba(255, 255, 255, 1)", // DON'T USE IT
                bg3: "rgba(26, 26, 151, 1)", // DON'T USE IT
                bg4: "rgba(148, 148, 255, 1)", // DON'T USE IT
                bg5: "rgba(148, 148, 255, 1)", // DON'T USE IT
                bg6: "rgba(35, 35, 207, 1)", // DON'T USE IT
            },
            txt: {
                txt1: "rgb(0, 0, 0)", // DON'T USE IT
                txt2: "rgba(26, 26, 151, 1)", // DON'T USE IT
                txt3: "rgba(35, 35, 207, 1)", // DON'T USE IT
            },
            navbar: {
                active_icon: "rgba(126, 126, 255, 1)", // DON'T USE IT
                active_icon_bg: "rgba(96, 96, 192, 1)", // DON'T USE IT
                icons_bg: "rgba(126, 126, 255, 1)", // DON'T USE IT
                background: "rgba(148, 148, 255, 1)", // DON'T USE IT
                border: "rgba(126, 126, 255, 1)", // DON'T USE IT
            },
            border: "rgb(80, 80, 214)", // DON'T USE IT
            error: "rgb(240, 90, 90)",
            fond: ["rgba(222, 222, 250, 1)", "rgba(222, 222, 250, 1)"], // DON'T USE IT
            pastel: "rgb(222, 222, 250)",
            secondary: "rgb(180, 180, 253)",
            main: "rgb(119, 119, 247)",
            inactive: "rgb(140, 140, 215)",
            accent: "rgb(62, 62, 221)",
            contrast: "rgb(0, 0, 0)",
            case: "rgb(255, 255, 255)",
            theme: "rgb(255, 255, 255)",
            edplogo: {
                c1: "#6691fcff",
                c2: "#8572ffff",
            },
            edptext: ["rgb(158, 164, 215)", "rgb(83, 98, 215)"],
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
        shadow: {
            oppacity: 0.14,
            //color: "rgb(0, 0, 0)",
        },
    },
    etheral: {
        //dark
        isDark: true,
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            // background: "rgb(18, 18, 138)", // default key
            background: {
                gradient: ["rgb(35, 20, 130)", "rgb(10, 10, 30)", 0.28], //rgb(10, 10, 30)
                login: "rgb(19, 19, 34)",
            },
            bg: {
                bg1: "rgb(25, 25, 56)", // DON'T USE IT
                bg2: "rgb(19, 19, 34)", // DON'T USE IT
                bg3: "rgb(94, 94, 136)", // DON'T USE IT
                bg4: "rgb(50, 50, 87)", // DON'T USE IT
                bg5: "rgb(197, 197, 247)", // DON'T USE IT
                bg6: "rgb(64, 64, 130)", // DON'T USE IT
            },
            txt: {
                txt1: "rgb(255, 255, 255)", // DON'T USE IT
                txt2: "rgb(109, 106, 251)", // DON'T USE IT
                txt3: "rgb(180, 180, 240)", // DON'T USE IT
            },
            navbar: {
                active_icon_bg: "rgb(34, 34, 52)", // DON'T USE IT
                icons_bg: "rgb(17, 17, 38)", // DON'T USE IT
                background: "rgb(12, 12, 32)", // DON'T USE IT
                border: "rgb(23, 23, 41)", // DON'T USE IT
            },

            border: "rgb(92, 113, 250)", // DON'T USE IT
            error: "rgb(240, 90, 90)",
            fond: "#0E101A",
            pastel: "rgb(21, 25, 69)",
            secondary: "rgb(31, 30, 60)",
            main: "rgb(97, 129, 255)",
            inactive: "rgb(118, 125, 211)",
            accent: "rgb(199, 204, 253)",
            case: "rgb(94, 94, 136)",
            contrast: "rgb(255, 255, 255)",
            theme: "rgba(0, 0, 0, 1)",
            edplogo: {
                c1: "#B4C9FF",
                c2: "#C1B7FF",
            },
            edptext: ["rgb(186, 193, 255)", "rgb(77, 85, 149)"],
        },
        fonts: {
            bold: { fontFamily: "Luciole-Regular", fontWeight: "600" },
            heavy: { fontFamily: "Luciole-Regular", fontWeight: "700" },
            medium: { fontFamily: "Luciole-Regular", fontWeight: "normal" },
            regular: { fontFamily: "Lexend-Regular", fontWeight: "normal" },
        },
        shadow: {
            oppacity: 0.3,
            //color: "rgb(255, 255, 255)",
        },
    },
};

export const THEMES_ASSOCIATIONS = {
    light: THEMES.opulent,
    dark: THEMES.etheral,
};
export const THEME_KEY = "@user_theme";
export const SYSTEM_FOLLOW_KEY = "@follow_system_theme";

