"use client";

import { api } from "~/trpc/react";

export function PatientForms({ patientId }: { patientId: string }) {
  const consents = api.patientMedicalHistory.getPatientConsents.useQuery({
    patientId,
  });
  const goals = api.patientMedicalHistory.getPatientGoals.useQuery({
    patientId,
  });
  const responses =
    api.patientMedicalHistory.getPatientQuestionnaireResponses.useQuery({
      patientId,
    });

  if (consents.isLoading || goals.isLoading || responses.isLoading) {
    return <span>Loading...</span>;
  }

  if (consents.isError || goals.isError || responses.isError) {
    return (
      <span>
        Error: {consents.error?.message} {goals.error?.message}{" "}
        {responses.error?.message}
      </span>
    );
  }

  return (
    <pre>
      {JSON.stringify(
        {
          consents: consents.data ?? null,
          goals: goals.data ?? null,
          responses: responses.data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
