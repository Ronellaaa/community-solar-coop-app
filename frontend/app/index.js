// frontend/app/index.js

import { Redirect, router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function IndexScreen() {
  const { user, loading } = useAuth();

  // ==============================
  // AUTHENTICATION LOADING
  // ==============================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ==============================
  // NOT LOGGED IN
  // ==============================
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // ==============================
  // LOGGED IN
  // ==============================
  return (
    <View style={styles.container}>

      {/* Group Purchasing / Deals */}
      <TouchableOpacity
        style={styles.dealsButton}
        onPress={() => router.push("/(tabs)/deals")}
      >
        <Text style={styles.buttonText}>
          Group Purchasing
        </Text>
      </TouchableOpacity>

      {/* Energy Monitoring */}
      <TouchableOpacity
        style={styles.energyButton}
        onPress={() => router.push("/energy-monitoring")}
      >
        <Text style={styles.buttonText}>
          Energy Monitoring
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  // Loading screen
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

  // Home screen
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  dealsButton: {
    backgroundColor: "#1A5C4A",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  energyButton: {
    backgroundColor: "#173D24",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});