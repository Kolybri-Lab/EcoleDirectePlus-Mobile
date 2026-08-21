import { DropDownMenu, Text } from "@/components";
import { useThemeStore } from "@/hooks/useThemeStore";
import { SafeAreaView } from "react-native-safe-area-context";

const THEMES_OPT = [
    { id: "dark", name: "Sombre" },
    { id: "light", name: "Clair" },
];

export default function ThemeScreen() {
    const themeMode = useThemeStore((state) => state.themeMode);
    const setThemeMode = useThemeStore((state) => state.setThemeMode);
    const followSystem = useThemeStore((state) => state.followSystem);
    const setFollowSystem = useThemeStore((state) => state.setFollowSystem);
    return (
        <SafeAreaView>
            <Text>{followSystem}</Text>
            <DropDownMenu
                options={THEMES_OPT}
                value={THEMES_OPT.find(({ id }) => id === themeMode)}
                onSelect={(value) => setThemeMode(value.id)}
            />
        </SafeAreaView>
    );
}
