import createScreen from "@/router/helpers/createScreen";
import AboutScreen from "@/screens/Client/Settings/AboutSetting";
import AccountScreen from "@/screens/Client/Settings/AccountSetting";
import DataAndConfidentialityScreen from "@/screens/Client/Settings/DataAndConfidentialitySetting";
import ReleaseInfosScreen from "@/screens/Client/Settings/ReleaseNotesSetting";
import SettingsScreen from "@/screens/Client/Settings/SettingsScreen";
import ThemeScreen from "@/screens/Client/Settings/ThemeSetting";
import { routesNames } from "../../../config/routesNames";

const {
    settings: {
        home,
        account_settings: { account, data_and_confidentiality },
        app_settings: { theme },
        about_settings: { release_notes, about },
    },
} = routesNames;

const settingsClientScreen = [
    createScreen(home, SettingsScreen),
    createScreen(account, AccountScreen),
    createScreen(data_and_confidentiality, DataAndConfidentialityScreen),
    createScreen(theme, ThemeScreen),
    createScreen(release_notes, ReleaseInfosScreen),
    createScreen(about, AboutScreen),
];

export default settingsClientScreen;
