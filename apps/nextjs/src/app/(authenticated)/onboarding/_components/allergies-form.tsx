"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { allergiesFormSchema } from "@acme/api/src/validators/forms";
import type { AllergiesFormData } from "@acme/api/src/validators/forms";
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

import { useStepStatusUpdater } from "~/components/ui/steps";
import { api } from "~/trpc/react";

export function AllergiesForm(props: { onSuccess?: () => void }) {
  const toaster = useToast();
  const updater = useStepStatusUpdater();

  const allergenQuery = api.allergyIntolerance.searchAllergens.useQuery({
    query: {},
  });

  const mutation = api.allergyIntolerance.submitAllergyIntolerance.useMutation({
    onSuccess: (data) => {
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      updater.updateStepStatus("medical-history", "complete");

      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
    onError: (error) => {
      // Show an error toast
      toaster.toast({
        title: "Error submitting medical history",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<AllergiesFormData>({
    resolver: zodResolver(allergiesFormSchema),
  });

  function onSubmit(data: AllergiesFormData) {
    const requestBody = {};

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
