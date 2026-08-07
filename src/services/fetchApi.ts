import { API } from "@/constants/api/api";
import { useUserStore } from "@/hooks/useUserStore";
import { convertApiResponse } from "./responseUtils";
import { errorNormalizer } from "./errorNormalizer";

export default async function fetchApi<T>(
    url: string,
    requestPayload?: { headers?: any; body?: any; method?: string }
): Promise<T> {
    try {
        const token =
            requestPayload?.headers?.["X-Token"] || useUserStore.getState().token;

        if (token === "guest_token" && !url.includes("/login.awp")) {
            const { getGuestData } = require("@/mock/guest/guestData");
            const response = getGuestData(url, requestPayload?.body);
            return {
                ...response,
                isDataEmpty: !response || !response.data,
                responseHeaders: {},
            } as any;
        }

        const defaultHeaders = {
            "User-Agent": `Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0`,
        };

        const reqMethod = requestPayload?.method;
        const reqBody =
            reqMethod !== "GET"
                ? requestPayload?.body
                    ? `data=${JSON.stringify(requestPayload?.body)}`
                    : "data={}"
                : null;
        const requestConfig = {
            ...requestPayload,
            headers: {
                ...defaultHeaders,
                ...(requestPayload?.headers || {}),
            },
            body: reqBody,
            method: reqMethod,
        };

        url = url.includes("{API_VERSION}")
            ? url.replace("{API_VERSION}", `v=${API.API_VERSION}`)
            : url;
        const userId = useUserStore.getState().profile?.id;
        url =
            url.includes("{USER_ID}") && userId != null
                ? url.replace("{USER_ID}", String(userId))
                : url;

        const apiResponse = await fetch(url, requestConfig);
        if (!apiResponse.ok) {
            throw {
                code: apiResponse.status,
                message: `Erreur HTTP ${apiResponse.status}: ${apiResponse.statusText}`,
            };
        }

        const data = await convertApiResponse(apiResponse);

        // Si le serveur ED renvoie un code d'erreur applicatif (différent de 200 et du 250 A2F)
        if (
            data &&
            typeof data.code === "number" &&
            data.code !== 200 &&
            data.code !== 250
        ) {
            const normalized = errorNormalizer(data);
            throw normalized || data;
        }

        const isDataEmpty =
            JSON.stringify(data?.data) === "{}" ||
            JSON.stringify(data?.data) === "[]";

        return {
            ...data,
            isDataEmpty,
            responseHeaders: (apiResponse.headers as any)?.map,
        } as T;
    } catch (error: any) {
        // Si l'erreur n'est pas encore normalisée et provient d'un échec de transport/fetch
        if (!error?.type && typeof error?.code !== "number") {
            error.isNetworkError = true;
        }

        const normalizedError = error?.type ? error : errorNormalizer(error);
        console.warn("Erreur capturée dans fetchApi :", normalizedError || error);
        throw normalizedError || error;
    }
}

