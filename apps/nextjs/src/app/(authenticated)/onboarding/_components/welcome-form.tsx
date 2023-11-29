"use client";

import { useRouter } from "next/navigation";

import type { NewPatient } from "@acme/api/src/validators";
import { newPatientSchema } from "@acme/api/src/validators";
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
import { Input } from "@acme/ui/input";
import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";

export const WelcomeForm = (props: {
  onSuccess?: (data: NewPatient) => void;
}) => {
  const router = useRouter();
  const toaster = useToast();

  const form = useZodForm({
    schema: newPatientSchema,
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(data: NewPatient) {
    try {
      //   const projectId = await api.project.create.mutate(data); TODO
      if (props.onSuccess) {
        props.onSuccess({
          ...data,
        });
      } else {
        router.push(`/onboarding`);
      }
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      toaster.toast({
        title: "Error submitting answer",
        variant: "destructive",
        description:
          "An issue occurred while submitting answer. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Name`}</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Address`}</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Phone number`}</FormLabel>
              <FormControl>
                <Input placeholder="555-555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
