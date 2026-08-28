import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EnergyTip({ title, message }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>💡</Text>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF7DD",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },

  icon: {
    fontSize: 25,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5A501C",
  },

  message: {
    fontSize: 13,
    color: "#776C40",
    marginTop: 5,
    lineHeight: 19,
  },
});
