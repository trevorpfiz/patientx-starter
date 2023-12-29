import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import QuestionnaireItem from "~/components/ui/health-record/questionnaire-item";
import { api } from "~/utils/api";

export default function QuestionnairesPage() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientQuestionnaireResponses.useQuery({
      patientId,
    });

  const activeQuestionnairesQuery =
    api.questionnaire.searchQuestionnaires.useQuery({
      query: {
        status: "active",
      },
    });

  const retiredQuestionnairesQuery =
    api.questionnaire.searchQuestionnaires.useQuery({
      query: {
        status: "retired",
      },
    });

  if (
    isLoading ||
    activeQuestionnairesQuery.isLoading ||
    retiredQuestionnairesQuery.isLoading
  ) {
    return (
      <View className="mb-36 flex-1 items-center justify-center bg-white">
        <Loader2
          size={48}
          color="black"
          strokeWidth={2}
          className="animate-spin"
        />
      </View>
    );
  }
  if (
    isError ||
    activeQuestionnairesQuery.isError ||
    retiredQuestionnairesQuery.isError
  ) {
    return (
      <Text>
        Error:{" "}
        {error?.message ??
          activeQuestionnairesQuery.error?.message ??
          retiredQuestionnairesQuery.error?.message ??
          "unknown error"}
      </Text>
    );
  }

  const responses = data?.entry;
  const allQuestionnaires = [
    ...(activeQuestionnairesQuery.data?.entry ?? []),
    ...(retiredQuestionnairesQuery.data?.entry ?? []),
  ];

  // Merge questionnaire responses with their corresponding questionnaires
  const mergedResponses = responses?.map((response) => {
    const questionnaireId = response.resource?.questionnaire.split("/")[1];
    const questionnaire = allQuestionnaires.find(
      (q) => q.resource.id === questionnaireId,
    );

    return {
      ...response,
      questionnaireName:
        questionnaire?.resource?.name ?? "Retired questionnaire",
      questionnaireStatus: questionnaire?.resource?.status ?? "retired",
    };
  });

  return (
    <View className="flex-1 bg-gray-100">
      {data?.total > 0 ? (
        <FlashList
          data={mergedResponses}
          renderItem={({ item, index }) => (
            <QuestionnaireItem
              questionnaireName={item.questionnaireName}
              questionnaireStatus={item.questionnaireStatus}
              status={item.resource?.status ?? "unknown"}
              authored={item.resource?.authored ?? "unknown"}
              onPress={() =>
                router.push({
                  pathname: `/portal/(tabs)/health-record/forms/questionnaires/${item.resource?.id}`,
                  params: {
                    questionnaireName: item.questionnaireName,
                    questionnaireStatus: item.questionnaireStatus,
                  },
                })
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
