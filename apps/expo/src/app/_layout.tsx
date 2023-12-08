import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <TRPCProvider>
      <Slot />
      <StatusBar />
    </TRPCProvider>
  );
};

export default RootLayout;
