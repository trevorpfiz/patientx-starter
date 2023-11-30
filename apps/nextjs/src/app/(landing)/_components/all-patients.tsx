"use client";

import { api } from "~/trpc/react";

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
            return (
              <li key={patient?.id}>
                <p>ID: {patient?.id}</p>
                <p>Given Name: {patient?.name?.[0]?.given}</p>
                <p>Family Name: {patient?.name?.[0]?.family}</p>
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
