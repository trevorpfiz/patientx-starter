import React from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

import ScheduleAppointment from "~/components/schedule-appointment";

export default function SchedulePage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScheduleAppointment
        onSuccess={() => router.replace("/portal/appointments")}
      />
    </SafeAreaView>
  );
}
