import { useQueries } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import timetableResolver from "@/features/timetable/resolver/timetable";
import { TimetableDay } from "../types";

export function useTimetable(token: string) {
    const [range, setRange] = useState({ min: -1, max: 1 });

    const resetRange = useCallback(() => {
        setRange({ min: -1, max: 1 });
    }, []);

    const offsets = useMemo(() => {
        const arr: number[] = [];
        for (let i = range.min; i <= range.max; i++) arr.push(i);
        return arr;
    }, [range.min, range.max]);

    const queries = useQueries({
        queries: offsets.map((offset) => ({
            queryKey: ["timetable", offset] as const,
            queryFn: () => timetableResolver({ token, offset }) as Promise<TimetableDay[]>,
            enabled: Boolean(token),
        })),
    });

    const dataUpdatedAtKey = queries.map((q) => q.dataUpdatedAt).join(",");

    const allDays = useMemo(() => {
        const days = queries.flatMap((q) => q.data ?? []);
        const seen = new Set<string>();
        return days
            .filter((d) => {
                if (seen.has(d.date)) return false;
                seen.add(d.date);
                return true;
            })
            .sort((a, b) => a.date.localeCompare(b.date));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataUpdatedAtKey]);

    const firstQueryLoading = queries[0]?.isLoading ?? false;
    const lastQueryLoading = queries[queries.length - 1]?.isLoading ?? false;

    const extendForward = useCallback(() => {
        if (lastQueryLoading) return;
        setRange((r) => ({ ...r, max: r.max + 1 }));
    }, [lastQueryLoading]);

    const extendBackward = useCallback(() => {
        if (firstQueryLoading) return;
        setRange((r) => ({ ...r, min: r.min - 1 }));
    }, [firstQueryLoading]);

    return {
        data: allDays,
        extendForward,
        extendBackward,
        resetRange,
        isLoading: queries.some((q) => q.isLoading),
        isError: queries.some((q) => q.isError),
        range,
    };
}
