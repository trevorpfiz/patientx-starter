import { SafeAreaView, Text, View } from "react-native";
import { useAtom } from "jotai";

import { Button } from "~/components/ui/rn-ui/button";
import Steps, { stepsAtom } from "~/components/ui/steps";

export default function OverviewPage() {
  const [steps] = useAtom(stepsAtom);

  // Check if all steps are complete
  const allStepsComplete = steps.every((step) => step.status === "complete");

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <Text>Overview page</Text>
        <View className="flex-1">
          <Steps />
        </View>
        <Button variant="default" disabled={!allStepsComplete}>
          Schedule Appointment
        </Button>
      </View>
    </SafeAreaView>
  );
}
