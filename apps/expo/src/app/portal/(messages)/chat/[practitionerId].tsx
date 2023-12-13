import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/messages-header";

export default function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  console.log("messages", messages);

  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();

  return (
    <>
      <Text>Chat Page</Text>
      <Text>{practitionerId}</Text>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      <Stack.Screen
        options={{
          title: practitionerId,
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
    </>
  );
}
