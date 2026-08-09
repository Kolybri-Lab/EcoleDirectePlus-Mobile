import { splitCookiesString } from "set-cookie-parser";

export const getCookiesFromResponse = (response: Response): string => {
    const setCookieHeader = getHeaderFromResponse({ response, item: "set-cookie" });
    if (!setCookieHeader) return "";

    return (
        splitCookiesString(setCookieHeader).map(
            (cookie) => cookie.split(";")[0]
        )[0] ?? ""
    );
};

export const getHeaderFromResponse = ({
    response,
    item,
}: {
    response: Response;
    item: string;
}): string | null => {
    const headers = response.headers;

    return isHeaderInstance(headers) ? headers.get(item) : item;
};

const isHeaderInstance = (headers: any): boolean =>
    typeof headers?.get === "function";

export const convertApiResponse = async (response: Response): Promise<any> => {
    const stringifyResponse = await response.text();

    if (stringifyResponse) {
        try {
            return JSON.parse(stringifyResponse);
        } catch (error) {
            console.warn(
                "Échec du parsing JSON (panne ou maintenance d'EcoleDirecte ?) :",
                error
            );
            throw {
                code: 502,
                message: "Serveur EcoleDirecte indisponible ou en maintenance.",
                data: {},
                originalError: error,
            };
        }
    } else {
        return response;
    }
};
