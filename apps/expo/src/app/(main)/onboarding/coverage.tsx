import React from "react";
import { useRouter } from "expo-router";

import { CoverageForm } from "~/components/forms/coverage-form";

export default function CoveragePage() {
  const router = useRouter();

  return (
    <CoverageForm
      onSuccess={() => {
        // Go back to the overview screen
        router.back();
      }}
    />
  );
}
