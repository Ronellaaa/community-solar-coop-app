import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SavingsCard({ todaySavings, monthlySavings }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Saved Today</Text>

        <Text style={styles.todayAmount}>Rs. {todaySavings}</Text>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.monthlyLabel}>Estimated Monthly</Text>

        <Text style={styles.monthlyAmount}>Rs. {monthlySavings}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#173D24",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  label: {
    fontSize: 13,
    color: "#C7D5CA",
  },

  todayAmount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 5,
  },

  rightSide: {
    alignItems: "flex-end",
  },

  monthlyLabel: {
    fontSize: 11,
    color: "#C7D5CA",
  },

  monthlyAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 5,
  },
});
