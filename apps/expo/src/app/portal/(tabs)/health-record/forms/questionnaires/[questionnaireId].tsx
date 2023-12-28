import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Loader2 } from "lucide-react-native";

import QuestionItem from "~/components/ui/health-record/question-item";
import { api } from "~/utils/api";

export default function QuesitonnairePage() {
  const { questionnaireId } = useLocalSearchParams<{
    questionnaireId: string;
  }>();

  const { isLoading, isError, data, error } =
    api.questionnaire.getQuestionnaireResponse.useQuery({
      id: questionnaireId,
    });

  if (isLoading) {
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

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen
        options={{
          title: questionnaireId,
        }}
      />
      <Text className="text-lg font-semibold">
        {data?.questionnaire ?? "unknown questionnaire"}
      </Text>
      <Text>{data?.status ?? "unknown"}</Text>
      <Text>{data?.authored ?? "unknown"}</Text>
      <FlashList
        data={data?.item}
        renderItem={({ item, index }) => (
          <QuestionItem
            text={item.text ?? "unknown question"}
            answer={
              item.answer?.[0]?.valueCoding?.display ??
              item.answer?.[0]?.valueString ??
              "unknown answer"
            }
            first={index === 0}
            last={index === (data?.item?.length ?? 0) - 1}
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
    </View>
  );
}
