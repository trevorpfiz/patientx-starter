import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(main)";
import AllergyItem from "~/components/ui/health-record/allergy-item";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";

export default function Allergies() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientAllergies.useQuery({ patientId });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const allergies = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data.total > 0 ? (
        <FlashList
          data={allergies}
          renderItem={({ item, index }) => (
            <AllergyItem
              allergen={item.resource.code.text}
              type={item.resource.type}
              severity={item.resource.reaction?.[0]?.severity ?? ""}
              reaction={
                item.resource.reaction?.[0]?.manifestation[0]?.text ?? ""
              }
              first={index === 0}
              last={index === data.total - 1}
            />
          )}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            // paddingTop: 16,
            // paddingHorizontal: 16,
          }}
        />
      ) : (
        <Text className="p-8">{`No allergies found.`}</Text>
      )}
    </View>
  );
}
