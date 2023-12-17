"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";

import type { ConditionsFormData } from "@acme/api/src/validators/forms";
import { conditionsFormSchema } from "@acme/api/src/validators/forms";
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
import { patientAtom } from "./welcome-form";

const conditions = [
  {
    system: "http://hl7.org/fhir/sid/icd-10",
    code: "I10",
    display: "Hypertension",
  },
  {
    system: "http://hl7.org/fhir/sid/icd-10",
    code: "E11",
    display: "Type 2 diabetes",
  },
  {
    system: "http://hl7.org/fhir/sid/icd-10",
    code: "J45",
    display: "Asthma",
  },
] as const;

export function ConditionsForm(props: { onSuccess?: () => void }) {
  const [patientId] = useAtom(patientAtom);
  const toaster = useToast();

  const mutation = api.condition.submitCondition.useMutation({
    onSuccess: (data) => {
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
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

  const form = useForm<ConditionsFormData>({
    resolver: zodResolver(conditionsFormSchema),
    defaultValues: {
      conditions: [],
    },
  });

  function onSubmit(data: ConditionsFormData) {
    let submitCount = 0;

    data.conditions.map((condition) => {
      // Build the request body
      const requestBody = {
        clinicalStatus: {
          // TODO - is this correct?
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active",
              display: "Active",
            },
          ],
        },
        verificationStatus: {
          // TODO - is this correct?
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              code: "confirmed",
              display: "Confirmed",
            },
          ],
          text: "Confirmed",
        },
        category: [
          // TODO - is this correct?
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-category",
                code: "encounter-diagnosis",
                display: "Encounter Diagnosis",
              },
            ],
            text: "Encounter Diagnosis",
          },
        ],
        code: {
          coding: [
            {
              system: condition.system,
              code: condition.code,
              display: condition.display,
            },
          ],
          text: condition.display,
        },
        subject: {
          reference: `Patient/${patientId}`,
        },
      };

      // Submit each medication statement entry
      // console.log(requestBody);
      mutation.mutate(
        { body: requestBody },
        {
          onSuccess: () => {
            submitCount += 1;
            // Check if all conditions have been submitted
            if (submitCount === data.conditions.length) {
              // Call the passed onSuccess prop if it exists
              if (props.onSuccess) {
                props.onSuccess();
              }
            }
          },
        },
      );
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="conditions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Conditions</FormLabel>
                <FormDescription>
                  {`Please select the conditions that you have been or are presently being treated for. This information helps us develop a treatment plan best suited for you.`}
                </FormDescription>
              </div>
              {conditions.map((condition) => (
                <FormField
                  key={condition.code}
                  control={form.control}
                  name="conditions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={condition.code}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.some(
                              (c) => c.code === condition.code,
                            )}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, condition])
                                : field.onChange(
                                    field.value?.filter(
                                      (existingCondition) =>
                                        existingCondition.code !==
                                        condition.code,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {condition.display}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
