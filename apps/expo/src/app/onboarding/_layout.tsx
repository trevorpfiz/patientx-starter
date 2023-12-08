import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3b82f6",
        },
        headerTintColor: "#000",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
