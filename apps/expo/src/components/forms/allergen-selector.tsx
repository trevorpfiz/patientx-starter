import React, { useCallback, useRef, useState } from "react";
import type { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import type {
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { PlusCircle } from "lucide-react-native";

import type { AllergyEntry } from "@acme/shared/src/validators/forms";

import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/utils/api";

interface AllergenSelectorProps {
  onAllergenSelected: (allergen: AllergyEntry) => void;
}

interface AllergenItem {
  id: string;
  title: string;
  system: string;
}

// Utility function to de-duplicate allergens based on the `display` property
const deduplicateAllergens = (allergens: AllergenItem[]) => {
  const seen = new Set();
  return allergens.filter((allergen) => {
    const displayLowerCase = allergen.title.toLowerCase();
    if (seen.has(displayLowerCase)) {
      return false;
    } else {
      seen.add(displayLowerCase);
      return true;
    }
  });
};

const AllergenSelector: FC<AllergenSelectorProps> = ({
  onAllergenSelected,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);
  const dropdownController = useRef<AutocompleteDropdownRef | null>(null);

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

  // Prepare items for the dropdown
  let dropdownItems =
    allergensData?.entry?.map((item) => {
      const coding = item.resource.code?.coding?.[0];
      return {
        id: coding?.code ?? "",
        title: coding?.display ?? "",
        system: coding?.system ?? "",
      };
    }) ?? [];

  // Deduplicate dropdown items
  dropdownItems = deduplicateAllergens(dropdownItems);

  const onClearPress = useCallback(() => {
    setSearch("");
  }, []);

  const onSelectAllergen = (
    item: TAutocompleteDropdownItem & { system?: string },
  ) => {
    if (item) {
      const newEntry: AllergyEntry = {
        allergen: {
          system: item.system ?? "", // Use the system from the selected item
          code: item.id, // Use the id from the selected item
          display: item.title ?? "",
        },
        type: "allergy", // Default value, change as needed
        severity: "moderate", // Default value, change as needed
      };
      onAllergenSelected(newEntry);
      setSearch(""); // Clear search input
      dropdownController.current?.clear(); // Clear the dropdown
    }
  };

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View className="z-20 flex-1 flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-8">
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
            placeholder: "Add an allergy...",
          }}
          onSelectItem={onSelectAllergen}
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

export default AllergenSelector;
