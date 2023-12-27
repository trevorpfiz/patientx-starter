import React from "react";
import { SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScheduleAppointment from "~/components/schedule-appointment";

export default function ReschedulePage() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScheduleAppointment
        onSuccess={() => router.replace("/portal/(tabs)/appointments")}
        appointmentId={appointmentId}
      />
    </SafeAreaView>
  );
}
