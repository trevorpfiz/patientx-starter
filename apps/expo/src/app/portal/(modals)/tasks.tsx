import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LeftHeaderDone } from "~/components/ui/headers/tasks-header";

export default function TasksPage() {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: "Tasks",
          headerLeft: () => <LeftHeaderDone />
        }}
      />
    </SafeAreaView>
  )
}
