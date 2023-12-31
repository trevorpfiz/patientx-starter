import React from "react";
import { Redirect } from "expo-router";
import { useAtom } from "jotai";

import { userJourneyAtom } from "~/app/(main)";
import { WelcomeForm } from "~/components/forms/welcome-form";
import { UserJourney } from "~/lib/constants";

export default function WelcomePage() {
  const [patientId] = useAtom(userJourneyAtom);
  const [userJourney, setUserJourney] = useAtom(userJourneyAtom);

  if (patientId) {
    if (userJourney === UserJourney.Onboarding) {
      return <Redirect href="/onboarding/overview" />;
    }
  }

  return (
    <WelcomeForm
      onSuccess={() => {
        // set the user journey to onboarding
        setUserJourney(UserJourney.Onboarding);
      }}
    />
  );
}
