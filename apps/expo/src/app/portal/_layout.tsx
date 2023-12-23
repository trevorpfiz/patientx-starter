import { Stack } from "expo-router";

export default function PortalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(modals)/pdf"
        options={{
          presentation: "modal",
          headerTitleAlign: "center",
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
