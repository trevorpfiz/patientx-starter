import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import ChatPreviewCard from "~/components/ui/chat-preview-card";
import { api } from "~/utils/api";

const chats = [
  {
    title: "Dr. John Doe",
    preview:
      "Hello, how are you? Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you? Hello, how are you?",
    onPress: () => router.push("/portal/(messages)/chat/1"),
  },
  {
    title: "Dr. Jane Doe",
    preview:
      "Hello, how are you? Hello, how are you? Hello, how are you? Hello, how are you? Hello, how are you? Hello, how are you? Hello, how are you?",

    onPress: () => router.push("/portal/(messages)/chat/2"),
  },
  {
    title: "Dr. John Doe",
    preview: "Hello, how are you?",

    onPress: () => router.push("/portal/(messages)/chat/3"),
  },
  {
    title: "Dr. Jane Doe",
    preview: "Hello, how are you?",

    onPress: () => router.push("/portal/(messages)/chat/4"),
  },
  {
    title: "Dr. John Doe",
    preview: "Hello, how are you?",

    onPress: () => router.push("/portal/(messages)/chat/5"),
  },
  {
    title: "Dr. Jane Doe",
    preview: "Hello, how are you?",

    onPress: () => router.push("/portal/(messages)/chat/6"),
  },
];

export default function MessagesPage() {

  const patientQuery = api.patient.getPatient.useQuery({
    path: {
      patient_id: "e7836251cbed4bd5bb2d792bc02893fd"
    }
  })

  const senderMsgs = api.communication.searchSenderMsgs.useQuery({
    query: {
      sender: `Patient/${patientQuery.data?.id as string}`
    }
  }, { enabled: !!patientQuery?.data?.id })

  console.log("Sender Msgs", senderMsgs.data?.entry?.map((t) => t))

  return (
    <View className="flex-1 bg-gray-100">
      <Text>Messages Page</Text>

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
    </View>
  );
}
