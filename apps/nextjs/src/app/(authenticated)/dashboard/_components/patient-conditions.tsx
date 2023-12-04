"use client";

import { api } from "~/trpc/react";

export function PatientConditions({ patientId }: { patientId: string }) {
  const { isLoading, isError, data, error } =
    api.canvas.getPatientConditions.useQuery({ patientId });

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
          conditions: data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
