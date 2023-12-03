"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { consentFormSchema } from "@acme/api/src/validators";
import type { ConsentForm } from "@acme/api/src/validators";
import { Button } from "@acme/ui/button";
import { Checkbox } from "@acme/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";
import { uploadTestPdf } from "./upload-test";

export function ConsentForm(props: { onSuccess?: () => void }) {
  const mutation = api.canvas.submitConsent.useMutation({
    onSuccess: (data) => {
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
    onError: (error) => {
      // Show an error toast
      toaster.toast({
        title: "Error submitting consent",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const router = useRouter();
  const toaster = useToast();

  const form = useForm<ConsentForm>({
    resolver: zodResolver(consentFormSchema),
  });

  function onSubmit(data: ConsentForm) {
    const requestBody = {
      status: "active",
      scope: {},
      category: [
        {
          coding: [
            {
              system: "LONIC",
              code: "59284-0",
              display: "Generic consent",
            },
            // {
            //   system: "LONIC",
            //   code: "64290-0",
            //   display: "Health insurance card consent",
            // },
            // TODO - 2nd consent not working?
          ],
        },
      ],
      patient: {
        reference: `Patient/b685d0d97f604e1fb60f9ed089abc410`, // TODO: replace with patient id
      },
      dateTime: new Date().toISOString(),
      sourceAttachment: {
        contentType: "application/pdf",
        title: "UploadTest.pdf",
        data: uploadTestPdf,
      },
      provision: {
        period: {
          start: "2023-12-03",
          end: "2024-12-03",
        },
      },
    };

    // Submit consent
    mutation.mutate({
      body: requestBody,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="generic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{`Generic consent`}</FormLabel>
                <FormDescription>
                  {`This will allow us to use the health data you share with us.`}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="insurance"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{`Health insurance consent`}</FormLabel>
                <FormDescription>
                  {`I consent to share my health insurance information`}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
