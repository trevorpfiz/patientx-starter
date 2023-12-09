import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/tabs-header";

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Messages",
          headerLeft: () => <LeftHeaderBack />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
    </Stack>
  );
}
