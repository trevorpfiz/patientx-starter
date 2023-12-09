import React from "react";
import { Text } from "react-native";
import { Stack } from "expo-router";

import {
  LeftHeader,
  LeftHeaderBack,
  PortalHeader,
  RightHeader,
} from "~/components/ui/portal-header";

export default function HealthRecordLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <PortalHeader title="Health Record" />,
          //   headerLeft: () => <LeftHeader title="Health Record" />,
          //   headerRight: () => <RightHeader />,
          //   headerStyle: {
          //     backgroundColor: "#f3f4f6",
          //   },
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
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="forms"
        options={{
          title: "Forms",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="medications"
        options={{
          title: "Medications",
          headerStyle: {
            backgroundColor: "#fff",
          },
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
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
    </Stack>
  );
}
