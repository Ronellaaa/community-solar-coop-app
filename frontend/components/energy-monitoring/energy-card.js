import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function EnergyCard({ icon, title, value, unit, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <View>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    margin: 6,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  icon: {
    fontSize: 25,
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    color: "#6B746B",
    marginBottom: 5,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#213721",
  },

  unit: {
    fontSize: 14,
    marginLeft: 4,
    marginBottom: 3,
    color: "#6B746B",
  },

  description: {
    fontSize: 11,
    color: "#949A94",
    marginTop: 6,
  },
});
