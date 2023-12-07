import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import CreateMessage from "./_components/create-messages";
import Messages from "./_components/messages";

const MessagesPage = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          View messages between a patient and a practitioner, you can select by
          sender or recipient.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Messages />
      </CardContent>
      <CardHeader>
        <CardTitle>Send Message To Practitioner</CardTitle>
        <CardDescription>Send a message to a practitioner</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateMessage />
      </CardContent>
    </Card>
  );
};

export default MessagesPage;
