import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/headers/tabs-header";

export default function ConsentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Consents",
          headerStyle: { backgroundColor: "#fff" },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
    </Stack>
  );
}
