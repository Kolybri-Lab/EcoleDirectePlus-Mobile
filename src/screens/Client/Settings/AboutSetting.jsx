import SettingSectionLayout from "./components/SettingSectionLayout";

export default function AboutScreen({ route }) {
    const { label } = route.params;
    return <SettingSectionLayout label={label}></SettingSectionLayout>;
}
