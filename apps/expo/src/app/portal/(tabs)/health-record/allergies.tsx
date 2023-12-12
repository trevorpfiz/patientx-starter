import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { atom, useAtom } from "jotai";

import AllergyItem from "~/components/ui/health-record/allergy-item";
import { api } from "~/utils/api";

export const patientAtom = atom("e7836251cbed4bd5bb2d792bc02893fd");

export default function Allergies() {
  const [patientId] = useAtom(patientAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientAllergies.useQuery({ patientId });

  if (isLoading) {
    return <Text>Loading...</Text>;
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
          estimatedItemSize={100}
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
