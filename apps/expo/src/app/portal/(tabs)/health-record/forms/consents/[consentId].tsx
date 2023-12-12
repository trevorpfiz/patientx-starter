import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/messages-header";

export default function ConsentPage() {
  const { consentId } = useLocalSearchParams<{
    consentId: string;
  }>();
  return (
    <View>
      <Stack.Screen
        options={{
          title: consentId,
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
      <Text>Consent Page</Text>
      <Text>{consentId}</Text>
    </View>
  );
}
