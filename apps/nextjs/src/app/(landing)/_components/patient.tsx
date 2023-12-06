"use client";

import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>{data?.name?.[0]?.family ?? ""}</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href={`patient/${data.id}`}>
          <Button>View Patient</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
