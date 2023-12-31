import { Redirect, Stack } from "expo-router";
import { useAtom } from "jotai";

import { patientIdAtom, userJourneyAtom } from "~/app/(main)";
import { UserJourney } from "~/lib/constants";

export default function OnboardingLayout() {
  const [patientId] = useAtom(patientIdAtom);
  const [userJourney] = useAtom(userJourneyAtom);

  if (patientId) {
    if (userJourney === UserJourney.Portal) {
      return <Redirect href="/(main)/portal/(tabs)" />;
    }
  }

  return (
    <Stack>
      <Stack.Screen
        name="(modals)/pdf"
        options={{
          presentation: "modal",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="overview"
        options={{
          title: "Overview",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="medical-history"
        options={{
          title: "Medical History",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="coverage"
        options={{
          title: "Coverage",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="questionnaires"
        options={{
          title: "Questionnaires",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          title: "Schedule an appointment",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          title: "Confirmation",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
      />
    </Stack>
  );
}
