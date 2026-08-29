import SettingSectionLayout from "./components/SettingSectionLayout";

export default function ReleaseNotesScreen({ route }) {
    const { label } = route.params;

    return <SettingSectionLayout label={label}></SettingSectionLayout>;
}
