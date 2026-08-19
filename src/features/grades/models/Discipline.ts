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
    color?: string;

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

        this.grades.forEach((evaluation) => {
            const { notSignificant, data } = evaluation;
            if (!data) return;
            const { grade, outOf, coef } = data;

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
                return;
            }

            const normalizedGrade = (grade / outOf) * 20;

            totalWeightedScore += normalizedGrade * coef;
            totalCoef += coef;
        });

        if (totalCoef === 0) return null;

        return parseNumber(totalWeightedScore / totalCoef);
    }

    getDisciplineGroupAverage(): number | null {
        if (!this.disciplines || this.disciplines.length === 0) return null;

        let total = 0;
        let totalCoef = 0;

        this.disciplines.forEach((item) => {
            const userAverage = item.averageDatas?.userAverage;
            const coef =
                typeof item.coef === "number" && !isNaN(item.coef) && item.coef > 0
                    ? item.coef
                    : 1;

            if (
                userAverage !== null &&
                userAverage !== undefined &&
                !isNaN(userAverage)
            ) {
                total += userAverage * coef;
                totalCoef += coef;
            }
        });

        if (totalCoef === 0) return null;

        return parseNumber(total / totalCoef);
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
