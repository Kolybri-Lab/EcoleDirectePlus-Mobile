import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import mapScreens from "@/router/helpers/mapScreens";
import { NavigationBottomBar } from "../../../../components";
import { routesNames } from "../../../config/routesNames";
import tabClientScreens from "./indexClientTabs";

const Tab = createBottomTabNavigator();

export default function Tabs() {
    const screens = mapScreens({ navMethod: Tab, screenArray: tabClientScreens });

    return (
        <Tab.Navigator
            tabBar={(props) => <NavigationBottomBar {...props} />}

            initialRouteName={routesNames.client.home}
            screenOptions={{
                headerShown: false,
                animation: "fade",
                lazy: false,
                tabBarStyle: { backgroundColor: "transparent" },
            }}
        >
            {screens}
        </Tab.Navigator>
    );
}
