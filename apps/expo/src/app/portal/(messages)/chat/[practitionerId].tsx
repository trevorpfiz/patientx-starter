import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import type { IMessage } from "react-native-gifted-chat";
import { GiftedChat } from "react-native-gifted-chat";
import { Stack, useLocalSearchParams } from "expo-router";
import { Loader2 } from "lucide-react-native";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/headers/messages-header";
import { api } from "~/utils/api";

export default function ChatPage() {
  const utils = api.useUtils();
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

      await utils.communication.searchSenderMsgs.invalidate({
        query: {
          sender: `Patient/e7836251cbed4bd5bb2d792bc02893fd`,
        },
      });
    },
    [createMsg, practitionerId, utils.communication.searchSenderMsgs],
  );

  const practitionerQuery = api.practitioner.getPractitioner.useQuery({
    path: {
      practitioner_a_id: practitionerId,
    },
  });

  const chatMsgs = api.communication.chatMsgs.useQuery({
    sender: `Patient/e7836251cbed4bd5bb2d792bc02893fd`,
    recipient: `Practitioner/${practitionerId}`,
  });

  useEffect(() => {
    if (chatMsgs.data) {
      for (const msg of chatMsgs.data) {
        // Verify if the message is already in the messages array
        if (messages.find((m) => m._id === msg._id)) {
          continue;
        }

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
  }, [chatMsgs.data, messages]);

  if (practitionerQuery.isLoading || chatMsgs.isLoading) {
    return (
      <View className="mb-36 flex-1 items-center justify-center bg-white">
        <Loader2
          size={48}
          color="black"
          strokeWidth={2}
          className="animate-spin"
        />
      </View>
    );
  }

  return (
    <>
      {practitionerQuery.data && chatMsgs.data && (
        <>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: 1,
            }}
            infiniteScroll
          />
          <Stack.Screen
            options={{
              title: practitionerQuery.data.name[0]?.text,
              headerTitleAlign: "center",
              headerLeft: () => <MessagesLeftHeaderBack />,
              headerRight: () => <ChatRightHeaderClose />,
            }}
          />
        </>
      )}
    </>
  );
}
