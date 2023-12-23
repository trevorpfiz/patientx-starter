import { useAtom } from "jotai";
import { FileCheck, FileClock, FileText } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";

export default function Home() {

  return (
    <View className="p-4 flex flex-col gap-8">
      <Text>Good Morning, User</Text>
      <Text className="text-3xl">You have <Text className="text-purple-400 font-bold">49 tasks</Text> this month</Text>
      <TextInput
        placeholder="Search"
        className="w-full p-2 bg-gray-300 rounded">
        Search
      </TextInput>
      <View className="flex flex-row justify-around items-center">
        <View className="flex flex-col gap-4">
          <View
            className="p-3 rounded-full border border-red-400 bg-red-100"
          >
            <FileText color={"red"} size={40} />
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <View
            className="p-3 rounded-full border border-yellow-400 bg-yellow-100"
          >
            <FileClock className="text-yellow-800" size={40} />
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <View
            className="p-3 rounded-full border border-green-400 bg-green-100"
          >
            <FileCheck color={"green"} size={40} />
          </View>
        </View>
      </View>
      <View
        className="flex flex-row justify-around items-center"
      >
        <Text>To-Do</Text>
        <Text>In-Progress</Text>
        <Text>Done</Text>
      </View>
      <View className="flex flex-row justify-around items-center">
        <Text className="text-3xl font-bold">Today's Tasks</Text>
        <Text>See All</Text>
      </View>
    </View>
  );
}
