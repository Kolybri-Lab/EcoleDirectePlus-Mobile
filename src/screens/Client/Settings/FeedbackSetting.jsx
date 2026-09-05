import SettingSectionLayout from "./components/SettingSectionLayout";

export default function FeedbackScreen({ route }) {
    const { label } = route.params;

    return <SettingSectionLayout label={label}></SettingSectionLayout>;
}
