import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/headers/tabs-header";

export default function FormsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Clinical Notes & Forms",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="clinical-notes"
        options={{
          title: "Clinical Notes",
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
