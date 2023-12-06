"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { coverageFormSchema } from "@acme/api/src/validators";
import type { CoverageForm } from "@acme/api/src/validators";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { useToast } from "@acme/ui/use-toast";

import { useStepStatusUpdater } from "~/components/ui/steps";
import { api } from "~/trpc/react";

export function CoverageForm(props: { onSuccess?: () => void }) {
  const toaster = useToast();
  const updater = useStepStatusUpdater();

  const mutation = api.canvas.submitCoverage.useMutation({
    onSuccess: (data) => {
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      updater.updateStepStatus("coverage", "complete");

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

  const form = useForm<CoverageForm>({
    resolver: zodResolver(coverageFormSchema),
    defaultValues: {
      subscriberId: "",
      payorId: "",
    },
  });

  function onSubmit(data: CoverageForm) {
    const requestBody = {
      status: "active",
      subscriber: {
        reference: `Patient/b685d0d97f604e1fb60f9ed089abc410`,
      },
      subscriberId: `${data.subscriberId}`,
      beneficiary: {
        reference: `Patient/b685d0d97f604e1fb60f9ed089abc410`,
      },
      relationship: {
        coding: [
          {
            system: "http://hl7.org/fhir/ValueSet/subscriber-relationship",
            code: "self",
          },
        ],
      },
      payor: [
        {
          identifier: {
            system: "https://www.claim.md/services/era/",
            value: `${data.payorId}`,
          },
          display: "Insurer company name",
        },
      ],
      order: 1,
    };

    // Submit coverage
    mutation.mutate({
      query: {},
      body: requestBody,
    });

    toaster.toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subscriberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Subscriber ID`}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Payor ID`}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}