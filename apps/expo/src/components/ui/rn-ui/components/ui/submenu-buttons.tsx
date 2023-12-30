import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { CalendarDays, FileCheck, TestTubes } from "lucide-react-native";

export default function SubmenuButtons() {
  const router = useRouter();
  return (
    <View className="justify flex flex-row items-center gap-4 px-6">
      <TouchableOpacity
        onPress={() => {
          router.push("/portal/health-record/test-results/");
        }}
        className="flex-1 rounded-full bg-amber-100 py-8"
        activeOpacity={0.5}
      >
        <View className="flex-col items-center gap-4">
          <View className="rounded-full bg-amber-300 p-5">
            <TestTubes className="text-white" size={40} />
          </View>
          <Text className="text-md font-semibold">Test Results</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/portal/appointments/");
        }}
        className=" flex-1 rounded-full bg-purple-100 py-8"
        activeOpacity={0.5}
      >
        <View className="flex-col items-center gap-4">
          <View className="rounded-full bg-purple-400 p-5">
            <CalendarDays className="text-white" size={40} />
          </View>
          <Text className="text-md font-semibold">Upcoming</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/portal/account/billing");
        }}
        className="flex-1 rounded-full bg-green-100 py-8"
        activeOpacity={0.5}
      >
        <View className="flex-col items-center gap-4">
          <View className="rounded-full bg-green-400 p-5">
            <FileCheck className="text-white" size={40} />
          </View>
          <Text className="text-md font-semibold">Billing</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
