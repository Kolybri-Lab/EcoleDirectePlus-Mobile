import { useQuery } from "@tanstack/react-query";
import timetableResolver from "@/features/timetable/resolver/timetable";
import { TimetableDay } from "../types";

export function useTimetable(token: string, offset: number = 0) {
    const query = useQuery<TimetableDay[]>({
        queryKey: ["timetable", offset],
        queryFn: () => timetableResolver({ token, offset }) as Promise<TimetableDay[]>,
        enabled: Boolean(token),
    });

    return {
        ...query,
        data: query.data ?? [],
    };
}
