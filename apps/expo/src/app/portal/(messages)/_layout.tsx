import { Stack } from "expo-router";

import { MessagesRightHeaderClose } from "~/components/ui/messages-header";

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
    </Stack>
  );
}
