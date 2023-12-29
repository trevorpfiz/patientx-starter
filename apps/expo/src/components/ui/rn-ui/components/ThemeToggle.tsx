import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MoonStar, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { setAndroidNavigationBar } from "~/components/ui/rn-ui/lib/android-navigation-bar";

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <TouchableOpacity
      onPress={() => {
        const newTheme = colorScheme === "dark" ? "light" : "dark";
        setColorScheme(newTheme);
        setAndroidNavigationBar(newTheme);
        Haptics.selectionAsync();
        AsyncStorage.setItem("theme", newTheme);
      }}
    >
      <View className="aspect-square flex-1 items-start justify-center pt-0.5">
        {colorScheme === "light" ? (
          <Sun className="text-foreground" size={24} strokeWidth={1.25} />
        ) : (
          <MoonStar className="text-foreground" size={24} strokeWidth={1.25} />
        )}
      </View>
    </TouchableOpacity>
  );
}
