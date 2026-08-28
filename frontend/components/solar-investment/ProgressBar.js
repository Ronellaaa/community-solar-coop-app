import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressBar({
  progress = 0,
  raised = 0,
  target = 0,
}) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Funding Progress</Text>
        <Text style={styles.percentage}>{safeProgress}% funded</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${safeProgress}%`,
            },
          ]}
        />
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amount}>
          Rs. {Number(raised).toLocaleString()} raised
        </Text>

        <Text style={styles.target}>
          Rs. {Number(target).toLocaleString()} target
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },

  percentage: {
    fontSize: 12,
    fontWeight: "700",
    color: "#238636",
  },

  track: {
    height: 7,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#2c9b43",
    borderRadius: 10,
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },

  amount: {
    fontSize: 11,
    color: "#444",
    fontWeight: "600",
  },

  target: {
    fontSize: 11,
    color: "#666",
  },
});