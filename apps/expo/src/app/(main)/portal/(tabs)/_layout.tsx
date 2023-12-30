import { Tabs } from "expo-router";
import { Calendar, Clipboard, Home, User } from "lucide-react-native";

import { TabsHeader } from "~/components/ui/headers/tabs-header";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => {
            return <Home size={size} color={color} />;
          },
          header: () => <TabsHeader title="Home" />,
          href: "/portal/(tabs)",
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          tabBarLabel: "Appointments",
          tabBarIcon: ({ color, size }) => {
            return <Calendar size={size} color={color} />;
          },
          headerShown: false,
          href: "/portal/appointments",
        }}
      />
      <Tabs.Screen
        name="health-record"
        options={{
          title: "Health Record",
          tabBarIcon: ({ color, size }) => {
            return <Clipboard size={size} color={color} />;
          },
          headerShown: false,
          href: "/portal/health-record",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => {
            return <User size={size} color={color} />;
          },
          headerShown: false,
          href: "/portal/account",
        }}
      />
    </Tabs>
  );
}
