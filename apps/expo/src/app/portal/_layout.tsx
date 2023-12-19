import { Stack } from "expo-router";

import {
  LeftHeaderDone,
  RightHeaderShare,
} from "~/components/ui/headers/pdf-header";

export default function PortalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(modals)/pdf"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(messages)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(alerts)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
