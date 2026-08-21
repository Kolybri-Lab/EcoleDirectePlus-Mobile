import { CONFIG } from "@/constants/config";
import fetchApi from "@/services/fetchApi";
import { addDaysToDateString, getPreviousMonday } from "@/utils/date";
import { sortedTimetable } from "../utils/layout";
import { fillHolidays } from "../utils/holidays";
import { FetchApiResponse } from "@/types";
import { TimetableDay, ApiTimetableCourse, TimetableResolverParams } from "../types";

export default async function timetableResolver({
    token,
    offset = 0,
}: TimetableResolverParams): Promise<TimetableDay[]> {
    const baseMonday = getPreviousMonday(CONFIG.dateNow);
    const requestedMonday = addDaysToDateString(baseMonday, offset * 7);

    const requestedSunday = addDaysToDateString(requestedMonday, 6);

    const timetableResponse = await fetchApi<FetchApiResponse<ApiTimetableCourse[]>>(
        `https://api.ecoledirecte.com/v3/E/{USER_ID}/emploidutemps.awp?verbe=get&{API_VERSION}`,
        {
            body: {
                dateDebut: requestedMonday,
                dateFin: requestedSunday,
                avecTrous: false,
            },
            headers: {
                "X-Token": token,
            },
            method: "POST",
        }
    );

    if (timetableResponse?.isDataEmpty) {
        return [];
    }

    return !timetableResponse
        ? (fillHolidays(requestedMonday, requestedSunday) as any)
        : await sortedTimetable(timetableResponse.data);
}
