import { useMemo } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(main)";
import ChatPreviewCard from "~/components/ui/cards/chat-preview-card";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";

export default function MessagesPage() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.communication.patientChats.useQuery({
      query: {
        sender: `Patient/${patientId}`,
      },
    });

  const chats = useMemo(() => {
    return (
      data?.map((chat) => ({
        title: chat.recipient.name,
        preview: chat.latestMessage,
        onPress: () => router.push(`/portal/chat/${chat.recipient.id}`),
      })) ?? []
    );
  }, [data]);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>{error?.message}</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100">
      {chats.length === 0 ? (
        <View className="flex-1 flex-col items-center justify-center">
          <Text className="mt-4 text-xl font-bold">
            You have no messages yet
          </Text>
        </View>
      ) : (
        <FlashList
          data={chats}
          renderItem={({ item, index }) => (
            <ChatPreviewCard
              title={item.title}
              preview={item.preview}
              onPress={item.onPress}
              first={index === 0}
              last={index === chats.length - 1}
            />
          )}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingTop: 16,
            paddingHorizontal: 16,
          }}
        />
      )}
    </View>
  );
}
