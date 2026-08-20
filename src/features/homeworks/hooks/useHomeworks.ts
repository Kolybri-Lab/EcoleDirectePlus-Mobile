import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import homeworksResolver, {
    toggleHomeworkInApi,
} from "@/features/homeworks/resolver/homeworks";
import { ResolvedHomeworks } from "../types";

export function useHomeworks(token: string) {
    const queryClient = useQueryClient();

    const query = useQuery<ResolvedHomeworks>({
        queryKey: ["homeworks"],
        queryFn: () => homeworksResolver({ token }) as Promise<ResolvedHomeworks>,
        enabled: Boolean(token),
    });

    const mutation = useMutation<
        void,
        Error,
        { id: number; state: boolean },
        { previousHomeworks: ResolvedHomeworks | undefined }
    >({
        mutationFn: ({ id, state }) =>
            toggleHomeworkInApi({ token, id, state }),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ["homeworks"] });
            const previousHomeworks = queryClient.getQueryData<ResolvedHomeworks>(["homeworks"]);

            if (previousHomeworks) {
                const updatedHomeworks = JSON.parse(
                    JSON.stringify(previousHomeworks)
                ) as ResolvedHomeworks;
                for (const date of Object.keys(updatedHomeworks)) {
                    if (date === "formatedDates") continue;
                    const dayHomeworks = updatedHomeworks[date];
                    if (Array.isArray(dayHomeworks)) {
                        updatedHomeworks[date] = dayHomeworks.map(
                            (hw) => {
                                if (hw.id === id) {
                                    const nextIsDone =
                                        hw.isDone === "done" ? "todo" : "done";
                                    return {
                                        ...hw,
                                        isDone: nextIsDone,
                                        loadingState: "loading",
                                    };
                                }
                                return hw;
                            }
                        );
                    }
                }
                queryClient.setQueryData(["homeworks"], updatedHomeworks);
            }

            return { previousHomeworks };
        },
        onError: (err, variables, context) => {
            const { id } = variables;
            const previousHomeworks = context?.previousHomeworks;

            if (previousHomeworks) {
                const updatedHomeworks = JSON.parse(
                    JSON.stringify(previousHomeworks)
                ) as ResolvedHomeworks;
                for (const date of Object.keys(updatedHomeworks)) {
                    if (date === "formatedDates") continue;
                    const dayHomeworks = updatedHomeworks[date];
                    if (Array.isArray(dayHomeworks)) {
                        updatedHomeworks[date] = dayHomeworks.map(
                            (hw) => {
                                if (hw.id === id) {
                                    return { ...hw, loadingState: "error" };
                                }
                                return hw;
                            }
                        );
                    }
                }
                queryClient.setQueryData(["homeworks"], updatedHomeworks);

                setTimeout(() => {
                    queryClient.setQueryData(["homeworks"], previousHomeworks);
                    queryClient.invalidateQueries({ queryKey: ["homeworks"] });
                }, 3000);
            }
        },
        onSettled: (data, error) => {
            if (!error) {
                queryClient.invalidateQueries({ queryKey: ["homeworks"] });
            }
        },
    });

    return {
        ...query,
        data: query.data ?? ({} as ResolvedHomeworks),
        toggleHomework: mutation.mutate,
    };
}
