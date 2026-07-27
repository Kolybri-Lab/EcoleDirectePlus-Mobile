import { useAuthStore } from "@/hooks/useAuthStore";
import authService from "@/services/login/authService";
import storeDatas from "@/services/login/tools/storeLoginDatas";
import dayjs from "dayjs";

import { GUEST_CREDENTIALS } from "@/constants/config";
import mockGrades from "./grades.json";
import mockHomeworks from "./homeworks.json";
import mockHomeworksPreciseDay from "./homeworks_precise_day.json";
import mockLogin from "./login.json";
import mockMessageDetail from "./message_detail.json";
import mockMessagesFolder from "./messages_folder.json";
import mockMessagesReceivedPage1 from "./messages_received_page1.json";
import mockMessagesReceivedPage2 from "./messages_received_page2.json";
import mockMessagesReceivedPage3 from "./messages_received_page3.json";
import mockTimetable from "./timetable.json";

export const getGuestData = (url: string, body?: any): any => {
    const messageDetailMatch = url.match(/\/messages\/(\d+)\.awp/);
    const dateRegex = /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;
    const pageMatch = url.match(/[?&]page=(\d+)/);
    const requestedPage = pageMatch ? Number(pageMatch[1]) : 0;

    if (url.includes("/notes.awp")) {
        return mockGrades;
    }

    if (url.includes("/emploidutemps.awp")) {
        return getShiftedTimetable(body?.dateDebut);
    }

    if (url.includes("/messages.awp")) {
        if (
            url.includes("typeRecuperation=classeur") &&
            url.includes("idClasseur=564")
        ) {
            return mockMessagesFolder;
        }
        if (requestedPage === 1) {
            return mockMessagesReceivedPage2;
        }
        if (requestedPage >= 2) {
            return mockMessagesReceivedPage3;
        }
        return mockMessagesReceivedPage1;
    }
    if (url.includes("/cahierdetexte.awp") && !dateRegex.test(url)) {
        return mockHomeworks;
    }
    if (url.includes("/cahierdetexte/") && dateRegex.test(url)) {
        return mockHomeworksPreciseDay;
    }

    // (messages/{messageId}.awp)
    if (messageDetailMatch) {
        const messageId = messageDetailMatch[1];
        if (messageId === "103040") {
            return mockMessageDetail;
        }
        return getGenericMessageDetail(messageId);
    }

    return null;
};

const getGenericMessageDetail = (messageId: string | number) => {
    const foundMsg =
        mockMessagesReceivedPage1?.data?.messages?.received?.find(
            (m: any) => String(m.id) === String(messageId)
        ) ||
        mockMessagesFolder?.data?.messages?.received?.find(
            (m: any) => String(m.id) === String(messageId)
        ) ||
        mockMessagesReceivedPage2?.data?.messages?.received?.find(
            (m: any) => String(m.id) === String(messageId)
        ) ||
        mockMessagesReceivedPage3?.data?.messages?.received?.find(
            (m: any) => String(m.id) === String(messageId)
        );

    return {
        code: 200,
        token: "guest_token",
        host: "HTTP200",
        message: "",
        data: {
            id: Number(messageId),
            mtype: foundMsg?.mtype || "received",
            read: true,
            idDossier: foundMsg?.idDossier ?? -1,
            idClasseur: foundMsg?.idClasseur ?? 0,
            transferred: foundMsg?.transferred ?? false,
            answered: foundMsg?.answered ?? false,
            to_cc_cci: foundMsg?.to_cc_cci || "to",
            brouillon: foundMsg?.brouillon ?? false,
            subject: foundMsg?.subject || "Message de test",
            // Base64-encoded: "Bonjour,\n\nCeci est un message de test générique pour le mode invité.\n\nCordialement."
            content:
                "Qm9uan91ciwKCkNlY2kgZXN0IHVuIG1lc3NhZ2UgZGUgdGVzdCBn6W7pcmlxdWUgcG91ciBsZSBtb2RlIGludml06S4KCkNvcmRpYWxlbWVudC4=",
            date: foundMsg?.date || "2026-06-22 10:00:00",
            to: [],
            files: [],
            from: foundMsg?.from || {
                nom: "EDP",
                prenom: "Support",
                civilite: "",
                role: "A",
                id: 999,
            },
        },
    };
};

const getShiftedTimetable = (requestedMonday?: string) => {
    if (!requestedMonday) return mockTimetable;

    const courses = mockTimetable.data || [];
    const firstCourse = courses.find((c: any) => c.start_date);
    if (!firstCourse) return mockTimetable;

    const mockFirstDate = dayjs(firstCourse.start_date.split(" ")[0]);
    const mockDayOfWeek = mockFirstDate.day();
    const daysToSubtract = mockDayOfWeek === 0 ? 6 : mockDayOfWeek - 1;
    const mockMonday = mockFirstDate.subtract(daysToSubtract, "day");

    const reqMonday = dayjs(requestedMonday);
    const diffInDays = reqMonday.diff(mockMonday, "day");

    const shiftedCourses = courses.map((course: any) => {
        if (!course.start_date || !course.end_date) return course;

        const start = dayjs(course.start_date);
        const end = dayjs(course.end_date);

        return {
            ...course,
            start_date: start.add(diffInDays, "day").format("YYYY-MM-DD HH:mm"),
            end_date: end.add(diffInDays, "day").format("YYYY-MM-DD HH:mm"),
        };
    });

    return {
        ...mockTimetable,
        data: shiftedCourses,
    };
};

export const loginAsGuest = async (keepConnected: boolean = true) => {
    const accountData = mockLogin?.data?.accounts?.[0] || {
        id: 7875,
        typeCompte: "E",
        prenom: "Invité",
        nom: "Démo",
        email: "guest@ecoledirecteplus.fr",
        nomEtablissement: "Établissement Invité",
        profile: {
            sexe: "M",
            telPortable: "0600000000",
            classe: {
                libelle: "Classe Invité",
                code: "GUEST",
            },
        },
    };

    console.log("Bienvenue dans le compte développeur");

    if (keepConnected) {
        await authService.saveCredentials("guest_token", accountData.id, {
            identifiant: GUEST_CREDENTIALS.username,
            motdepasse: GUEST_CREDENTIALS.password,
        });
    }

    storeDatas({ data: accountData, token: "guest_token" });
    useAuthStore.getState().setAuthenticated(true);
    useAuthStore.getState().setBooting(false);
};
