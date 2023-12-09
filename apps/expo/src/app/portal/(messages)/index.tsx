import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import ChatPreviewCard from "~/components/ui/chat-preview";

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
