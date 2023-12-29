import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useSetAtom } from "jotai";
import { Receipt } from "lucide-react-native";

import { providerKeyAtom } from "~/app/_layout";
import { RecordCategoryCard } from "~/components/ui/cards/record-category-card";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { logOut } from "~/utils/atom-with-mmkv";

const items = [
  {
    icon: Receipt,
    title: "Billing",
    onPress: () => router.push("/portal/(tabs)/account/billing"),
  },
];

export default function Account() {
  const setProviderKey = useSetAtom(providerKeyAtom);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-gray-100">
        <View className="items-center pt-12">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-600">
            <Text className="text-center text-2xl font-bold text-white">
              DL
            </Text>
          </View>
          <Text className="pt-4 text-center text-2xl font-semibold text-black">
            Donna Lewis
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
            variant={"outline"}
            onPress={() => {
              // "log out"
              logOut(() => setProviderKey((prevKey) => prevKey + 1));

              // go to sign in page
              router.replace("/");
            }}
            textClass="text-center"
          >
            Log out
          </Button>
        </View>
      </View>
    </View>
  );
}
