import {
    Dashboard,
    Grades,
    Homeworks,
    Messaging,
    Timetable,
} from "@/components/svg/navigation";
import createScreen from "@/router/helpers/createScreen";
import GradesScreen from "@/screens/Client/Grades/GradesScreen";
import HomeScreen from "@/screens/Client/Home/HomeScreen";
import HomeworksScreen from "@/screens/Client/Homeworks/HomeworksScreen";
import MessagingScreen from "@/screens/Client/Messaging/MessagingScreen";
import TimetableScreen from "@/screens/Client/Timetable/TimetableScreen";
import { routesNames } from "../../../config/routesNames";

const {
    client: { grades, home, homeworks, messaging, timetable },
    navigators: { settings },
} = routesNames;

const tabClientScreens = [
    createScreen(grades.group, GradesScreen, {
        inNavbar: true,
        icon: Grades,
    }),
    createScreen(homeworks.group, HomeworksScreen, {
        inNavbar: true,
        icon: Homeworks,
    }),
    createScreen(home, HomeScreen, {
        inNavbar: true,
        icon: Dashboard,
    }),
    createScreen(timetable.group, TimetableScreen, {
        inNavbar: true,
        icon: Timetable,
    }),
    createScreen(messaging.group, MessagingScreen, {
        inNavbar: true,
        icon: Messaging,
    }),
];

export default tabClientScreens;
