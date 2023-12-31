import { Stack } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
  MessagesRightHeaderClose,
} from "~/components/ui/headers/messages-header";

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Messages",
          headerRight: () => <MessagesRightHeaderClose />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name="chat/[practitionerId]"
        options={{
          title: "Chat",
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
    </Stack>
  );
}
