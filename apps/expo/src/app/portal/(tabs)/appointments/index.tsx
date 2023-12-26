import { Text, View } from "react-native";
import { useRouter } from "expo-router";

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
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-black">Hi</Text>
        <Button
          variant="outline"
          className="rounded-full border-blue-500"
          textClass="text-blue-500"
          onPress={() => router.push("/portal/(tabs)/appointments/schedule")}
        >
          Schedule an appointment
        </Button>
      </View>
      <Tabs defaultValue="upcoming">
        <View className="px-6 py-4">
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
          <Text className="text-black">
            View your completed appointments here.
          </Text>
        </TabsContent>
      </Tabs>
    </View>
  );
}
