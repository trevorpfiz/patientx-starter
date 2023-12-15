import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import type { IMessage } from "react-native-gifted-chat";
import { GiftedChat } from "react-native-gifted-chat";
import { Stack, useLocalSearchParams } from "expo-router";

import Chat from "~/components/chat";
import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/messages-header";
import { api } from "~/utils/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();

  const createMsg = api.communication.createMsg.useMutation();

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      await createMsg.mutateAsync({
        payload: messages[0]?.text!,
        sender: `Practitioner/${practitionerId}`,
        recipient: `Patient/e7836251cbed4bd5bb2d792bc02893fd`,
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [createMsg, practitionerId],
  );

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
        msgsQuery.data.map((msg, i) => ({

          _id: msg.id,
          text: msg?.message!,
          createdAt: new Date(msg.sent),
          user: {
            _id: i % 2 ? 2 : 1,
            name: msg.sender?.name!,
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
      {/* <Chat /> */}
    </>
  );
}
