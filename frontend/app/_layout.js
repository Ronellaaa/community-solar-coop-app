// frontend/app/_layout.js

import { Stack } from "expo-router";
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
    <AuthProvider>
      <AppProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </AppProvider>
    </AuthProvider>
  );
}
