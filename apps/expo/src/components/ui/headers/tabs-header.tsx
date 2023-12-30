import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft, MessageSquare } from "lucide-react-native";

export function TabsHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-gray-100">
      <View className="flex-row items-center justify-between border-b border-gray-300 bg-gray-100 p-6">
        <Text className="text-2xl font-bold">{title}</Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              router.push("/(main)/portal/(alerts)");
            }}
          >
            <Bell size={28} className="mr-6 text-black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(main)/portal/(messages)");
            }}
          >
            <View className="flex-row items-center">
              <MessageSquare size={28} className="text-black" />
              {/* <Text className="ml-1 text-black">Messages</Text> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function TabsLeftHeader({ title }: { title: string }) {
  return <Text className="text-2xl font-medium">{title}</Text>;
}

export function TabsRightHeader() {
  const router = useRouter();

  return (
    <View className="flex-row">
      <TouchableOpacity
        onPress={() => {
          /* Handle notification press */
        }}
      >
        <Bell size={24} className="mr-4 text-black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/(main)/portal/(messages)");
        }}
      >
        <MessageSquare size={24} className="text-black" />
      </TouchableOpacity>
    </View>
  );
}

export function LeftHeaderBack() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <View className="flex-row items-center">
        <ChevronLeft size={18} color="#3b82f6" />
        <Text className="ml-1 font-medium text-blue-500">Back</Text>
      </View>
    </TouchableOpacity>
  );
}
