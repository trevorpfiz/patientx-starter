import { Text } from "react-native";
import { Stack } from "expo-router";

import { AlertsRightHeaderClose } from "~/components/ui/headers/alerts-header";

export default function AlertsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Alerts",
          headerTitle: "",
          headerLeft: () => <Text className="text-xl font-bold">Alerts</Text>,
          headerRight: () => <AlertsRightHeaderClose />,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
