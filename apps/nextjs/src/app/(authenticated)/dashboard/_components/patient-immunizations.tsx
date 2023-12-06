"use client";

import { api } from "~/trpc/react";

export function PatientImmunizations({ patientId }: { patientId: string }) {
  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientImmunizations.useQuery({ patientId });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <pre>
      {JSON.stringify(
        {
          immunizations: data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
