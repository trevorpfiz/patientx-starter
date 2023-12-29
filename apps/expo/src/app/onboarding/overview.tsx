import { SafeAreaView, Text, View } from "react-native";
import { useAtom } from "jotai";

import { patientNameAtom } from "~/app";
import Steps from "~/components/ui/steps";

export default function OverviewPage() {
  const [patientName] = useAtom(patientNameAtom);

  return (
    <>
      <SafeAreaView className="flex-[0] bg-white" />
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 bg-gray-100">
          <View className="bg-white p-8 px-10">
            <Text className="text-4xl font-semibold">{`Hi ${patientName.firstName}, let's get you onboarded`}</Text>
          </View>
          <View className="flex-1">
            <Steps />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
