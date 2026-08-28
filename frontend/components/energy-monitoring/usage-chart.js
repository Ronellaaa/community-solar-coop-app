import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function UsageChart({
  labels = [],
  values = [],
  title = "Energy Usage",
  total,
}) {
  const screenWidth = Dimensions.get("window").width;

  const data = {
  labels: labels.length > 0 ? labels : ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],

  datasets: [
    {
      data:
        values.length > 0
          ? values
          : [0.8, 1.3, 2.1, 1.8, 2.4, 1.2],
    },
  ],
};

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Household electricity usage</Text>
        </View>

        {total && <Text style={styles.total}>{total} kWh</Text>}
      </View>

      <LineChart
        data={data}
        width={screenWidth - 70}
        height={220}
        yAxisSuffix=" kW"
        chartConfig={{
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 1,

          color: (opacity = 1) =>
            `rgba(35, 92, 48, ${opacity})`,

          labelColor: (opacity = 1) =>
            `rgba(95, 105, 95, ${opacity})`,

          propsForDots: {
            r: "4",
          },

          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#E8ECE8",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 18,
    paddingBottom: 10,
    marginBottom: 25,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#213721",
  },

  subtitle: {
    fontSize: 12,
    color: "#8A928A",
    marginTop: 3,
  },

  total: {
    fontSize: 17,
    fontWeight: "700",
    color: "#245C30",
  },

  chart: {
    borderRadius: 16,
  },
});