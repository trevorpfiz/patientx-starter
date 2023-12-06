"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Label } from "@acme/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";
import SearchPractitioner from "../practitioner/search-practitioner";

const CreateMessage = ({
  type,
  sender,
}: {
  type: "Patient" | "Practitioner";
  sender: string;
}) => {
  const [recipient, setRecipient] = useState("");
  const router = useRouter();

  const CreateMsgForm = z.object({
    recipient: z.string(),
    sender: z.string(),
    payload: z.string().min(2, {
      message: "Payload must be at least 2 characters.",
    }),
  });

  const createMsgForm = useForm<z.infer<typeof CreateMsgForm>>({
    resolver: zodResolver(CreateMsgForm),
    defaultValues: {
      recipient: recipient,
      sender: sender,
      payload: "",
    },
  });

  const createCommunication = api.communication.createMsg.useMutation({
    onMutate: () => {
      console.log("Mutating");
    },
    onSettled: () => {
      console.log("Settled");
    },
    onSuccess: () => {
      toast({
        title: "New message created!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(createMsgForm.getValues(), null, 2)}
            </code>
          </pre>
        ),
      });

      router.refresh();
    },
  });

  const onCreateCommunication = async (data: z.infer<typeof CreateMsgForm>) => {
    try {
      (data.recipient = `Practitioner/${recipient}`),
        (data.sender = `${
          type === "Patient" ? "Patient/" : "Practitioner/"
        }${sender}`);

      await createCommunication.mutateAsync(data);

      toast({
        title: "New message created!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (e) {}
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Create Message</Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-full flex-col gap-4">
        <Form {...createMsgForm}>
          <form
            onSubmit={createMsgForm.handleSubmit(onCreateCommunication)}
            className="space-y-6"
          >
            <Label>Send To</Label>
            <SearchPractitioner setPractitioner={setRecipient} />
            <FormField
              control={createMsgForm.control}
              name="payload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Payload</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Message payload"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Message payload</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateMessage;
