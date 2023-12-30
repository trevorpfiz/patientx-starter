import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useAtom } from "jotai";

import { patientIdAtom, userJourneyAtom } from "~/app/(main)";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { UserJourney } from "~/lib/constants";
import { atomWithMMKV } from "~/utils/atom-with-mmkv";
import { formatAppointmentDateTime } from "~/utils/dates";

export const onboardingDateAtom = atomWithMMKV("onboarding_date", "");

export default function ConfirmationPage() {
  const [onboardingDate] = useAtom(onboardingDateAtom);
  const [patientId] = useAtom(patientIdAtom);
  const [userJourney, setUserJourney] = useAtom(userJourneyAtom);

  if (!patientId) {
    return <Redirect href="/" />;
  }

  if (patientId) {
    if (userJourney === UserJourney.Onboarding) {
      return <Redirect href="/onboarding/overview" />;
    } else if (userJourney === UserJourney.Portal) {
      return <Redirect href="/(main)/portal/(tabs)" />;
    }
  }

  const appointmentDate = onboardingDate
    ? formatAppointmentDateTime(onboardingDate)
    : "you";

  return (
    <>
      <SafeAreaView className="flex-[0] bg-white" />
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 flex-col justify-between bg-gray-100">
          <View className="bg-white p-8 px-10">
            <Text className="pb-4 pt-8 text-4xl font-semibold">{`You're all set!`}</Text>
            <Text className="text-lg font-normal">{`Appointment for ${appointmentDate} is scheduled!`}</Text>
          </View>

          <View className="px-12 pb-4">
            <Button
              onPress={() => {
                // update the user journey to portal
                setUserJourney(UserJourney.Portal);
              }}
              textClass="text-center"
            >
              Head to Patient Portal
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
