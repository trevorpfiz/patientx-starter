import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "PatientX Starter",
  slug: "canvas-fhir",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.trusttheprocess.patientx",
    supportsTablet: true,
  },
  android: {
    package: "com.trusttheprocess.patientx",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#000",
    },
  },
  extra: {
    eas: {
      projectId: "73f7f302-6adf-4a66-a030-6f9acba0e8b9",
    },
  },
  owner: "trust-the-process",
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "./expo-plugins/with-modify-gradle.js",
    [
      "expo-updates",
      {
        username: "trust-the-process",
      },
    ],
    "@config-plugins/react-native-blob-util",
    "@config-plugins/react-native-pdf",
  ],
});

export default defineConfig;
