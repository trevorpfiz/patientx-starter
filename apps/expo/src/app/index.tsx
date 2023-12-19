import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";

import { api } from "~/utils/api";

const Index = () => {
  const { data, isLoading, isError, error } =
    api.patient.searchPatients.useQuery({ query: {} });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const patients = data?.entry?.map((entry) => entry.resource) ?? [];

  return (
    <SafeAreaView className="bg-purple-700">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-white">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>

        <ScrollView>
          <Text className="text-xl font-bold">All Patients:</Text>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <View key={patient?.id} className="m-2 rounded-lg border p-2">
                <Text>ID: {patient?.id}</Text>
                <Text>Given Name: {patient?.name?.[0]?.given}</Text>
                <Text>Family Name: {patient?.name?.[0]?.family}</Text>
                {/* Include more patient details as needed */}
              </View>
            ))
          ) : (
            <Text>No patients found.</Text>
          )}
        </ScrollView>

        <Link href="/onboarding/">
          <View className="p-4">
            <Text className="text-xl">Onboarding</Text>
          </View>
        </Link>
        <Link href="/portal/(tabs)">
          <View className="p-4">
            <Text className="text-xl">Portal</Text>
          </View>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Index;
