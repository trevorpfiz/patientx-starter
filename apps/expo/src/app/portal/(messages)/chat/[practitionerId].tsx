import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import type { IMessage } from "react-native-gifted-chat";
import { GiftedChat } from "react-native-gifted-chat";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/messages-header";
import { api } from "~/utils/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((messages: IMessage[] = []) => {
    console.log("Messages", messages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();

  const practitionerQuery = api.practitioner.getPractitioner.useQuery({
    path: {
      practitioner_a_id: practitionerId,
    },
  });

  const msgsQuery = api.communication.msgs.useQuery({
    query: {
      sender: `Practitioner/${practitionerId}`,
      recipient: `Patient/e7836251cbed4bd5bb2d792bc02893fd`,
    },
  });

  console.log("msgsQuery", msgsQuery.data);

  useEffect(() => {
    if (msgsQuery.data) {
      setMessages(
        msgsQuery.data.map((msg) => ({
          _id: msg.id as string,
          text: msg?.message as string,
          createdAt: new Date(msg.sent as string),
          user: {
            _id: msg.sender?.id as string,
            name: msg.sender?.name as string,
          },
        })),
      );
    }
  }, [msgsQuery.data]);

  return (
    <>
      <Text>Chat Page</Text>
      {practitionerQuery.data && (
        <>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: 1,
            }}
          />
          <Stack.Screen
            options={{
              title: practitionerQuery.data.name[0]?.text,
              headerLeft: () => <MessagesLeftHeaderBack />,
              headerRight: () => <ChatRightHeaderClose />,
            }}
          />
        </>
      )}
    </>
  );
}
