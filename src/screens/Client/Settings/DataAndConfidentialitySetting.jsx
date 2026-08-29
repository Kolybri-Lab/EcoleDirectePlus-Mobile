import SettingSectionLayout from "./components/SettingSectionLayout";

export default function DataAndConfidentialityScreen({ route }) {
    const { label } = route.params;

    return <SettingSectionLayout label={label}></SettingSectionLayout>;
}
