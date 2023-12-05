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
import { api } from "~/trpc/server";

export const runtime = "edge";

const PatientIdPage = async ({ params }: { params: { patientId: string } }) => {
  const patient = await api.canvas.getPatient.query({
    path: {
      patient_id: params.patientId,
    },
  });

  const listReceivedMsgs = await api.communication.searchRecipientMsgs.query({
    query: {
      recipient: params.patientId,
    },
  });

  const listSendMsgs = await api.communication.searchSenderMsgs.query({
    query: {
      sender: params.patientId,
    },
  });

  const documents = await api.document.searchDocument.query({
    query: {
      subject: params.patientId
    }
  })

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
            {listReceivedMsgs.entry.map((msg, i) => (
              <TableRow key={i}>
                <TableCell>{msg.resource.sent}</TableCell>
                <TableCell>
                  {msg.resource.received ?? "No received yet"}
                </TableCell>
                <TableCell>{msg.resource.recipient[0]?.reference}</TableCell>
                <TableCell>{msg.resource.payload[0]?.contentString}</TableCell>
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
              <TableHead>Read</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listSendMsgs.entry.map((msg, i) => (
              <TableRow key={i}>
                <TableCell>{msg.resource.sent}</TableCell>
                <TableCell>
                  {msg.resource.received ?? "No received yet"}
                </TableCell>
                <TableCell>{msg.resource.recipient[0]?.reference}</TableCell>
                <TableCell>{msg.resource.payload[0]?.contentString}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardContent>
        <CardHeader>
          <CardTitle>
            Documents
          </CardTitle>
        </CardHeader>
        <Table>
          <TableCaption>A list of your documents.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Read</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc, i) => (
              <TableRow key={i}>
                <TableCell>{doc.resource.date}</TableCell>
                <TableCell>
                  test
                </TableCell>
                <TableCell>{doc.resource.content[0]?.attachment.url}</TableCell>
                <TableCell>{doc.resource.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientIdPage;
