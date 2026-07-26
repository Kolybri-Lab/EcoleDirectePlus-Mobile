import messagingResolver, {
    messageContentResolver,
} from "@/features/messaging/resolver/messaging";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MessageContent, ResolvedMessaging } from "../types";

export interface UseMessagingOptions {
    typeOfRecovery?: "received" | "sent" | "draft" | "archived";
    binderId?: number;
    itemsPerPage?: number;
}

export function useMessaging(token: string, options: UseMessagingOptions = {}) {
    const { typeOfRecovery = "received", binderId = 0, itemsPerPage = 20 } = options;

    return useInfiniteQuery<ResolvedMessaging>({
        queryKey: ["messaging", typeOfRecovery, binderId],
        queryFn: ({ pageParam = 0 }) =>
            messagingResolver({
                token,
                page: pageParam as number,
                itemsPerPage,
                typeOfRecovery,
                binderId,
            }) as Promise<ResolvedMessaging>,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return undefined;

            const lastPageMessages = lastPage[typeOfRecovery] || [];

            if (lastPageMessages.length < itemsPerPage) {
                return undefined;
            }

            return allPages.length;
        },
        enabled: Boolean(token),
    });
}

export function useMessageContent(
    token: string,
    messageId: number | string | undefined,
    mode: "destinataire" | "expediteur" = "destinataire"
) {
    return useQuery<MessageContent>({
        queryKey: ["message", messageId, mode],
        queryFn: () =>
            messageContentResolver({
                token,
                messageId: messageId!,
                mode,
            }) as Promise<MessageContent>,
        enabled: Boolean(token) && messageId !== undefined,
    });
}
