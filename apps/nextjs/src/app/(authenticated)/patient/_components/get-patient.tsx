"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import React from "react";
import CreateMessage from "~/components/communication/create-message";

import { api } from "~/trpc/react";

const GetPatient = ({ patientId }: { patientId: string }) => {
  const { data: patientData } = api.canvas.getPatient.useQuery({
    path: {
      patient_id: patientId,
    },
  });

  return (<Card className="w-full">
    {patientData && (
      <CardHeader>
        <CardTitle>
          {patientData.name![0] && patientData.name![0].given![0]}
        </CardTitle>
        <CardDescription>
          Id: {patientData.id}
        </CardDescription>
      </CardHeader>
    )}
    <CardContent>
      <CreateMessage type="Patient" sender={patientId} />
    </CardContent>
  </Card>)
};

export default GetPatient;
