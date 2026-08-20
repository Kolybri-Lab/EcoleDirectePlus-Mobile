import mapScreens from "@/router/helpers/mapScreens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routesNames } from "../../../config/routesNames";
import coreClientScreen from "./indexClientCore";

const Stack = createNativeStackNavigator();

export default function Core() {
    const screens = mapScreens({ navMethod: Stack, screenArray: coreClientScreen });

    return (
        <Stack.Navigator
            initialRouteName={routesNames.core.settings}
            screenOptions={{ animation: "slide_from_bottom" }}
        >
            {screens}
        </Stack.Navigator>
    );
}
