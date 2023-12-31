import { Text, View } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerTitleAlign: "center" }} />
      <View className="flex-1 items-center justify-center gap-3">
        <Text className="text-3xl text-foreground">
          {`This screen doesn't exist.`}
        </Text>
        <View className="h-2" />
        <Link href="/">
          <Text className="text-foreground">Go Home</Text>
        </Link>
      </View>
    </>
  );
}
