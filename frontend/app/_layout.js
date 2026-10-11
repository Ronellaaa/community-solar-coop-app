// frontend/app/_layout.js

import { Stack } from "expo-router";
import { Platform } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { AppProvider } from "../context/AppContext";
import { useFonts } from "expo-font";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // Show nothing while fonts load (simpler)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={Platform.OS === "android" ? ["top", "bottom"] : []}
      >
        <AuthProvider>
          <AppProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </AppProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
