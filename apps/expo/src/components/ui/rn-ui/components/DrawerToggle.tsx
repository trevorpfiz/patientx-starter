import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { AlignJustify } from "lucide-react-native";

export function DrawerToggle() {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  return (
    <TouchableOpacity onPress={navigation.toggleDrawer}>
      <View className="aspect-square flex-1 items-end justify-center pt-0.5">
        <AlignJustify
          className="text-foreground"
          size={24}
          strokeWidth={1.25}
        />
      </View>
    </TouchableOpacity>
  );
}
