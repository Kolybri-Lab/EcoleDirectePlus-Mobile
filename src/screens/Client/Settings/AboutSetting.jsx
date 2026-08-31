import { Section, Text } from "@/components";
import { Chevron, Info, Link, Person } from "@/components/svg";
import DiscordLogo from "@/components/svg/logos/Discord";
import EDPLogo from "@/components/svg/logos/EDP";
import GithubLogo from "@/components/svg/logos/Github";
import { Heart } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedFrenchFlag from "./components/AnimatedFrenchFlag";
import SettingSectionLayout from "./components/SettingSectionLayout";

export default function AboutScreen({ route }) {
    const { label } = route.params;
    return (
        <SettingSectionLayout label={label}>
            <View style={{ gap: 28 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                    }}
                >
                    <AnimatedFrenchFlag baseRotation={350} />
                    <View
                        style={{
                            backgroundColor: "hsla(230, 30%, 38%, .7)",
                            padding: 18,
                            borderRadius: 18,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <EDPLogo size={100} />
                    </View>
                    <AnimatedFrenchFlag baseRotation={10} />
                </View>

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "hsla(0, 0%, 100%, .07)",
                        padding: 18,
                        borderRadius: 28,
                        gap: 20,
                    }}
                >
                    <Text preset="body1" align="center">
                        Ecole Directe Plus simplifie l'accès à vos données École
                        Directe grâce à une interface moderne, rapide et respectueuse
                        de votre vie privée. Aucune donnée n'est collectée ni
                        revendue : votre confidentialité est notre priorité.
                    </Text>
                </View>
            </View>

            <View style={{ gap: 9, flex: 1, justifyContent: "center" }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 9,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Section
                            index={0}
                            totalLength={1}
                            label={"Github"}
                            icon={<GithubLogo size={24} />}
                        >
                            <Link size={24} fill="hsla(0, 0%, 100%, 0.3)" />
                        </Section>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Section
                            index={0}
                            totalLength={1}
                            label={"Contributeurs"}
                            icon={<Person size={22} />}
                        >
                            <Chevron size={16} fill="hsla(0, 0%, 100%, 0.3)" />
                        </Section>
                    </View>
                </View>
                <View style={{ gap: 4 }}>
                    <Section
                        index={0}
                        totalLength={2}
                        label={"Discord"}
                        icon={<DiscordLogo size={24} />}
                    >
                        <Link size={24} fill="hsla(0, 0%, 100%, 0.3)" />
                    </Section>
                    <Section
                        index={1}
                        totalLength={2}
                        label={"Plus..."}
                        icon={<Info size={24} />}
                    >
                        <Chevron size={16} fill="hsla(0, 0%, 100%, 0.3)" />
                    </Section>
                </View>
            </View>

            <SafeAreaView
                edges={["bottom"]}
                style={{
                    alignItems: "center",

                    marginVertical: 20,
                }}
            >
                <Text preset="label1" align="center">
                    Cette application à été designé, concue et développée par des
                    étudiant français avec
                </Text>
                <Heart fill={"hsl(0, 70%, 60%)"} color={"transparent"} size={35} />
                <Text weight="light" size={7} color="hsla(0, 0%, 100%, .14)">
                    mais genre vrm ;-)
                </Text>
            </SafeAreaView>
        </SettingSectionLayout>
    );
}
