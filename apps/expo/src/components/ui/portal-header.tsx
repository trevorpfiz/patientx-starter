import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Bell, MessageSquare } from "lucide-react-native";

export function PortalHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between bg-white p-4">
        <Text className="text-lg font-bold">{title}</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => {
              /* Handle notification press */
            }}
          >
            <Bell size={24} className="mr-4 text-black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/portal/(messages)/");
            }}
          >
            <MessageSquare size={24} className="text-black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
