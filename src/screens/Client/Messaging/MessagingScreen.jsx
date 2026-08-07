import { Text } from "@/components";
import { useMessaging } from "@/features/messaging";
import { useTabPadding } from "@/hooks/useTabPadding";
import { useUserStore } from "@/hooks/useUserStore";
import { formatDate } from "@/utils/date";
import { dedupeById } from "@/utils/dedupe";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";

export default function MessagingScreen() {
    const token = useUserStore((state) => state.token);
    const tabPadding = useTabPadding();

    const {
        data,
        isLoading,
        isError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
        isRefetching,
    } = useMessaging(token, {
        typeOfRecovery: "received",
        itemsPerPage: 20,
    });

    const messages = useMemo(() => {
        const flat = data?.pages.flatMap((page) => page.received) ?? [];
        return dedupeById(flat);
    }, [data]);

    const renderItem = useCallback(
        ({ item, index }) => {
            let borderRadiusStyle = {};
            const BORDER_RADIUS_EXT = 28;
            const BORDER_RADIUS_INT = 8;
            if (index === 0) {
                borderRadiusStyle = {
                    borderTopLeftRadius: BORDER_RADIUS_EXT,
                    borderTopRightRadius: BORDER_RADIUS_EXT,
                    borderBottomLeftRadius: BORDER_RADIUS_INT,
                    borderBottomRightRadius: BORDER_RADIUS_INT,
                };
            } else if (index === messages.length - 1) {
                borderRadiusStyle = {
                    borderTopLeftRadius: BORDER_RADIUS_INT,
                    borderTopRightRadius: BORDER_RADIUS_INT,
                    borderBottomLeftRadius: BORDER_RADIUS_EXT,
                    borderBottomRightRadius: BORDER_RADIUS_EXT,
                };
            } else {
                borderRadiusStyle = {
                    borderTopLeftRadius: BORDER_RADIUS_INT,
                    borderTopRightRadius: BORDER_RADIUS_INT,
                    borderBottomLeftRadius: BORDER_RADIUS_INT,
                    borderBottomRightRadius: BORDER_RADIUS_INT,
                };
            }
            return (
                <View
                    style={{
                        backgroundColor: "hsla(235, 28%, 15%, 1)",
                        paddingVertical: 16,
                        paddingHorizontal: 18,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        ...borderRadiusStyle,
                    }}
                >
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: "hsla(217, 91%, 60%, 1)",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Text preset="h4" style={{ color: "white" }}>
                            {item.sender.initials[1] ?? "??"}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text preset="title2" oneLine style={{ flexShrink: 1 }}>
                                {item.sender.fullName}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <Text
                                    oneLine
                                    preset="label2"
                                    style={{ flexShrink: 0, marginLeft: 20 }}
                                >
                                    {formatDate(new Date(item.date))}
                                </Text>
                                {!item.read && (
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: "hsla(0, 0%, 100%, 1)",
                                            borderRadius: 5,
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                        <Text preset="body2" oneLine>
                            {item.subject}
                        </Text>
                    </View>
                </View>
            );
        },
        [messages]
    );

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage();
        }
    };

    if (isLoading) return <ActivityIndicator size="large" />;

    if (isError) {
        return (
            <View style={{ padding: 16 }}>
                <Text>Une erreur est survenue lors du chargement des messages.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, marginHorizontal: 16 }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: tabPadding, gap: 4 }}
                renderItem={renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ padding: 16 }}>
                        <Text>Aucun message pour le moment.</Text>
                    </View>
                }
                ListFooterComponent={
                    isFetchingNextPage ? <ActivityIndicator size="small" /> : null
                }
            />
        </View>
    );
}
