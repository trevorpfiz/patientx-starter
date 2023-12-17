import { useCallback, useEffect, useState } from "react";
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
  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();

  const createMsg = api.communication.createMsg.useMutation();

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      await createMsg.mutateAsync({
        payload: messages[0]?.text!,
        recipient: `Practitioner/${practitionerId}`,
        sender: `Patient/e7836251cbed4bd5bb2d792bc02893fd`,
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

  const chatMsgs = api.communication.chatMsgs.useQuery({
    sender: `Patient/e7836251cbed4bd5bb2d792bc02893fd`,
    recipient: `Practitioner/${practitionerId}`,
  });

  console.log("CHAT MSGS", chatMsgs.data);

  useEffect(() => {
    if (chatMsgs.data) {
      for (const msg of chatMsgs.data) {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: msg._id,
              text: msg.text,
              createdAt: new Date(msg.createdAt),
              user: {
                _id: msg.user._id,
                name: msg.user.name,
                avatar: msg.user.avatar,
              },
            },
          ]),
        );
      }
    }
  }, [chatMsgs.data]);

  return (
    <>
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
