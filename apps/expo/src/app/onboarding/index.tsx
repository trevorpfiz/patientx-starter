import React from "react";
import { Text, View } from "react-native";

import { WelcomeForm } from "~/components/forms/welcome-form";

export default function WelcomePage() {
  return (
    <View>
      <Text>Welcome page</Text>
      <WelcomeForm />
    </View>
  );
}
