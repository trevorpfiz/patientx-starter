"use client";

import { api } from "~/trpc/react";

export function PatientTestResults({ patientId }: { patientId: string }) {
  const reports = api.canvas.getPatientDiagnosticReports.useQuery({
    patientId,
  });
  const documents = api.canvas.getPatientDocuments.useQuery({ patientId });
  const observations = api.canvas.getPatientObservations.useQuery({
    patientId,
  });

  if (reports.isLoading || documents.isLoading || observations.isLoading) {
    return <span>Loading...</span>;
  }

  if (reports.isError || documents.isError || observations.isError) {
    <span>
      Error: {reports.error?.message} {documents.error?.message}{" "}
      {observations.error?.message}
    </span>;
  }

  return (
    <pre>
      {JSON.stringify(
        {
          reports: reports.data ?? null,
          documents: documents.data ?? null,
          observations: observations.data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
