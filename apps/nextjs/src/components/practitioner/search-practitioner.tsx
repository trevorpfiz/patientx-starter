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

const SearchPractitioner = ({
  setPractitioner,
}: {
  setPractitioner: Dispatch<SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { data } = api.practitioner.searchPractitioners.useQuery({
    query: {
      name: "",
    },
  });

  const practitioners = data?.entry.map((entry) => entry.resource) ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? practitioners?.find(
                (practitioner) =>
                  practitioner.name[0]!.text.toLowerCase() === value,
              )?.name[0]!.text
            : "Select practitioner..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search practitioner..." />
          <CommandEmpty>No practitioner found.</CommandEmpty>
          <CommandGroup>
            {practitioners?.map((practitioner) => (
              <CommandItem
                key={practitioner.id}
                value={practitioner.name[0]!.text}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  setPractitioner(practitioner.id);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === practitioner.name[0]!.text
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {practitioner.name[0]!.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchPractitioner;
