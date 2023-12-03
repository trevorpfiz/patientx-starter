"use client";

import React from "react";

import { api } from "~/trpc/react";

const GetPatient = ({ patientId }: { patientId: string }) => {
  const patientQuery = api.canvas.getPatient.useQuery({
    path: {
      patient_id: patientId,
    },
  });

  const searchPractitionerQuery = api.practitioner.searchPractitioner.useQuery({
    query: {

    }
  })
  console.log("searchPractitionerQuery", searchPractitionerQuery)
  return <div>get-patient</div>;
};

export default GetPatient;
