import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { WelcomeForm } from "~/components/forms/welcome-form";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <WelcomeForm
      onSuccess={() => {
        // Go to the next step in onboarding
        router.replace(`/onboarding/steps`);
      }}
    />
  );
}
