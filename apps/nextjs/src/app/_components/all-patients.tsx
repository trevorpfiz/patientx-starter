"use client";

import { api } from "~/utils/api";

export function AllPatients() {
  const {
    data: patientBundle,
    isLoading,
    isError,
    error,
  } = api.canvas.getAllPatients.useQuery();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const patients = patientBundle?.entry?.map((entry) => entry.resource) ?? [];

  return (
    <div>
      <h3>All Patients:</h3>
      {patients.length > 0 ? (
        <ul>
          {patients.map((patient) => {
            const firstName = patient?.name?.[0] as
              | {
                  use: string;
                  period: { start: string; end: string };
                  family: string;
                  given: string[];
                }
              | undefined;

            return (
              <li key={patient?.id}>
                <p>ID: {patient?.id}</p>
                <p>
                  Name: {firstName?.family ? `${firstName.family}, ` : ""}
                  {firstName?.given.join(" ")}
                </p>
                {/* Include more patient details as needed */}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
}
