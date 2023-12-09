import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/messages-header";

export default function ChatPage() {
  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();
  return (
    <View>
      <Stack.Screen
        options={{
          title: practitionerId,
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
      <Text>Chat Page</Text>
      <Text>{practitionerId}</Text>
    </View>
  );
}
