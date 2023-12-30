import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Receipt } from "lucide-react-native";

import { patientNameAtom } from "~/app/(main)";
import { RecordCategoryCard } from "~/components/ui/cards/record-category-card";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { useResetState } from "~/hooks/use-reset-state";
import { clearAll } from "~/utils/atom-with-mmkv";

const items = [
  {
    icon: Receipt,
    title: "Billing",
    onPress: () => router.push("/portal/account/billing"),
  },
];

export default function Account() {
  const [patientName] = useAtom(patientNameAtom);
  const resetState = useResetState();

  // Construct initials from the first letters of the first and last names
  const initials = `${patientName.firstName[0] ?? ""}${
    patientName.lastName[0] ?? ""
  }`;

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1">
        <View className="items-center pt-12">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-600">
            <Text className="text-center text-2xl font-bold text-white">
              {initials.toUpperCase()} {/* Display initials */}
            </Text>
          </View>
          <Text className="pb-4 pt-4 text-center text-2xl font-semibold text-black">
            {`${patientName.firstName} ${patientName.lastName}`}{" "}
            {/* Display full name */}
          </Text>
        </View>
        <FlashList
          data={items}
          renderItem={({ item }) => (
            <RecordCategoryCard
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
            />
          )}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingTop: 16,
            paddingHorizontal: 16,
          }}
        />
        <View className="px-6 pb-20">
          <Button
            variant="outline"
            className="rounded-full border-2 border-blue-500 bg-gray-50"
            textClass="text-blue-500"
            onPress={() => {
              // "log out"
              clearAll();
              resetState();
            }}
          >
            Log out
          </Button>
        </View>
      </View>
    </View>
  );
}
