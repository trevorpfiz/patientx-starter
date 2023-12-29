import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "(tabs)",
};

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
        name="(modals)/tasks"
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
