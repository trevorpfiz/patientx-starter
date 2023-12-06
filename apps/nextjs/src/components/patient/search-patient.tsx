"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@acme/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

import { api } from "~/trpc/react";

const SearchPatient = ({
  setPatient,
}: {
  setPatient: Dispatch<SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { data, isLoading, isError, error } =
    api.canvas.getAllPatients.useQuery({
      query: {},
    });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const patients = data?.entry?.map((entry) => entry.resource) ?? [];

  return (
    <div className="w-full">
      {patients?.length > 0 ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? // @ts-expect-error
                  patients?.find(
                    (patient) =>
                      // @ts-expect-error
                      patient?.name[0]?.family?.toLowerCase() === value,
                  )?.name[0]!.family
                : "Select patient..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search practitioner..." />
              <CommandEmpty>No practitioner found.</CommandEmpty>
              <CommandGroup>
                {patients?.map((patient, i) => (
                  <CommandItem
                    key={i}
                    // @ts-expect-error: Undefined or null
                    value={patient?.name[0]?.family}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setPatient(patient?.id!);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        // @ts-expect-error: Undefined or null
                        value === patient?.name[0]?.family
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {/* @ts-expect-error: Undefined or null */}
                    {patient?.name[0]?.family}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};

export default SearchPatient;
