// frontend/app/index.js

import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export default function IndexScreen() {
  const { user, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user is logged in, go to home tab
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  // If not logged in, go to login
  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
});
