import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "../rn-ui/components/ui/button";

export function LeftHeaderDone() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Text className="font-medium text-blue-500">Done</Text>
    </TouchableOpacity>
  );
}

export function RightHeaderCreate() {
  return <Button>Add Task</Button>;
}
