import { Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/components/forms/welcome-form";
import { initialSteps, stepsAtom } from "~/components/ui/steps";
import { api } from "~/utils/api";

const Index = () => {
  const [patientId, setPatientId] = useAtom(patientIdAtom);
  const [steps, setSteps] = useAtom(stepsAtom);

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

        <Text className="text-xl font-bold">{`PatientId: ${patientId}`}</Text>
        <Button
          title="Get patientId from MMKV with Jotai"
          onPress={() => console.log(patientId)}
          color="#1d4ed8"
        />
        <Button
          title="Set patientId on MMKV with Jotai"
          onPress={() => setPatientId("7d1cdb7eb3ea46109a40189c8db8986d")}
          color="#1d4ed8"
        />

        <Button
          title="Get steps from MMKV with Jotai"
          onPress={() => console.log(steps)}
          color="#1d4ed8"
        />
        <Button
          title="Set steps on MMKV with Jotai"
          onPress={() => setSteps(initialSteps)}
          color="#1d4ed8"
        />

        <Link href="/onboarding/">
          <View className="p-4">
            <Text className="text-xl">Onboarding</Text>
          </View>
        </Link>
        <Link href="/onboarding/overview">
          <View className="p-4">
            <Text className="text-xl">Overview</Text>
          </View>
        </Link>
        <Link href="/onboarding/schedule">
          <View className="p-4">
            <Text className="text-xl">Scheduling</Text>
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
