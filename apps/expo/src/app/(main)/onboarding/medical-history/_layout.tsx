import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { Stack } from "expo-router";

import { LeftHeaderBack } from "~/components/ui/headers/tabs-header";

export default function OnboardingLayout() {
  return (
    <AutocompleteDropdownContextProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Medical History",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => <LeftHeaderBack />,
          }}
        />
        <Stack.Screen
          name="conditions"
          options={{
            title: "Conditions",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="medications"
          options={{
            title: "Medications",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="allergies"
          options={{
            title: "Allergies",
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
