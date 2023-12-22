import React, { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { AllergiesFormData } from "@acme/shared/src/validators/forms";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

import { useDebounce } from "~/lib/use-debounce";
import { api } from "~/trpc/react";

interface AllergenSelectorProps {
  form: UseFormReturn<AllergiesFormData>;
  name: `allergyEntries.${number}.allergen`;
}

const AllergenSelector: React.FC<AllergenSelectorProps> = ({ form, name }) => {
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
        })
        .slice(0, 5) ?? []
    );
  }, [allergensData]);

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <FormField
      control={form.control}
      name={name}
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
                  {field.value?.display || "Type to search..."}
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
                        form.setValue(name, allergen);
                        setOpen(false); // Close the popover
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AllergenSelector;
