"use client";

import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(landing)/_components/patient";
import { api } from "~/trpc/react";

export function PatientAllergies() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.canvas.getPatientAllergies.useQuery({ patientId });

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
          allergies: data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
