import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "canvas-fhir-api-telehealth-starter",
  slug: "canvas-fhir",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.trusttheprocess.canvas-fhir-api-telehealth-starter",
    supportsTablet: true,
  },
  android: {
    package: "com.trusttheprocess.canvas-fhir-api-telehealth-starter",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
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
