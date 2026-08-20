import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { CopyLeft } from "@/components/svg";
import { Text } from "@/components/core";

import {
    CustomTopHeader,
    LinkText,
    Separation,
    Subtitle,
    Title,
} from "../../components";
import { CONFIG } from "@/constants/config";
const COLABORATORS = {
    main: {
        // "Truite Séchée": "https://github.com/truiteseche",
        // "Saumon Brulé": "https://github.com/saumon-brule",
        Lostosword: "https://github.com/Lostosword",
        "As de Pique": "https://github.com/as2pick",
        Lucilus: "https://github.com/Lucilus78",
    },
    other: {
        // akash02ab: "https://github.com/akash02ab",
        // OeildeLynx31: "https://github.com/OeildeLynx31",
        // Fefedu973: "https://github.com/Fefedu973",
        // "Beta-Way": "https://github.com/Beta-Way",
        // xav35000: "https://github.com/xav35000",
        Lostosword: "https://github.com/Lostosword",
        "As de Pique": "https://github.com/as2pick",
        Lucilus: "https://github.com/Lucilus78",
    },
};

const Paragraph = ({ children }) => {
    return <Text style={styles.paragraph}>{children}</Text>;
};

const Link = ({ href, isPeople = false, children }) => {
    const { colors } = useTheme();

    return (
        <LinkText
            href={String(href)}
            color={isPeople ? colors.accent : colors.main}
            underline={isPeople}
        >
            {children}
        </LinkText>
    );
};

