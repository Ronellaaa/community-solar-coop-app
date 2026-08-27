// frontend/app/(tabs)/feature4.jsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SHADOWS } from "../utils/group-purchasing/shadows";

export default function Feature4Screen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>📊</Text>
        <Text style={styles.title}>Feature 4</Text>
        <Text style={styles.description}>
          This feature is currently under development.
        </Text>
        <Text style={styles.subtext}>Check back soon for updates!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    ...SHADOWS.card,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
  },
});
