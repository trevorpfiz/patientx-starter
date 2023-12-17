"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useFieldArray, useForm } from "react-hook-form";

import { allergiesFormSchema } from "@acme/api/src/validators/forms";
import type { AllergiesFormData } from "@acme/api/src/validators/forms";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";
import AllergenSelector from "./allergen-selector";
import { patientAtom } from "./welcome-form";

export function AllergiesForm(props: { onSuccess?: () => void }) {
  const [patientId] = useAtom(patientAtom);
  const toaster = useToast();

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
    defaultValues: {
      allergyEntries: [
        {
          allergen: { code: "", display: "", system: "" },
          type: "allergy",
          severity: "mild",
        },
      ],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    name: "allergyEntries",
    control: form.control,
  });

  function onSubmit(data: AllergiesFormData) {
    let submitCount = 0;

    data.allergyEntries.forEach((entry) => {
      const requestBody = {
        clinicalStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              code: "active",
              display: "Active",
            },
          ],
          text: "Active",
        },
        verificationStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
              code: "confirmed",
              display: "Confirmed",
            },
          ],
          text: "Confirmed",
        },
        type: entry.type, // 'allergy' or 'intolerance'
        code: {
          coding: [
            {
              system: entry.allergen.system,
              code: entry.allergen.code,
              display: entry.allergen.display,
            },
          ],
          text: entry.allergen.display,
        },
        patient: {
          reference: `Patient/${patientId}`,
        },
        reaction: [
          {
            manifestation: [
              {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "unknown",
                    display: "Unknown",
                  },
                ],
                text: "Unknown",
              },
            ],
            severity: entry.severity, // 'mild', 'moderate', or 'severe'
          },
        ],
      };

      // Submit each allergy intolerance entry
      mutation.mutate(
        { body: requestBody },
        {
          onSuccess: () => {
            submitCount += 1;
            // Check if all conditions have been submitted
            if (submitCount === data.allergyEntries.length) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-start space-y-8">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between space-x-2"
            >
              <AllergenSelector
                form={form}
                name={`allergyEntries.${index}.allergen`}
              />

              <FormField
                control={form.control}
                name={`allergyEntries.${index}.type`}
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="allergy">allergy</SelectItem>
                        <SelectItem value="intolerance">intolerance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`allergyEntries.${index}.severity`}
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between">
                    <FormLabel>Severity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mild">mild</SelectItem>
                        <SelectItem value="moderate">moderate</SelectItem>
                        <SelectItem value="severe">severe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* can add reaction as well */}

              {/* Conditionally render the remove button */}
              {index !== 0 && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant={"destructive"}
                  className="mt-auto"
                >
                  X
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                allergen: { code: "", display: "", system: "" },
                type: "allergy",
                severity: "mild",
              })
            }
            className="mt-4"
          >
            Add Allergy
          </Button>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