export default function PrivacyPolicyScreen() {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background.login }}>
            <CustomTopHeader
                headerTitle={"Privacy Policy And Terms of Use"}
                height={38}
                backgroundColor={
                    Array.isArray(colors.background.gradient)
                        ? colors.background.gradient[0]
                        : colors.background.gradient
                }
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.scrollview}>
                    <View>
                        <Title>Politique de confidentialité</Title>
                        <Subtitle>Résumé</Subtitle>
                        <Paragraph>
                            ℹ️ Ecole Directe Plus n'est en aucun cas affilié à
                            EcoleDirecte ou Aplim, il s'agit d'un service indépendant
                            libre et open source.
                        </Paragraph>
                        <Paragraph>
                            ✅ Ecole Directe Plus ne collecte aucune information sur
                            les utilisateurs du service.
                        </Paragraph>
                        <Paragraph>
                            ✅ Ecole Directe Plus ne crée pas de compte lors de la
                            connexion, la connexion a lieu sur les serveurs d'Aplim.
                            Autrement dit, nous ne STOCKONS PAS les identifiants des
                            utilisateurs se connectant.
                        </Paragraph>
                        <Paragraph>
                            ✅ Ecole Directe Plus ne permet, ni ne prétend donner
                            accès à des données auxquelles l'élève n'a pas accès,
                            incluant, mais ne se limitant pas aux : points aux
                            examens* et au rang de l'élève*.
                        </Paragraph>
                        <Paragraph>
                            ℹ️ Les seules données collectées le sont par Aplim (
                            <Link href={"https://www.ecoledirecte.com"}>
                                EcoleDirecte
                            </Link>
                            ) conformément à leur politique de confidentialité
                            décrite dans leurs{" "}
                            <Link href={"https://www.ecoledirecte.com/login"}>
                                Mentions Légales
                            </Link>
                            .
                        </Paragraph>
                        <Paragraph>
                            *Si l'accès à ces données est possible par l'utilisateur
                            sur la plateforme officielle d'EcoleDirecte, ces données
                            peuvent être affichées sur Ecole Directe Plus. Par
                            ailleurs, si les moyennes de l'utilisateur ne sont pas
                            disponibles, elles seront calculées, mais ce de façon
                            locale sur l'appareil du client, les informations ne sont
                            PAS transmises à nos serveurs.
                        </Paragraph>
                    </View>
                    <Separation />
                    <Subtitle>Conditions d'utilisations</Subtitle>
                    <Paragraph>
                        • Les données personnelles sécurisées figurant sur ce site
                        Internet concernent des élèves et les familles, et sont
                        fournies par le logiciel Charlemagne des établissements
                        scolaires au sein desquels ceux-ci sont scolarisés.
                    </Paragraph>
                    <Paragraph>
                        • EcoleDirecte ne collecte aucune donnée personnelle
                        directement sur le site Internet, ni cookie, à l’exception
                        des email et téléphone mobile, utilisés EXCLUSIVEMENT pour la
                        récupération des identifiants.
                    </Paragraph>
                    <Paragraph>
                        • Ces établissements scolaires se sont engagés à apporter
                        tous leurs soins dans la qualité des informations diffusées.
                        Il s’agit toutefois d’indications qui, en aucun cas, ne
                        pourraient faire foi en lieu et place des documents usuels
                        (bulletins de notes, relevés de notes, relevés d’absences et
                        de sanctions).
                    </Paragraph>
                    <Paragraph>
                        • Ces informations ne sont disponibles qu’après saisie d’un
                        mot de passe fourni exclusivement par l’établissement soit au
                        responsable juridique de l’élève s’il est mineur, soit à
                        l’élève lui même s’il est majeur. Le détenteur d’un mot de
                        passe ne peut accéder qu’aux seules informations le
                        concernant lui ou les personnes dont il est responsable
                        juridiquement.
                    </Paragraph>
                    <Paragraph>
                        • Pour optimiser la confidentialité de vos consultations,
                        nous vous conseillons de choisir un mot de passe sécurisé. Le
                        site internet et ses données associées sont hébergés sur des
                        serveurs situés sur le territoire français.
                    </Paragraph>
                    <Paragraph>
                        • La société APLIM, hébergeur du site, s’engage dans tous les
                        cas à ne pas utiliser, louer, vendre, céder ou mettre à
                        disposition d’un tiers à fin d’autres usages le contenu du
                        présent site Internet.
                    </Paragraph>
                    <Paragraph>
                        • Les données présentes sur ce site pourront être divulguées
                        en application d'une loi, d'un règlement ou en vertu d'une
                        décision d'une autorité réglementaire ou judiciaire
                        compétente ou encore, si cela s'avère nécessaire, aux fins de
                        maintenance, par l'éditeur ou l’établissement scolaire.
                    </Paragraph>
                    <Paragraph>
                        • Le responsable du traitement de ces données est
                        l’établissement scolaire qui a procédé à leur saisie. Le
                        responsable de leur sécurisation sur notre plateforme
                        EcoleDirecte en qualité de sous-traitant est : Société Aplim
                        ZA Les Côtes 73190 Saint Jeoire Prieuré, rgpd@aplim.fr.
                    </Paragraph>
                    <Paragraph>
                        • En application des articles 15, 16, 17 et 18 du Règlement
                        du Parlement européen et du Conseil du 27 avril 2016, et de
                        la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique,
                        aux fichiers et aux libertés, vous disposez d'un droit
                        d'accès, de rectification, d'effacement des données
                        collectées, et d'un droit de limitation du traitement des
                        données personnelles que vous pouvez exercer auprès du
                        responsable du traitement (à savoir l’établissement scolaire
                        responsable du traitement) qui nous répercutera votre demande
                        à fins d’exécution sur le site EcoleDirecte.
                    </Paragraph>
                    <Paragraph>
                        • En toute hypothèse, il vous est possible d'introduire une
                        réclamation auprès de la Commission Nationale de
                        l'Informatique et des Libertés si vous vous estimez lésé par
                        le traitement de vos données personnelles par l’établissement
                        scolaire.
                    </Paragraph>
                    <Paragraph>
                        • L'activation de l'amélioration de l'accessibilité des
                        personnes déficientes visuelles utilise la police de
                        caractères{" "}
                        <Link href={"https://luciole-vision.com/"}>Luciole</Link>.
                        Cette police de caractères est distribuée gratuitement sous
                        Licence publique{" "}
                        <Link
                            href={
                                "https://creativecommons.org/licenses/by/4.0/legalcode.fr"
                            }
                        >
                            Creative Commons Attribution 4.0 International
                        </Link>{" "}
                        : Luciole © Laurent Bourcellier & Jonathan Perez
                    </Paragraph>
                    <Separation />
                    <Title>Conditions d'utilisations</Title>
                    <Subtitle>1. Général</Subtitle>
                    <Paragraph>
                        • Les noms et pronoms "Ecole Directe Plus", "EDP", "service",
                        "Nous", "Notre/Nos" renvoient au service Ecole Directe Plus
                        (non-affilié) proposé par le groupuscule Magic-Fish. L'accès
                        et l'utilisation du service Ecole Directe Plus est l'objet de
                        ces présentes conditions d'utilisations. En accédant ou
                        utilisant n'importe quelle partie de l'application, vous
                        déclarez avoir lu, compris, et accepté ces présentes mentions
                        légales.
                    </Paragraph>
                    <Subtitle>2. Description du site et du service</Subtitle>
                    <Paragraph>
                        • Ecole Directe Plus a pour objectif d'offrir à ses
                        utilisateurs un cadre agréable à la consultation des données
                        scolaires. Ecole Directe Plus se réserve le droit, à sa seule
                        discrétion et à n'importe quel moment, de mettre à jour,
                        modifier, suspendre, apporter des améliorations ou
                        interrompre tout aspect du service, temporairement ou
                        définitivement.
                    </Paragraph>
                    <Subtitle>3. Usages acceptables du service</Subtitle>
                    <Paragraph>
                        • Vous êtes responsable de votre usage du service, et des
                        manipulations faite avec votre compte. Notre objectif est de
                        fournir un service agréable, utile, et sécurisé pour tous les
                        utilisateurs. Pour parvenir à cet objectif, nous condamnons
                        tout comportement malveillant pouvant être offensant envers
                        d'autres utilisateurs ou envers l'équipe d'EDP. Par ailleurs,
                        bien que nous ayons pour objectif d'offrir à nos utilisateurs
                        un service toujours plus complet et fiable, l'usage d'Ecole
                        Directe Plus ne se substitue en aucun cas entièrement à celui
                        d'EcoleDirecte, notamment en ce qui concerne des
                        fonctionnalités avancées telles que les QCM, les
                        visio-conférences, la vie de la classe, et toute autre
                        fonctionnalité encore indisponible sur EDP. Il est ainsi
                        déconseillé de faire usage exclusivement d'Ecole Directe
                        Plus.
                    </Paragraph>
                    <Subtitle>4. Connexion</Subtitle>
                    <Paragraph>
                        • En vous connectant à Ecole Directe Plus avec votre compte
                        EcoleDirecte, vous donnez au site EDP (localement, seulement
                        chez le client) l'accès aux données concernant votre compte
                        via l'API d'EcoleDirecte. Pour garantir la confidentialité de
                        vos informations, nous NE partagons PAS à des fins
                        commerciales, NI ne stockons dans des serveurs, vos données
                        personnelles. Les seules données stockées le sont par Aplim
                        (EcoleDirecte). En outre, vous êtes le seul responsable de
                        l'usage qu'il est fait de vos données.
                    </Paragraph>
                    <Subtitle>5. Retour utilisateur</Subtitle>
                    <Paragraph>
                        • La page de retour permet aux utilisateurs de signaler des
                        dysfonctionnements, faire des suggestions, partager un retour
                        d'expérience ou un avis général. Cette page nous permet
                        d'améliorer notre service, le bénéficiaire étant
                        l'utilisateur final. En soumettant le formulaire de retour,
                        vous acceptez de partager une partie de vos informations avec
                        Ecole Directe Plus.
                    </Paragraph>
                    <Subtitle>6. Liens, sites et services tiers</Subtitle>
                    <Paragraph>
                        • Le service peut contenir des liens vers des sites Web
                        tiers, des services, ou d'autres événements ou activités qui
                        ne sont ni détenus ni contrôlés par Ecole Directe Plus. Nous
                        n'approuvons ni n'assumons aucune responsabilité pour ces
                        sites, informations, matériaux, ou services tiers. Si vous
                        accédez à un site Web, un service ou un contenu tiers d'Ecole
                        Directe Plus, vous comprenez que ces conditions générales et
                        notre politique de confidentialité ne s'appliquent pas à
                        votre utilisation de ces sites. Vous reconnaissez et acceptez
                        expressément qu'Ecole Directe Plus ne sera pas responsable,
                        directement ou indirectement, de tout dommage ou perte
                        résultant de votre utilisation de tout site Web, service ou
                        contenu tiers.
                    </Paragraph>
                    <Subtitle>7. Résiliation</Subtitle>
                    <Paragraph>
                        • Ecole Directe Plus peut résilier votre accès et votre
                        utilisation du service à tout moment, pour quelque raison que
                        ce soit, et à ce moment-là, vous n'aurez plus le droit
                        d'utiliser le service. Attention, même si vous n'avez plus
                        accès à EDP, cela ne signifie pas que votre accès à
                        EcoleDirecte ait été résilié, les deux sites étant des
                        entitées indépendantes.
                    </Paragraph>

                    <Separation />
                    <Title>Crédits</Title>
                    <Paragraph>
                        • Ecole Directe Plus est l'initiative du groupuscule
                        Magic-Fish :
                    </Paragraph>
                    <Paragraph>
                        Développeurs principaux :
                        {Object.keys(COLABORATORS.main).map((key, i) => (
                            <Paragraph key={key}>
                                {"\n- "}
                                <Link
                                    href={Object.values(COLABORATORS.main)[i]}
                                    isPeople={true}
                                >
                                    {key}
                                </Link>
                            </Paragraph>
                        ))}
                    </Paragraph>
                    <Paragraph>
                        Autres contributeurs :
                        {Object.keys(COLABORATORS.other).map((key, i) => (
                            <Paragraph key={key}>
                                {"\n- "}
                                <Link
                                    href={Object.values(COLABORATORS.other)[i]}
                                    isPeople={true}
                                >
                                    {key}
                                </Link>
                            </Paragraph>
                        ))}
                    </Paragraph>
                    <Paragraph>
                        {"APIs et services tiers :\n"}
                        {"- EcoleDirecte\n"}
                    </Paragraph>
                    <Paragraph>
                        {"Dépendances \n"}
                        {"- EXPO\n"}
                        {"- Expo Status Bar\n"}
                        {"- React\n"}
                        {"- React Native\n"}
                        {"- React Native ASYNC Storage\n"}
                        {"- React Native Gesture Handler\n"}
                        {"- React Native Keychain\n"}
                        {"- React Native Reanimated\n"}
                        {"- React Native Safe Area\n"}
                        {"- React Native Screens\n"}
                        {"- React Native SVG\n"}
                        {"- React Navigation\n"}
                        {"- Base64\n"}
                        {"- JS-SHA256\n"}
                        {"- Set-cookie-parser\n"}
                        {"- Day JS\n"}
                        {"- Lottie\n"}
                    </Paragraph>
                    <Paragraph>
                        {"Testeurs de pré-lancement :\n"}
                        {"- Thon Humide\n"}
                        {"- Jackp0t\n"}
                    </Paragraph>
                    <Paragraph>
                        {"Remerciements spéciaux :\n"}
                        {"- Thon Humide\n"}
                        {"- Jackp0t\n"}
                        {"- Nickro_01290\n"}
                        {"- Cthyllax\n"}
                        {"- EcoleDirecte Neptunium\n"}-{" "}
                        <Text weight="bold">Internet</Text>
                    </Paragraph>
                    <Paragraph>
                        • Curieux et motivé ? Rejoignez nous et participez au
                        développement d'Ecole Directe Plus Mobile à travers le{" "}
                        <Link
                            href={
                                "https://github.com/as2pick/EcoleDirectePlus-Mobile"
                            }
                        >
                            dépôt Github
                        </Link>
                        .
                    </Paragraph>
                    <Paragraph>
                        • Rencontrez la communauté d'Ecole Directe Plus en rejoignant
                        le{" "}
                        <Link href={CONFIG.discordInviteLink}>serveur Discord.</Link>
                    </Paragraph>
                    <Separation />
                    <Title>License (MIT)</Title>
                    <Paragraph>
                        • Permission is hereby granted, free of charge, to any person
                        obtaining a copy of this software and associated
                        documentation files (the “Software”), to deal in the Software
                        without restriction, including without limitation the rights
                        to use, copy, modify, merge, publish, distribute, sublicense,
                        and/or sell copies of the Software, and to permit persons to
                        whom the Software is furnished to do so, subject to the
                        following conditions: The above copyright notice and this
                        permission notice shall be included in all copies or
                        substantial portions of the Software. The Software is
                        provided “as is”, without warranty of any kind, express or
                        implied, including but not limited to the warranties of
                        merchantability, fitness for a particular purpose and
                        noninfringement. In no event shall the authors or copyright
                        holders X be liable for any claim, damages or other
                        liability, whether in an action of contract, tort or
                        otherwise, arising from, out of or in connection with the
                        software or the use or other dealings in the Software.
                    </Paragraph>
                    <Paragraph>
                        Dernière révision le 29 mars 2025{"\n"}
                        Nous contacter :{" "}
                        <Link
                            href={"mailto:contact@ecole-directe.plus"}
                            isPeople={true}
                        >
                            contact@ecole-directe.plus
                        </Link>
                    </Paragraph>

                    <Text style={[styles.copyleft]} align="center">
                        Copyleft 2025 <CopyLeft size={17} /> Ecole Directe Plus
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
// •
const styles = StyleSheet.create({
    scrollview: {
        paddingVertical: 18,
    },
    paragraph: {
        marginLeft: 30,
        marginRight: 20,
        marginVertical: 4,
    },
    separationParent: {
        alignItems: "center",
        marginVertical: 14,
    },
    separationChildren: {
        width: "92%",
        height: 1.8,
        borderRadius: 999,
        marginLeft: 30,
        marginRight: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
        marginHorizontal: 5,
        position: "relative",
    },
    copyleft: {
        marginTop: 10,
    },
});

