import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/tabs-header";

export default function FormsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Forms",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="goals"
        options={{
          title: "Goals",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="questionnaires"
        options={{
          title: "Questionnaires",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="consents"
        options={{
          title: "Consents",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
    </Stack>
  );
}
