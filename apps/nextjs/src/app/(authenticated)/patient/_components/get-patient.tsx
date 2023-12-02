"use client";

import React from "react";

import { api } from "~/trpc/react";

const GetPatient = ({ patientId }: { patientId: string }) => {
  const { data } = api.canvas.getPatient.useQuery({
    id: patientId,
  });
  console.log("DATA", data);
  return <div>get-patient</div>;
};

export default GetPatient;
