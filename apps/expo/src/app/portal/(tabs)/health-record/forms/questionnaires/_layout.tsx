import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/tabs-header";

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
    </Stack>
  );
}
