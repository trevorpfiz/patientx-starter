import { Stack } from "expo-router";

export default function OnboardingLayout() {
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
        name="index"
        options={{
          title: "Welcome",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="overview"
        options={{
          title: "Overview",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="medical-history"
        options={{
          title: "Medical History",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="coverage"
        options={{
          title: "Coverage",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="questionnaires/index"
        options={{
          title: "Questionnaires",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          title: "Schedule an appointment",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          title: "Confirmation",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
    </Stack>
  );
}
