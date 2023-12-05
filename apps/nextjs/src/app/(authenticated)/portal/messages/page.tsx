import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

import Messages from "./_components/messages";

const MessagesPage = async () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Messages />
      </CardContent>
    </Card>
  );
};

export default MessagesPage;
