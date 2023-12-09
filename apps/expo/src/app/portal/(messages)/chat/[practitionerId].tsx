import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  MessagesLeftHeaderBack,
  RightHeaderClose,
} from "~/components/ui/messages-header";

export default function ChatPage() {
  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();
  return (
    <View>
      <Stack.Screen
        options={{
          title: practitionerId,
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <RightHeaderClose />,
        }}
      />
      <Text>Chat Page</Text>
      <Text>{practitionerId}</Text>
    </View>
  );
}
