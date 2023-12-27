import "../styles.css";

import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Theme } from "@react-navigation/native";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { ToastProvider } from "~/components/ui/rn-ui/components/ui/toast";
import { setAndroidNavigationBar } from "~/components/ui/rn-ui/lib/android-navigation-bar";
import { NAV_THEME } from "~/components/ui/rn-ui/lib/constants";
import { TRPCProvider } from "~/utils/api";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

async function onFetchUpdateAsync() {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  const update = await Updates.checkForUpdateAsync();

  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  useAppForground(onFetchUpdateAsync, true);
  const [loaded, error] = useFonts(FontAwesome.font);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (!theme) {
        setAndroidNavigationBar(theme === "dark" ? "dark" : "light");
        AsyncStorage.setItem("theme", colorScheme);
        return;
      }
      setAndroidNavigationBar(theme === "dark" ? "dark" : "light");
      if (theme !== colorScheme) {
        toggleColorScheme();
        return;
      }
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <RootLayoutNav />
    </TRPCProvider>
  );
}

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "light" ? LIGHT_THEME : DARK_THEME}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <Slot />
        </BottomSheetModalProvider>
        <ToastProvider />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function useAppForground(cb: () => void, onMount = true) {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    if (onMount) {
      cb();
    }
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        cb();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
