import { Stack } from "expo-router";

import { TabsHeader } from "~/components/ui/headers/tabs-header";

export default function AppointmentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <TabsHeader title="Appointments" />,
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          title: "Schedule",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
      <Stack.Screen
        name="reschedule"
        options={{
          title: "Reschedule",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </Stack>
  );
}
