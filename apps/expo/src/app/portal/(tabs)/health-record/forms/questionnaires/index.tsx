import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import QuestionnaireItem from "~/components/ui/health-record/questionnaire-item";
import { api } from "~/utils/api";
import { patientAtom } from "../../allergies";

export default function QuestionnairesPage() {
  const [patientId] = useAtom(patientAtom);
  const router = useRouter();

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientQuestionnaireResponses.useQuery({
      patientId,
    });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const responses = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data?.total > 0 ? (
        <FlashList
          data={responses}
          renderItem={({ item, index }) => (
            <QuestionnaireItem
              questionnaireResponse={
                item.resource?.questionnaire ?? "unknown questionnaire"
              }
              status={item.resource?.status ?? "unknown"}
              authored={item.resource?.authored ?? "unknown"}
              onPress={() =>
                router.push(
                  `/portal/(tabs)/health-record/forms/questionnaires/${item.resource?.id}`,
                )
              }
              first={index === 0}
              last={index === data?.total - 1}
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
        <Text className="p-8">{`No questionnaires found.`}</Text>
      )}
    </View>
  );
}
