"use client";

import { api } from "~/trpc/react";

export function PatientAppointments({ patientId }: { patientId: string }) {
  const { isLoading, isError, data, error } =
    api.scheduling.searchAppointments.useQuery({
      query: { patient: `Patient/${patientId}`, _sort: "date", _count: "100" },
    });

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
          appointments: data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
