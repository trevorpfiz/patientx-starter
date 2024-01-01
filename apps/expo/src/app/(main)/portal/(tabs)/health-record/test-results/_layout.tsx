import { Stack } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/headers/messages-header";
import { LeftHeaderBack } from "~/components/ui/headers/tabs-header";

export default function TestResultsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Test Results",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "center",
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="[testId]"
        options={{
          title: "Result",
          headerTitleAlign: "center",
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
    </Stack>
  );
}
