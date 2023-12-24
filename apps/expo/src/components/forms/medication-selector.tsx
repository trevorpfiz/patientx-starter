import React, { useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import type {
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { atom, useAtom } from "jotai";
import { PlusCircle } from "lucide-react-native";

import type { MedicationsStatementEntry } from "@acme/shared/src/validators/forms";

import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/utils/api";

export const selectedMedicationsAtom = atom<MedicationsStatementEntry[]>([]);

const MedicationSelector = () => {
  const [search, setSearch] = useState("");
  const [, setSelectedMedications] = useAtom(selectedMedicationsAtom);
  const debouncedSearch = useDebounce(search, 800);
  const dropdownController = useRef<AutocompleteDropdownRef | null>(null);

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

  const onSelectMedication = (item: TAutocompleteDropdownItem) => {
    if (item) {
      const newEntry = {
        medication: { reference: item.id, display: item.title ?? "" },
        duration: "", // Initialize duration; it can be updated as needed
      };
      setSelectedMedications((prev) => [...prev, newEntry]);
      setSearch("");

      // Clear the search input
      dropdownController.current?.clear();
    }
  };

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View className="flex-1 flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-8">
      <View className="flex-1">
        <AutocompleteDropdown
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          dataSet={dropdownItems}
          closeOnBlur={false}
          useFilter={false}
          clearOnFocus={false}
          textInputProps={{
            placeholder: "Add a medication...",
          }}
          onSelectItem={onSelectMedication}
          loading={isLoading}
          onChangeText={setSearch}
          onClear={onClearPress}
          suggestionsListTextStyle={{
            color: "#8f3c96",
          }}
          EmptyResultComponent={
            <Text style={{ padding: 10, fontSize: 15 }}>Type to search</Text>
          }
        />
      </View>
      {/* <TouchableOpacity onPress={onClearPress}>
        <PlusCircle size={24} color="#3b82f6" />
      </TouchableOpacity> */}
    </View>
  );
};

export default MedicationSelector;
