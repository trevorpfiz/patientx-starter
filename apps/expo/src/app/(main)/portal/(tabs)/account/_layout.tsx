import { Stack } from "expo-router";

import {
  LeftHeaderBack,
  TabsHeader,
} from "~/components/ui/headers/tabs-header";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <TabsHeader title="Account" />,
        }}
      />
      <Stack.Screen
        name="billing"
        options={{
          title: "Billing Statements",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "center",
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
      <Stack.Screen
        name="pay-bill"
        options={{
          title: "Pay My Bill",
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
