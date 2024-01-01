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
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="chat/[practitionerId]"
        options={{
          title: "Chat",
          headerTitleAlign: "center",
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
    </Stack>
  );
}
