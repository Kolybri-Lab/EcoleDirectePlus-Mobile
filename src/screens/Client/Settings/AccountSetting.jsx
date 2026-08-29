import { Section, Text } from "@/components";
import { Power } from "@/components/svg";
import { useSignIn } from "@/hooks/useSignIn";
import { useUserStore } from "@/hooks/useUserStore";
import { TextInput, View } from "react-native";
import SettingSectionLayout from "./components/SettingSectionLayout";

export default function AccountScreen({ route }) {
    const { label } = route.params;
    const profile = useUserStore((state) => state.profile);
    const { signOut } = useSignIn();
    console.log(profile);
    return (
        <SettingSectionLayout label={label}>
            <View style={{ gap: 2 }}>
                <Section label={"Prénom"} disabled index={0} totalLength={2}>
                    <Text>{profile.name}</Text>
                </Section>
                <Section label={"Nom"} disabled index={1} totalLength={2}>
                    <TextInput placeholder={profile.surname}></TextInput>
                </Section>
                <View style={{ marginTop: 18 }}>
                    <Section
                        label={"Se déconnecter"}
                        icon={<Power size={18} opacity={0.6} />}
                        onPress={signOut}
                        index={0}
                        totalLength={1}
                        backgroundColor="hsla(0, 47%, 55%, .8)"
                    />
                </View>
            </View>
        </SettingSectionLayout>
    );
}
