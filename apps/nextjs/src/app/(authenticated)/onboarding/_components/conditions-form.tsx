"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";

import { allergiesFormSchema } from "@acme/api/src/validators/forms";
import type { AllergiesFormData } from "@acme/api/src/validators/forms";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@acme/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";
import { patientAtom } from "./welcome-form";

export function ConditionsForm(props: { onSuccess?: () => void }) {
  const [patientId] = useAtom(patientAtom);
  const toaster = useToast();

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
    const requestBody = {
      resourceType: "AllergyIntolerance",
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
      type: data.type, // 'allergy' or 'intolerance'
      code: {
        coding: [
          {
            system: "http://your-coding-system.com/", // Replace with actual system URL
            code: data.allergen, // This should be the code corresponding to the selected allergen
            display: allergenOptions.find((a) => a.value === data.allergen)
              ?.label, // The display name of the allergen
          },
        ],
        text: allergenOptions.find((a) => a.value === data.allergen)?.label, // The display name of the allergen
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
                  system: "http://your-reaction-coding-system.com/", // Replace with actual system URL
                  code: data.reaction, // This should be the code corresponding to the selected reaction
                  display: "Reaction display", // Replace with actual display for the reaction
                },
              ],
              text: "Reaction text", // Replace with actual text for the reaction
            },
          ],
          severity: data.severity, // This should be 'mild', 'moderate', or 'severe'
        },
      ],
    };

    // Submit consent
    console.log(requestBody);
    // mutation.mutate({
    //   body: requestBody,
    // });
  }

  const allergenOptions =
    allergenQuery.data?.entry?.map((item) => ({
      label: item.resource?.code?.coding?.[0]?.display, // or any other relevant property
      value: item.resource.id, // Assuming you want to use the ID as the value
    })) ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="allergen"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Allergen</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allergenOptions.find(
                            (allergen) => allergen.value === field.value,
                          )?.label
                        : "Select allergen"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search allergen..." />
                    <CommandEmpty>No allergen found.</CommandEmpty>
                    <CommandGroup>
                      {allergenOptions.map((allergen) => (
                        <CommandItem
                          value={allergen.label}
                          key={allergen.value}
                          onSelect={() => {
                            form.setValue("allergen", allergen.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              allergen.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {allergen.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the allergen that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="reaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reaction</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="L50.0">Hives</SelectItem>
                  <SelectItem value="R10.9">Stomach cramps</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
