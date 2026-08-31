import { useUserStore } from "@/hooks/useUserStore";
import { cacheProfilePhoto } from "@/utils/profilePhoto";

export default function storeDatas({ data, token }) {
    if (!data) return;

    const isAlreadyFormatted = data && "name" in data;

    const formattedProfile = isAlreadyFormatted
        ? data
        : {
              id: data.id,
              name: data.prenom,
              surname: data.nom,
              sex: data.profile?.sexe || "",
              phone: data.profile?.telPortable || "",
              email: data.email || "",
              schoolName: data.nomEtablissement || "",
              photoUrl: data.profile?.photo || "",
              class: {
                  libelle: data.profile?.classe?.libelle || "",
                  code: data.profile?.classe?.code || "",
              },
          };
    if (!useUserStore.getState().profile)
        useUserStore.getState().setProfile(formattedProfile);
    useUserStore.getState().setToken(token);

    if (formattedProfile.photoUrl && !formattedProfile.localPhotoUri) {
        cacheProfilePhoto(
            formattedProfile.id,
            formattedProfile.photoUrl,
            token
        ).then((localPath) => {
            if (localPath) {
                useUserStore.getState().setProfile({
                    ...formattedProfile,
                    localPhotoUri: localPath,
                });
            }
        });
    }
}
