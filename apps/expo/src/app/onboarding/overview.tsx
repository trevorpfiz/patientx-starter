import { SafeAreaView, Text, View } from "react-native";

import Steps from "~/components/ui/steps";

export default function OverviewPage() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View className="bg-white p-8 px-10">
          <Text className="text-4xl font-semibold">{`Hi Donna, let's get you onboarded`}</Text>
        </View>
        <View className="flex-1">
          <Steps />
        </View>
      </View>
    </SafeAreaView>
  );
}
