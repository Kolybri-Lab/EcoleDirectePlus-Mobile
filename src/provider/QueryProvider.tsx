import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createMMKV } from "react-native-mmkv";
import { useErrorStore } from "@/hooks/useErrorStore";

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onSuccess: () => {
            useErrorStore.getState().clearNetworkErrors();
        },
        onError: (error) => {
            useErrorStore.getState().pushError(error as any);
        },
    }),
    mutationCache: new MutationCache({
        onSuccess: () => {
            useErrorStore.getState().clearNetworkErrors();
        },
        onError: (error) => {
            useErrorStore.getState().pushError(error as any);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 min
            gcTime: 1000 * 60 * 60 * 14, // 14 h
            refetchOnWindowFocus: false,
            placeholderData: (previousData) => previousData,
            retry: (failureCount, error: any) => {
                if (error?.type === "auth" || error?.type === "api-business") return false;
                return failureCount < 2;
            },
        },
    },
});

const mmkv = createMMKV({ id: "query-cache" });

const mmkvPersister = createAsyncStoragePersister({
    storage: {
        getItem: (key) => mmkv.getString(key) ?? null,
        setItem: (key, value) => {
            mmkv.set(key, value);
        },
        removeItem: (key) => {
            mmkv.remove(key);
        },
    },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: mmkvPersister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
