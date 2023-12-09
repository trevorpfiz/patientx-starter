import { Stack } from "expo-router";

import {
  LeftHeaderBack,
  TabsHeader,
} from "~/components/ui/tabs-header";

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
          title: "Billing",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeft: () => <LeftHeaderBack />,
        }}
      />
    </Stack>
  );
}

