import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import CompletedAppointments from "~/components/completed-appointments";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/nativecn-ui/Tabs";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import UpcomingAppointments from "~/components/upcoming-appointments";

export default function Appointments() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-black"></Text>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-blue-500 bg-gray-50"
          textClass="text-blue-500"
          onPress={() => router.push("/portal/appointments/schedule")}
        >
          Schedule an appointment
        </Button>
      </View>
      <Tabs defaultValue="upcoming">
        <View className="px-6 pb-2 pt-2">
          <TabsList>
            <TabsTrigger id="upcoming" title="Upcoming" />
            <TabsTrigger id="completed" title="Completed" />
          </TabsList>
        </View>
        <TabsContent value="upcoming">
          <View className="flex-1">
            <UpcomingAppointments />
          </View>
        </TabsContent>
        <TabsContent value="completed">
          <View className="flex-1">
            <CompletedAppointments />
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}
