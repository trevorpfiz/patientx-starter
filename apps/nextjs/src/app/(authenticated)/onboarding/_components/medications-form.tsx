"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useFieldArray, useForm } from "react-hook-form";

import { medicationsFormSchema } from "@acme/shared/src/validators/forms";
import type { MedicationsFormData } from "@acme/shared/src/validators/forms";
import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";
import MedicationSelector from "./medication-selector";
import { patientAtom } from "./welcome-form";

export function MedicationsForm(props: { onSuccess?: () => void }) {
  const [patientId] = useAtom(patientAtom);
  const toaster = useToast();

  const mutation = api.medication.submitMedicationStatement.useMutation({
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

  const form = useForm<MedicationsFormData>({
    resolver: zodResolver(medicationsFormSchema),
    defaultValues: {
      medicationStatementEntries: [
        {
          medication: { reference: "", display: "" },
          duration: "",
        },
      ],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    name: "medicationStatementEntries",
    control: form.control,
  });

  function onSubmit(data: MedicationsFormData) {
    let submitCount = 0;

    data.medicationStatementEntries.forEach((entry) => {
      const requestBody = {
        status: "active",
        medicationReference: entry.medication,
        subject: {
          reference: `Patient/${patientId}`,
        },
        // effectivePeriod: {}
        // dosage: []
      };

      // Submit each medication statement entry
      mutation.mutate(
        { body: requestBody },
        {
          onSuccess: () => {
            submitCount += 1;
            // Check if all conditions have been submitted
            if (submitCount === data.medicationStatementEntries.length) {
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
              <MedicationSelector
                form={form}
                name={`medicationStatementEntries.${index}.medication`}
              />
              {/* can add duration */}
              {/* can add dosage as well */}

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
                medication: { reference: "", display: "" },
                duration: "",
              })
            }
            className="mt-4"
          >
            Add Medication
          </Button>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
