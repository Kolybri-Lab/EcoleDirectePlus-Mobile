import { Section, Text } from "@/components";
import { Link } from "@/components/svg";
import { openUrl } from "@/utils/url";
import { memo, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image } from "react-native";
import SettingSectionLayout from "../components/SettingSectionLayout";

export default function ContributorsScreen({ route }) {
    const { label } = route.params;

    const [contributors, setContributors] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(
            "https://api.github.com/repos/Kolybri-Lab/EcoleDirectePlus-Mobile/contributors?per_page=100"
        )
            .then((res) => {
                if (!res.ok) throw new Error("Erreur GitHub API");
                return res.json();
            })
            .then(setContributors)
            .catch((e) => setError(e.message));
    }, []);

    if (error) return <Text>{error}</Text>;
    if (!contributors) return <ActivityIndicator />;

    return (
        <SettingSectionLayout label={label}>
            <FlatList
                data={contributors}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                    <Contributor
                        item={item}
                        index={index}
                        totalLength={contributors.length}
                    />
                )}
                contentContainerStyle={{ gap: 5 }}
            />
        </SettingSectionLayout>
    );
}

const Contributor = memo(({ item, index, totalLength }) => {
    const { login, avatar_url, contributions, html_url } = item;

    return (
        <Section
            height={72}
            icon={
                <Image
                    source={{ uri: avatar_url }}
                    style={{ width: 32, height: 32, borderRadius: 16 }}
                />
            }
            label={login}
            subtitle={`${contributions} contributions`}
            totalLength={totalLength}
            index={index}
            onPress={() => openUrl(html_url)}
        >
            <Link size={24} fill="hsla(0, 0%, 100%, 0.3)" />
        </Section>
    );
});
