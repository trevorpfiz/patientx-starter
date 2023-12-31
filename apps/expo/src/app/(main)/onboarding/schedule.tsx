import React from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import { userJourneyAtom } from "~/app/(main)";
import ScheduleAppointment from "~/components/schedule-appointment";
import { UserJourney } from "~/lib/constants";

export default function SchedulePage() {
  const [, setUserJourney] = useAtom(userJourneyAtom);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScheduleAppointment
        onSuccess={() => {
          // set the user journey to confirmation
          setUserJourney(UserJourney.Confirmation);

          // navigate to confirmation page
          router.replace("/onboarding/confirmation");
        }}
        onboarding={true}
      />
    </SafeAreaView>
  );
}
