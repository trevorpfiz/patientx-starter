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

import SearchPatient from "~/components/patient/search-patient";
import SearchPractitioner from "~/components/practitioner/search-practitioner";
import { api } from "~/trpc/react";

const CreateMessage = () => {
  const [practitioner, setPractitioner] = useState("");
  const [patient, setPatient] = useState("");
  const [type, setType] = useState<"Patient" | "Practitioner">("Patient");
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
      recipient: type === "Patient" ? practitioner : patient,
      sender: type === "Patient" ? patient : practitioner,
      payload: "",
    },
  });

  const createCommunication = api.communication.createMsg.useMutation({
    onSuccess: () => {
      toast({
        title: "New message created!",
        description: (
          <div className="flex flex-col gap-4">
            {type === "Patient" ? "Patient" : "Practitioner"} Sender:{" "}
            {type === "Patient" ? patient : practitioner} with payload:{" "}
            {createMsgForm.getValues("payload")}
          </div>
        ),
      });

      router.refresh();
      createMsgForm.reset();
    },
  });

  const onCreateCommunication = async (data: z.infer<typeof CreateMsgForm>) => {
    try {
      if (type === "Patient") {
        data.recipient = `Practitioner/${practitioner}`;
        data.sender = `Patient/${patient}`;
      } else {
        data.recipient = `Patient/${patient}`;
        data.sender = `Practitioner/${practitioner}`;
      }

      await createCommunication.mutateAsync(data);
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
            <Label>
              {type === "Patient" ? "Patient" : "Practitioner"} Sender
            </Label>
            {type === "Patient" ? (
              <SearchPatient setPatient={setPatient} />
            ) : (
              <SearchPractitioner setPractitioner={setPractitioner} />
            )}

            <Label>
              {type === "Patient" ? "Practitioner" : "Patient"} Recipient
            </Label>
            {type === "Patient" ? (
              <SearchPractitioner setPractitioner={setPractitioner} />
            ) : (
              <SearchPatient setPatient={setPatient} />
            )}

            <Button
              className="w-full"
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
