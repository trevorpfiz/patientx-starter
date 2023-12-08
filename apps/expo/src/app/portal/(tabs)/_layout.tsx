import React from "react";
import { Tabs } from "expo-router";
import { Calendar, Clipboard, Home, User } from "lucide-react-native";

import { PortalHeader } from "~/components/ui/portal-header";

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
          header: () => <PortalHeader title="Home" />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          tabBarLabel: "Appointments",
          tabBarIcon: ({ color, size }) => {
            return <Calendar size={size} color={color} />;
          },
          header: () => <PortalHeader title="Appointments" />,
        }}
      />
      <Tabs.Screen
        name="health-record"
        options={{
          title: "Health Record",
          tabBarIcon: ({ color, size }) => {
            return <Clipboard size={size} color={color} />;
          },
          header: () => <PortalHeader title="Health Record" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => {
            return <User size={size} color={color} />;
          },
          header: () => <PortalHeader title="Account" />,
        }}
      />
    </Tabs>
  );
}
