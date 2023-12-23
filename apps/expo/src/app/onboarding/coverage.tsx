import React from "react";
import { useRouter } from "expo-router";

import { CoverageForm } from "~/components/forms/coverage-form";

export default function CoveragePage() {
  const router = useRouter();

  return (
    <CoverageForm
      onSuccess={() => {
        // Go to the next step in onboarding
        router.replace("/onboarding/overview");
      }}
    />
  );
}
