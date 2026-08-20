import createScreen from "@/router/helpers/createScreen";
import { routesNames } from "../../config/routesNames";
import Core from "./core/Core";
import Tabs from "./tabs/Tabs";

const {
    navigators: { core, tabs },
} = routesNames;

const appNavigatorOrganisation = [
    createScreen(tabs, Tabs), // PAY ATTENTION TO THE ORDER !
    createScreen(core, Core),
];

export default appNavigatorOrganisation;
