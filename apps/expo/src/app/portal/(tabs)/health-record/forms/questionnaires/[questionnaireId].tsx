import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/messages-header";
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
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <Stack.Screen
        options={{
          title: questionnaireId,
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
      <Text>Questionnaire Page</Text>
      <Text>{questionnaireId}</Text>
    </View>
  );
}
