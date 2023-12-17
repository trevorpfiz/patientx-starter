import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f3f4f6",
        },
        headerTintColor: "#000",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="steps"
        options={{
          title: "Steps",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="medical-history"
        options={{
          title: "Medical History",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="insurance"
        options={{
          title: "Insurance",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="questionnaire"
        options={{
          title: "Questionnaire",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          title: "Schedule",
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
