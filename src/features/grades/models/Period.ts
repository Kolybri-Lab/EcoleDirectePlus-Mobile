import { parseNumber } from "../utils/averages";
import { objectsEqual } from "@/utils/json";
import Discipline from "./Discipline";
import Grade from "./Grade";
import { FormattedDiscipline, FormattedDisciplineGroup, FormattedPeriod, FormattedGrade } from "../types";

export default class Period {
    groups: (FormattedDiscipline | FormattedDisciplineGroup)[];
    periodCode: string;
    globalStreakScore: number | null;
    periodName: string | null;

    constructor(
        data: { groups: (FormattedDiscipline | FormattedDisciplineGroup)[]; globalStreakScore?: number | null; periodName?: string | null },
        periodCode: string = ""
    ) {
        this.groups = data.groups || [];
        this.periodCode = periodCode;
        this.globalStreakScore = data.globalStreakScore !== undefined ? data.globalStreakScore : null;
        this.periodName = data.periodName !== undefined ? data.periodName : null;
    }

    makeGeneralAverage(): number | null {
        const disciplines = this.groups.flatMap((group) =>
            (group as FormattedDisciplineGroup).isDisciplineGroup
                ? (group as FormattedDisciplineGroup).disciplines || []
                : [group as FormattedDiscipline]
        );

        const { total, totalCoef } = disciplines.reduce(
            (acc, discipline) => {
                const disciplineObj = new Discipline(discipline);
                const average =
                    discipline.averageDatas?.userAverage ??
                    disciplineObj.getWeightedAverage();
                const coef =
                    typeof discipline.coef === "number" && !isNaN(discipline.coef)
                        ? discipline.coef
                        : 1;

                if (average !== null && !isNaN(average) && coef > 0) {
                    acc.total += average * coef;
                    acc.totalCoef += coef;
                }

                return acc;
            },
            { total: 0, totalCoef: 0 }
        );

        const average = totalCoef === 0 ? null : total / totalCoef;

        return parseNumber(average);
    }

    makeDisciplineAverage(disciplineCode: string): number | null {
        let disciplineSearched: FormattedDiscipline | null = null;

        for (const group of this.groups) {
            const disciplines = (group as FormattedDisciplineGroup).isDisciplineGroup
                ? (group as FormattedDisciplineGroup).disciplines
                : [group as FormattedDiscipline];

            const found = disciplines.find((d) => d.code === disciplineCode);
            if (found) {
                disciplineSearched = found;
                break;
            }
        }

        if (!disciplineSearched) {
            return null;
        }

        const discipline = new Discipline(disciplineSearched);
        return discipline.getWeightedAverage();
    }

    createReferentialStreakScore(): Record<string, Record<string, number>> {
        const ref: Record<string, Record<string, number>> = {};
        const disciplines = this.groups.flatMap((group) =>
            (group as FormattedDisciplineGroup).isDisciplineGroup ? (group as FormattedDisciplineGroup).disciplines : [group as FormattedDiscipline]
        );
        ref[this.periodCode] = {};

        disciplines.forEach(({ code }) => {
            ref[this.periodCode][code] = 0;
        });

        return ref;
    }

    getPeriodDatas() {
        let infos = {
            numberOfGroups: 0,
            numberOfDisciplines: 0,
        };
        this.groups.forEach((group) => {
            if ((group as FormattedDisciplineGroup).isDisciplineGroup) {
                infos.numberOfGroups++;
                infos.numberOfDisciplines += (group as FormattedDisciplineGroup).disciplines.length;
            } else {
                infos.numberOfDisciplines += 1;
            }
        });

        return {
            periodCode: this.periodCode,
            generalAverage: this.makeGeneralAverage(),
            ...infos,
        };
    }

    injectGrade(rawGrade: FormattedGrade) {
        const grade = new Grade(rawGrade);
        const periodDisciplines = this.groups.flatMap((group) =>
            (group as FormattedDisciplineGroup).isDisciplineGroup ? (group as FormattedDisciplineGroup).disciplines : [group as FormattedDiscipline]
        );

        const discipline = periodDisciplines.find(
            ({ code }) => code === grade.codes.discipline
        );

        if (!discipline) {
            console.warn(
                `"${grade.codes.discipline}" not found in ${this.periodCode}`
            );
            return false;
        }

        if (!Array.isArray(discipline.grades)) {
            discipline.grades = [];
        }

        discipline.grades.push(grade.getGrade());
    }

    removeGrade(rawGrade: FormattedGrade) {
        const grade = new Grade(rawGrade);

        const periodDisciplines = this.groups.flatMap((group) =>
            (group as FormattedDisciplineGroup).isDisciplineGroup ? (group as FormattedDisciplineGroup).disciplines : [group as FormattedDiscipline]
        );

        const discipline = periodDisciplines.find(
            ({ code }) => code === grade.codes.discipline
        );

        if (!discipline) return;

        if (!Array.isArray(discipline.grades) || discipline.grades.length === 0) {
            console.warn(`Any grade to delete for ${discipline.code}`);
        }
        const initialLength = discipline.grades.length;
        const gradeObj = grade.getGrade();
        discipline.grades = discipline.grades.filter(
            (g) => !objectsEqual(new Grade(g).getGrade(), gradeObj)
        );

        if (discipline.grades.length === initialLength) {
            console.warn(
                `Any grades for "${grade.disciplineName}" was found for ${discipline.code}`
            );
        }
    }
}
