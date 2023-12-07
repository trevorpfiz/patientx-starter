"use client";

import { useState } from "react";

import { Button } from "@acme/ui/button";
import { Label } from "@acme/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import SearchPatient from "~/components/patient/search-patient";
import SearchPractitioner from "~/components/practitioner/search-practitioner";
import { api } from "~/trpc/react";

const Messages = () => {
  const [practitioner, setPractitioner] = useState("");
  const [patient, setPatient] = useState("");
  const [type, setType] = useState<"Patient" | "Practitioner">("Patient");
  const { data } = api.communication.searchMsgs.useQuery(
    {
      query: {
        sender:
          type === "Patient"
            ? `Patient/${patient}`
            : `Practitioner/${practitioner}`,
        recipient:
          type === "Patient"
            ? `Practitioner/${practitioner}`
            : `Patient/${patient}`,
      },
    },
    {
      enabled: !!patient && !!practitioner,
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex w-full flex-col gap-4">
          <Label>
            {type === "Patient" ? "Patient Sender" : "Patient Recipient"}
          </Label>
          <SearchPatient setPatient={setPatient} />
        </div>
        <Button
          className="w-20"
          title="Swap sender and recipient"
          onClick={() =>
            setType(type === "Patient" ? "Practitioner" : "Patient")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
          </svg>
        </Button>
        <div className="flex w-full flex-col gap-4">
          <Label>
            {type === "Patient"
              ? "Practitioner Recipient"
              : "Practitioner Sender"}
          </Label>
          <SearchPractitioner setPractitioner={setPractitioner} />
        </div>
      </div>
      {data ? (
        <Table>
          <TableCaption>A list of your recent messages sent.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((msg, i) => (
              <TableRow key={i}>
                <TableCell>{msg.resource.sent}</TableCell>
                <TableCell>
                  {msg.resource.received ?? "No received yet"}
                </TableCell>
                <TableCell>{msg.resource.sender.reference}</TableCell>
                <TableCell>{msg.resource.recipient[0]?.reference}</TableCell>
                <TableCell>{msg.resource.payload[0]?.contentString}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">No messages found</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
