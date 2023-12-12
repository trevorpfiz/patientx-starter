import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/tabs-header";

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
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="[testId]"
        options={{
          title: "Test",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
    </Stack>
  );
}
