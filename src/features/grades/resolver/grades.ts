import { useColorStore } from "@/hooks/useColorStore";
import fetchApi from "@/services/fetchApi";
import { FetchApiResponse } from "@/types";
import { isInDateInterval } from "@/utils/date";
import base64Handler from "@/utils/handleBase64";
import Discipline from "../models/Discipline";
import {
    ApiDiscipline,
    ApiGrade,
    ApiGradesResponse,
    ApiPeriod,
    FormattedGrade,
    FormattedPeriod,
    ResolvedGrades,
} from "../types";
import { parseNumber } from "../utils/averages";
import { streakDataInjectedIntoGrades } from "../utils/streaks";

const skillColorsCodes: Record<string, string> = {
    "1": "red",
    "2": "orange",
    "3": "paleGreen",
    "4": "green",
};

export default async function gradesResolver(
    token: string
): Promise<ResolvedGrades | Record<string, never>> {
    const gradesResponse = await fetchApi<FetchApiResponse<ApiGradesResponse>>(
        "https://api.ecoledirecte.com/v3/eleves/{USER_ID}/notes.awp?verbe=get&{API_VERSION}",
        {
            headers: { "X-Token": token },
            method: "POST",
            body: {
                anneeScolaire: "",
            },
        }
    );
    if (!gradesResponse || gradesResponse.isDataEmpty) {
        return {};
    }
    const grades = gradesResponse.data;
    const activePeriod = extractActivePeriod(grades.periodes);
    const periodsObj = (grades.periodes || []).reduce<
        Record<string, FormattedPeriod>
    >((acc, period) => {
        if (period.annuel) return acc;

        const groups: Array<any> = [];
        let currentGroup: any = null;

        const disciplinesList = period.ensembleMatieres?.disciplines || [];
        const standaloneSubjects: Array<any> = [];

        for (const disciplineRaw of disciplinesList) {
            const discipline = parseDiscipline(disciplineRaw);

            if (discipline.isDisciplineGroup) {
                delete (discipline as any).code;
                delete (discipline as any).coef;

                currentGroup = {
                    ...discipline,
                    disciplines: [],
                    disciplineCodes: [],
                };

                groups.push(currentGroup);
            } else if (currentGroup) {
                currentGroup.disciplines.push(discipline);
                currentGroup.disciplineCodes.push(discipline.code);
            } else {
                standaloneSubjects.push(discipline);
            }
        }

        if (standaloneSubjects.length > 0) {
            groups.push({
                libelle: "Matières",
                isDisciplineGroup: true,
                averageDatas: {
                    classAverage: null,
                    minAverage: null,
                    maxAverage: null,
                    userAverage: null,
                },
                disciplines: standaloneSubjects,
                disciplineCodes: standaloneSubjects.map((s) => s.code),
            });
        }

        acc[period.codePeriode] = {
            globalStreakScore: undefined,
            groups,
            periodName: period.periode,
        };
        return acc;
    }, {});

    const rawNotes = grades.notes || [];

    Object.entries(periodsObj).forEach(([periodCode, periodData]) => {
        periodData.groups = periodData.groups.map((group: any) => {
            if (group.isDisciplineGroup) {
                group.disciplines = group.disciplines.map((discipline: any) => {
                    return enrichDiscipline(
                        discipline,
                        periodCode,
                        rawNotes
                    );
                });
                group.averageDatas.userAverage = new Discipline(
                    group
                ).getDisciplineGroupAverage();
                return group;
            } else {
                return enrichDiscipline(group, periodCode, rawNotes);
            }
        });
    });

    const result = streakDataInjectedIntoGrades(periodsObj) as any;

    const lastGrades = getLatestGrades(grades.notes || [], 10);

    Object.defineProperty(result, "lastGrades", {
        value: lastGrades,
        enumerable: true,
        writable: true,
        configurable: true,
    });

    return { ...result, activePeriod } as ResolvedGrades;
}
const extractActivePeriod = (periods: ApiPeriod[]) => {
    const date = new Date();
    const todaysDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const validPeriods = periods.filter(({ annuel, dateDebut, dateFin }) => {
        if (annuel) return false;
        return isInDateInterval(todaysDate, dateDebut, dateFin) === true;
    });
    if (validPeriods.length === 0) {
        if (periods.length === 0) return null;
        const { codePeriode: periodCode, periode: periodName } = periods[0];
        return { periodCode, periodName };
    }
    const nonClosedPeriods = validPeriods.find(({ cloture }) => !cloture);
    if (!nonClosedPeriods) {
        const { codePeriode: periodCode, periode: periodName } = validPeriods[0];

        return { periodCode, periodName };
    }
    const { codePeriode: periodCode, periode: periodName } = nonClosedPeriods;
    return { periodCode, periodName };
};

