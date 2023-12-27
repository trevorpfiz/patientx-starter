import { Stack } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/headers/messages-header";
import { LeftHeaderBack } from "~/components/ui/headers/tabs-header";

export default function QuestionnairesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Questionnaires",
          headerStyle: { backgroundColor: "#fff" },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="[questionnaireId]"
        options={{
          title: "Questionnaire",
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
    </Stack>
  );
}
