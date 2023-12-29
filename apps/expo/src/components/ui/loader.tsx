import React from "react";
import { View } from "react-native";
import { Loader2 } from "lucide-react-native";

function Loader() {
  return (
    <View className="mb-36 flex-1 items-center justify-center bg-white">
      <Loader2
        size={48}
        color="black"
        strokeWidth={2}
        className="animate-spin"
      />
    </View>
  );
}

export { Loader };
