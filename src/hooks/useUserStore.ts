import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserPreferences, UserProfile } from "../types";

const storage = createMMKV({ id: "user-store" });

const mmkvStorage = createJSONStorage(() => ({
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
}));

type DataPreferenceKey = keyof UserPreferences["dataPreferences"];

interface UserStoreState {
    profile: UserProfile | null;
    preferences: UserPreferences | null;
    token: string | null;

    setProfile: (profile: UserProfile | null) => void;
    setToken: (token: string | null) => void;

    setDataPreference: (key: DataPreferenceKey, value: boolean) => void;
    setPreferences: (preferences: Partial<UserPreferences>) => void;
    reset: () => void;
}
const DEFAULT_PREFERENCES: UserPreferences = {
    theme: "dark",
    isFollowingSystem: false,
    dataPreferences: {
        sendData: "only_things",
        osInfo: false,
        modelInfo: false,
        screenInfo: true,
    },
};

export const useUserStore = create<UserStoreState>()(
    persist(
        (set) => ({
            profile: null,
            preferences: DEFAULT_PREFERENCES,
            token: null,

            setProfile: (profile) => set({ profile }),
            setToken: (token) => set({ token }),
            setDataPreference: (key, value) =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        dataPreferences: {
                            ...state.preferences.dataPreferences,
                            [key]: value,
                        },
                    },
                })),

            setPreferences: (partial) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...partial },
                })),
            reset: () => set({ profile: null, token: null }),
        }),
        {
            name: "user-store",
            storage: mmkvStorage,
            partialize: (state) => ({
                profile: state.profile,
                preferences: state.preferences,
            }),
        }
    )
);
