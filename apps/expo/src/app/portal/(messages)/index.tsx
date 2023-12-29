import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import ChatPreviewCard from "~/components/ui/cards/chat-preview-card";
import { api } from "~/utils/api";

interface Chat {
  title: string;
  preview: string;
  onPress: () => void;
}

export default function MessagesPage() {
  const [patientId] = useAtom(patientIdAtom);
  const [chats, setChats] = useState<Chat[]>([]);

  const senderMsgsQuery = api.communication.senderMsgs.useQuery({
    query: {
      sender: `Patient/${patientId}`,
    },
  });

  useEffect(() => {
    if (senderMsgsQuery.data) {
      setChats(
        senderMsgsQuery.data.map((msg) => ({
          title: msg.recipient.name,
          preview: msg.messages[msg?.messages?.length - 1]!,
          key: msg.recipient.id,
          onPress: () =>
            router.push(`/portal/(messages)/chat/${msg.recipient.id}`),
        })),
      );
    }
  }, [senderMsgsQuery.data]);

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
