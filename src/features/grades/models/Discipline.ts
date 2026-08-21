import { FormattedDiscipline, FormattedGrade, GradeAverageDatas } from "../types";
import { parseNumber } from "../utils/averages";
import { objectsEqual } from "@/utils/json";
import Grade from "./Grade";

export default class Discipline {
    code: string;
    libelle: string;
    averageDatas: GradeAverageDatas;
    coef: number;
    grades: FormattedGrade[];
    streakCount: number;
    isDisciplineGroup: boolean;
    workforce: number;
    rank: number;
    teachers: string[];
    disciplines?: FormattedDiscipline[];
    disciplineCodes?: string[];
    simulatedGrades: FormattedGrade[];
    color: string;

    constructor(data: any) {
        this.code = data.code || "";
        this.libelle = data.libelle || "";
        this.color = data.color;
        this.averageDatas = data.averageDatas || {
            classAverage: null,
            minAverage: null,
            maxAverage: null,
            userAverage: null,
        };
        this.coef = data.coef || 0;
        this.grades = data.grades || [];
        this.streakCount = data.streakCount || 0;
        this.isDisciplineGroup = data.isDisciplineGroup || false;
        this.workforce = data.workforce || 0;
        this.rank = data.rank || 0;
        this.teachers = data.teachers || [];
        this.disciplines = data.disciplines;
        this.disciplineCodes = data.disciplineCodes;
        this.simulatedGrades = data.simulatedGrades || [];
    }

    getDiscipline() {
        return {
            code: this.code,
            libelle: this.libelle,
            averageDatas: this.averageDatas,
            coef: this.coef,
            grades: this.grades,
            streakCount: this.streakCount,
            isDisciplineGroup: this.isDisciplineGroup,
            workforce: this.workforce,
            rank: this.rank,
            teachers: this.teachers,
            disciplines: this.disciplines,
            disciplineCodes: this.disciplineCodes,
            simulatedGrades: this.simulatedGrades,
            color: this.color,
        };
    }

    getTotalCoef(): number {
        return this.grades.reduce((sum, evaluation) => {
            const { notSignificant, data } = evaluation;
            if (!data) return sum;
            const { coef, grade, outOf } = data;

            if (
                notSignificant ||
                grade === null ||
                isNaN(grade) ||
                outOf === 0 ||
                outOf === null ||
                isNaN(outOf) ||
                coef === 0 ||
                coef === null ||
                isNaN(coef)
            ) {
                return sum;
            }

            return sum + coef;
        }, 0);
    }

    getWeightedAverage(): number | null {
        let totalWeightedScore = 0;
        let totalCoef = 0;

        const allGrades = [...this.grades, ...(this.simulatedGrades || [])];

        allGrades.forEach((evaluation) => {
            const { notSignificant, data } = evaluation;
            if (!data) return;
            const { grade, outOf, coef } = data;

            if (
                notSignificant ||
                grade === null ||
                grade === undefined ||
                isNaN(Number(grade)) ||
                outOf === 0 ||
                outOf === null ||
                outOf === undefined ||
                isNaN(Number(outOf)) ||
                coef === null ||
                coef === undefined ||
                isNaN(Number(coef))
            ) {
                return;
            }

            const numCoef = Number(coef);
            if (numCoef <= 0) {
                return;
            }

            const numGrade = Number(grade);
            const numOutOf = Number(outOf);

            const normalizedGrade = (numGrade / numOutOf) * 20;

            totalWeightedScore += normalizedGrade * numCoef;
            totalCoef += numCoef;
        });

        if (totalCoef === 0) return null;

        return parseNumber(totalWeightedScore / totalCoef);
    }

    getDisciplineGroupAverage(): number | null {
        if (!this.disciplines || this.disciplines.length === 0) return null;

        let totalWeighted = 0;
        let totalCoef = 0;
        let sumSimpleAverage = 0;
        let countValidDisciplines = 0;

        this.disciplines.forEach((item) => {
            const disciplineObj = new Discipline(item);
            const userAverage =
                item.averageDatas?.userAverage ?? disciplineObj.getWeightedAverage();

            if (
                userAverage !== null &&
                userAverage !== undefined &&
                !isNaN(userAverage)
            ) {
                const rawCoef = item.coef;
                const coef =
                    typeof rawCoef === "number" && !isNaN(rawCoef) ? rawCoef : 1;

                if (coef > 0) {
                    totalWeighted += userAverage * coef;
                    totalCoef += coef;
                }

                sumSimpleAverage += userAverage;
                countValidDisciplines += 1;
            }
        });

        if (totalCoef > 0) {
            return parseNumber(totalWeighted / totalCoef);
        }

        if (countValidDisciplines > 0) {
            return parseNumber(sumSimpleAverage / countValidDisciplines);
        }

        return null;
    }

    injectGrade(gradeToInject: FormattedGrade) {
        this.grades = [...this.grades, gradeToInject];
    }

    removeGrade(gradeToRemove: FormattedGrade) {
        this.grades = this.grades.filter(
            (g) => !objectsEqual(new Grade(g).getGrade(), gradeToRemove)
        );
    }
}

