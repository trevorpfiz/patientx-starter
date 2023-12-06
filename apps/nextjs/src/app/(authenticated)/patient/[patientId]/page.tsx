import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import CreateMessage from "~/components/communication/create-message";
import { formatDateTime } from "~/lib/utils";
import { api } from "~/trpc/server";

export const runtime = "edge";

const PatientIdPage = async ({ params }: { params: { patientId: string } }) => {
  const patient = await api.patient.getPatient.query({
    path: {
      patient_id: params.patientId,
    },
  });

  const listReceivedMsgs = await api.communication.searchRecipientMsgs.query({
    query: {
      recipient: `Patient/${params.patientId}`,
    },
  });

  const listSendMsgs = await api.communication.searchSenderMsgs.query({
    query: {
      sender: `Patient/${params.patientId}`,
    },
  });

  const billDocuments = await api.document.searchBillDocument.query({
    query: {
      subject: `Patient/${params.patientId}`,
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{patient?.name![0]?.given![0]}</CardTitle>
        <CardDescription>Id: {patient.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateMessage type="Patient" sender={patient.id!} />
      </CardContent>
      <CardContent>
        <CardHeader>
          <CardTitle>Messages Received</CardTitle>
        </CardHeader>
        <Table>
          <TableCaption>A list of your recent messages received.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listReceivedMsgs.total > 0 &&
              listReceivedMsgs.entry.map((msg, i) => (
                <TableRow key={i}>
                  <TableCell>{msg.resource.sent}</TableCell>
                  <TableCell>
                    {msg.resource.received ?? "No received yet"}
                  </TableCell>
                  <TableCell>{msg.resource.recipient[0]?.reference}</TableCell>
                  <TableCell>
                    {msg.resource.payload[0]?.contentString}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardContent>
        <CardHeader>
          <CardTitle>Messages Sent</CardTitle>
        </CardHeader>
        <Table>
          <TableCaption>A list of your recent messages sent.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listSendMsgs.total > 0 &&
              listSendMsgs.entry.map((msg, i) => (
                <TableRow key={i}>
                  <TableCell>{msg.resource.sent}</TableCell>
                  <TableCell>
                    {msg.resource.received ?? "No received yet"}
                  </TableCell>
                  <TableCell>{msg.resource.recipient[0]?.reference}</TableCell>
                  <TableCell>
                    {msg.resource.payload[0]?.contentString}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardContent>
        <CardHeader>
          <CardTitle>Bills</CardTitle>
        </CardHeader>
        <Table>
          <TableCaption>A list of your bills</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Bill</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* @ts-expect-error: unable to get the zod schema correct for documentReference */}
            {billDocuments.total > 0 &&
              // @ts-expect-error
              billDocuments?.entry?.map((doc, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {formatDateTime(new Date(doc.resource.date))}{" "}
                  </TableCell>
                  <TableCell>
                    <a
                      href={doc.resource.content[0]?.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant={"link"}>View Bill</Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientIdPage;
