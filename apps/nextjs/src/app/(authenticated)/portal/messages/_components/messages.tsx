"use client";

import { useState } from "react";

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
  const { data } = api.communication.searchMsgs.useQuery(
    {
      query: {
        sender: patient,
        recipient: practitioner,
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
          <Label>Sender</Label>
          <SearchPatient setPatient={setPatient} />
        </div>
        <div className="flex w-full flex-col gap-4">
          <Label>Recipient</Label>
          <SearchPractitioner setPractitioner={setPractitioner} />
        </div>
      </div>
      {data && (
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
      )}
    </div>
  );
};

export default Messages;
