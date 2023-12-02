"use client";

import { api } from "~/trpc/react";

export function Patient() {
  const { data, isLoading, isError, error } = api.canvas.getPatient.useQuery({
    path: {
      patient_id: "b685d0d97f604e1fb60f9ed089abc410",
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <p>{data?.name?.[0]?.family ?? ""}</p>
    </div>
  );
}
