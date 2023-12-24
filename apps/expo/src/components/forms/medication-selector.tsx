import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dimensions, Platform, Text, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { MedicationsFormData } from "@acme/shared/src/validators/forms";

import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/utils/api";

interface MedicationSelectorProps {
  form: UseFormReturn<MedicationsFormData>;
  name: `medicationStatementEntries.${number}.medication`;
}

const MedicationSelector: React.FC<MedicationSelectorProps> = ({
  form,
  name,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 800);

  // Fetching medications from the API
  const {
    isError,
    data: medicationsData,
    error,
    isInitialLoading,
    isRefetching,
  } = api.medication.searchMedications.useQuery(
    {
      query: {
        _text: debouncedSearch,
      },
    },
    {
      enabled: !!debouncedSearch,
    },
  );
  const isLoading = isInitialLoading || isRefetching;

  // Prepare items for the dropdown
  const dropdownItems =
    medicationsData?.entry?.map((item) => ({
      id: `Medication/${item.resource.id}`,
      title: item.resource.code?.coding?.[0]?.display ?? "",
    })) ?? [];

  const onClearPress = useCallback(() => {
    setSearch("");
  }, []);

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="flex-1 flex-col">
          <AutocompleteDropdown
            dataSet={dropdownItems}
            closeOnBlur={false}
            useFilter={false}
            clearOnFocus={false}
            textInputProps={{
              placeholder: "Search for medication...",
            }}
            onSelectItem={(item) => {
              if (item) {
                onChange({ reference: item.id, display: item.title });
              }
            }}
            loading={isLoading}
            onChangeText={setSearch}
            onClear={onClearPress}
            suggestionsListTextStyle={{
              color: "#8f3c96",
            }}
            EmptyResultComponent={
              <Text style={{ padding: 10, fontSize: 15 }}>Oops ¯\_(ツ)_/¯</Text>
            }
          />
          {error && <Text>{error?.message}</Text>}
        </View>
      )}
    />
  );
};

export default MedicationSelector;