function parseDiscipline(discipline: ApiDiscipline) {
    const teachersWithoutId = (discipline.professeurs || []).map(({ nom }) => nom);

    const obj = {
        code: discipline.codeMatiere,
        libelle: discipline.discipline,
        color: useColorStore.getState().getOrAssignColor(discipline.codeMatiere),
        averageDatas: {
            classAverage: parseNumber(discipline.moyenneClasse),
            minAverage: parseNumber(discipline.moyenneMin),
            maxAverage: parseNumber(discipline.moyenneMax),
            userAverage: null as number | null,
        },
        coef: discipline.coef,
        isDisciplineGroup: discipline.groupeMatiere,
        workforce: discipline.effectif,
        rank: discipline.rang,
        teachers: teachersWithoutId,
    };

    return obj;
}

function formatGrade(grade: ApiGrade, periodCode: string): FormattedGrade {
    const {
        codeMatiere,
        codePeriode,
        devoir,
        libelleMatiere,
        date,
        coef,
        noteSur,
        valeur,
        nonSignificatif,
        moyenneClasse,
        minClasse,
        maxClasse,
        elementsProgramme,
        typeDevoir,
    } = grade;

    const formatted: any = {
        libelle: devoir,
        notSignificant: nonSignificatif,
        date,
        isExam: codePeriode.includes("X"),
        homeworkType: typeDevoir,
        disciplineName: libelleMatiere,
        codes: {
            period: codePeriode,
            discipline: codeMatiere,
        },
        data: {
            coef: parseFloat(coef),
            classAverage: parseNumber(moyenneClasse),
            outOf: parseNumber(noteSur),
            classMax: parseNumber(maxClasse),
            classMin: parseNumber(minClasse),
            grade: parseNumber(valeur),
        },
        skills: (elementsProgramme || []).map(
            ({ descriptif, valeur, libelleCompetence }) => ({
                name: libelleCompetence,
                description: descriptif,
                value: skillColorsCodes[String(valeur)] || null,
            })
        ),
        onlySkills:
            (valeur == null || valeur === undefined) &&
            (elementsProgramme || []).length > 0,

        actionOnStreak: undefined,
        badges: [],
    };

    return formatted as FormattedGrade;
}

function getGradesForDiscipline(
    { periodCode, disciplineCode }: { periodCode: string; disciplineCode: string },
    rawGrades: ApiGrade[]
): ApiGrade[] {
    return rawGrades.filter(
        ({ codePeriode, codeMatiere }) =>
            codePeriode.includes(periodCode) && codeMatiere === disciplineCode
    );
}

function enrichDiscipline(
    discipline: any,
    periodCode: string,
    rawGrades: ApiGrade[]
) {
    const gradesList = getGradesForDiscipline(
        { disciplineCode: discipline.code, periodCode },
        rawGrades
    );

    const formattedGrades = gradesList.map((grade) =>
        formatGrade(grade, periodCode)
    );

    const enrichedDiscipline = {
        ...discipline,
        grades: formattedGrades,
        averageDatas: {
            ...discipline.averageDatas,
        },
    };

    enrichedDiscipline.averageDatas.userAverage = new Discipline(
        enrichedDiscipline
    ).getWeightedAverage();
    return enrichedDiscipline;
}

export function getLatestGrades(rawNotes: ApiGrade[], limit = 5): any[] {
    if (!Array.isArray(rawNotes)) return [];

    return rawNotes
        .filter((note) => note.date)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit)
        .map((note) => {
            return {
                libelle: note.devoir,
                date: note.date,
                disciplineName: note.libelleMatiere,
                disciplineColor: useColorStore
                    .getState()
                    .getOrAssignColor(note.codeMatiere),
                codes: {
                    period: note.codePeriode,
                    discipline: note.codeMatiere,
                },
                data: {
                    coef: parseFloat(note.coef),
                    grade: parseNumber(note.valeur),
                    outOf: parseNumber(note.noteSur),
                },
            };
        });
}

