import React from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import { atomWithMMKV } from "~/utils/atom-with-mmkv";
import { formatAppointmentDateTime } from "~/utils/dates";

export const onboardingDateAtom = atomWithMMKV("onboarding_date", "");

export default function ConfirmationPage() {
  const [onboardingDate] = useAtom(onboardingDateAtom);
  const router = useRouter();

  const appointmentDate = formatAppointmentDateTime(onboardingDate);

  return (
    <>
      <SafeAreaView className="flex-[0] bg-white" />
      <SafeAreaView className="flex-1 bg-transparent">
        <View className="flex-1 bg-gray-100">
          <View className="bg-white p-8 px-10">
            <Text className="text-4xl font-semibold">{`You're all set!`}</Text>
            <Text className="text-lg font-normal">{`Appointment for ${appointmentDate} is scheduled!`}</Text>
          </View>
          <View className="flex-1">
            <Text>Next Steps</Text>
            <Text>{`1. Your appointment will show up on the home page and the appointments tab of your patient portal`}</Text>
          </View>
          <Button
            title="Head to Patient Portal"
            onPress={() => router.replace("/portal/(tabs)/")}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
