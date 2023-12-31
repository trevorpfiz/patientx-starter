import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/headers/tabs-header";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Questionnaires",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
          headerTitleAlign: "center",
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="[questionnaireId]"
        options={{
          title: "Questionnaire",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
    </Stack>
  );
}
