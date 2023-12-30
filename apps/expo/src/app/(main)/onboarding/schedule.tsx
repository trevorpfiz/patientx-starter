import React from "react";
import { SafeAreaView } from "react-native";
import { useAtom } from "jotai";

import { userJourneyAtom } from "~/app/(main)";
import ScheduleAppointment from "~/components/schedule-appointment";
import { UserJourney } from "~/lib/constants";

export default function SchedulePage() {
  const [, setUserJourney] = useAtom(userJourneyAtom);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScheduleAppointment
        onSuccess={() => {
          // set the user journey to confirmation
          setUserJourney(UserJourney.Confirmation);
        }}
        onboarding={true}
      />
    </SafeAreaView>
  );
}
