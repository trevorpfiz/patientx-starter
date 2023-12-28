import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  const insets = useSafeAreaInsets();

  return (
    <AutocompleteDropdownContextProvider>
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
          name="medical-history/index"
          options={{
            title: "Medical History",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShown: true,
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
    </AutocompleteDropdownContextProvider>
  );
}
