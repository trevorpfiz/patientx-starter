import { Stack } from "expo-router";

import {
  LeftHeaderBack,
  TabsHeader,
} from "~/components/ui/headers/tabs-header";

export default function HealthRecordLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <TabsHeader title="Health Record" />,
          // FIXME: Header transitions are smoother without using header, but can't set height?
          //   headerLeft: () => <TabsLeftHeader title="Health Record" />,
          //   headerRight: () => <TabsRightHeader />,
          //   headerStyle: {
          //     backgroundColor: "#f3f4f6",
          //   },
          // headerTitleAlign: "center",
          //   headerTitle: "",
        }}
      />
      <Stack.Screen
        name="test-results"
        options={{
          title: "Test Results",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forms"
        options={{
          title: "Forms",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="medications"
        options={{
          title: "Medications",
          headerStyle: {
            backgroundColor: "#fff",
          },
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
          headerTitleAlign: "center",
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="allergies"
        options={{
          title: "Allergies",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "center",
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="immunizations"
        options={{
          title: "Immunizations",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "center",
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
    </Stack>
  );
}
