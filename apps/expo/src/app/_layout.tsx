import Toast from "react-native-toast-message";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";
// @link https://github.com/marklawlor/nativewind/issues/643
// npx tailwindcss --watch -i ./src/styles.css -o ./src/output.css
// import "../output.css";
import "../styles.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <TRPCProvider>
      <Slot />
      <StatusBar />
      <Toast />
    </TRPCProvider>
  );
};

export default RootLayout;
