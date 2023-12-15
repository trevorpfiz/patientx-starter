"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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

import { useDebounce } from "~/lib/use-debounce";
import { api } from "~/trpc/react";
import { patientAtom } from "./welcome-form";

export function AllergiesForm(props: { onSuccess?: () => void }) {
  const [patientId] = useAtom(patientAtom);
  const toaster = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);
  const [open, setOpen] = useState(false);

  const {
    isError,
    data: allergensData,
    error,
    isInitialLoading,
    isRefetching,
  } = api.allergyIntolerance.searchAllergens.useQuery(
    {
      query: {
        _text: debouncedSearch,
      },
    },
    {
      enabled: !!debouncedSearch,
    },
  );
  const isLoading = isInitialLoading || isRefetching; // @link https://github.com/TanStack/query/issues/3584#issuecomment-1369491188

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
            system: data.allergen.system,
            code: data.allergen.code,
            display: data.allergen.display,
          },
        ],
        text: data.allergen.display,
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

  // Extract and de-duplicate allergen options from the fetched data
  const allergenOptions = useMemo(() => {
    const seen = new Set();
    return (
      allergensData?.entry
        ?.map((item) => ({
          display: item.resource?.code?.coding?.[0]?.display ?? "",
          code: item.resource?.code?.coding?.[0]?.code ?? "",
          system: item.resource?.code?.coding?.[0]?.system ?? "",
        }))
        .filter((allergen) => {
          const displayLowerCase = allergen.display.toLowerCase();
          return seen.has(displayLowerCase)
            ? false
            : seen.add(displayLowerCase);
        }) ?? []
    );
  }, [allergensData]);

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="allergen"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Allergen</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allergenOptions.find(
                            (allergen) => allergen.code === field.value.code,
                          )?.display
                        : "Type to search..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search allergen..."
                      onValueChange={(search) => setSearch(search)}
                    />
                    <div className="flex items-center justify-center">
                      {isLoading && (
                        <Loader2 className="mt-2 h-6 w-6 animate-spin" />
                      )}
                    </div>

                    <CommandEmpty>No allergen found.</CommandEmpty>

                    <CommandGroup>
                      {allergenOptions.map((allergen) => (
                        <CommandItem
                          value={allergen.display}
                          key={allergen.code}
                          onSelect={() => {
                            form.setValue("allergen", allergen);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              allergen.code === field.value?.code
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {allergen.display}
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

        {/* can add reaction as well */}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
