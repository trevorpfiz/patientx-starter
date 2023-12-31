import { useMemo } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app/(main)";
import ChatPreviewCard from "~/components/ui/cards/chat-preview-card";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";

export default function MessagesPage() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.communication.senderMsgs.useQuery({
      query: {
        sender: `Patient/${patientId}`,
      },
    });

  const chats = useMemo(() => {
    return (
      data?.map((msg) => ({
        title: msg.recipient.name,
        preview: msg?.messages[msg?.messages?.length - 1] ?? "",
        onPress: () => router.push(`/portal/chat/${msg.recipient.id}`),
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
        <View className="mb-36 flex-1 items-center justify-center bg-white">
          <Loader2
            size={48}
            color="black"
            strokeWidth={2}
            className="animate-spin"
          />
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
