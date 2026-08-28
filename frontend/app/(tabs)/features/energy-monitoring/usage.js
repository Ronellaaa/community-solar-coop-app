import React, { useState } from "react";
import UsageChart from "../../../../components/energy-monitoring/usage-chart";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function UsageScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  const usageData = {
    Daily: {
      total: "9.6",
      comparison: "12% less than yesterday",
      solar: "6.4",
      grid: "3.2",
      solarPercentage: "67%",
      gridPercentage: "33%",
      highestUsageTime: "6:00 PM",
      peakUsage: "2.4 kW",

      labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
      chartValues: [0.8, 1.3, 2.1, 1.8, 2.4, 1.2],
    },

    Weekly: {
      total: "68.5",
      comparison: "8% less than last week",
      solar: "42.1",
      grid: "26.4",
      solarPercentage: "61%",
      gridPercentage: "39%",
      highestUsageTime: "Friday evening",
      peakUsage: "3.1 kW",

      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      chartValues: [8.4, 9.1, 8.8, 10.2, 11.4, 10.1, 10.5],
    },

    Monthly: {
      total: "286.4",
      comparison: "5% less than last month",
      solar: "176.8",
      grid: "109.6",
      solarPercentage: "62%",
      gridPercentage: "38%",
      highestUsageTime: "Weekday evenings",
      peakUsage: "3.6 kW",

      labels: ["W1", "W2", "W3", "W4"],
      chartValues: [69.2, 72.4, 68.8, 76.0],
    },
  };

  const currentData = usageData[selectedPeriod];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Energy Usage</Text>

          <View style={{ width: 35 }} />
        </View>

        <Text style={styles.subtitle}>
          See how much electricity your household is using
        </Text>

        {/* Daily / Weekly / Monthly */}
        <View style={styles.filterContainer}>
          {["Daily", "Weekly", "Monthly"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                selectedPeriod === period && styles.activeFilter,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === period && styles.activeFilterText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Usage */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{selectedPeriod} Energy Used</Text>

          <Text style={styles.summaryValue}>
            {currentData.total}
            <Text style={styles.unit}> kWh</Text>
          </Text>

          <Text style={styles.summaryMessage}>{currentData.comparison}</Text>
        </View>

        {/* Energy Sources */}
        <Text style={styles.sectionTitle}>Energy Source</Text>

        <View style={styles.row}>
          <View style={styles.sourceCard}>
            <Text style={styles.icon}>☀️</Text>

            <Text style={styles.sourceTitle}>Solar</Text>

            <Text style={styles.sourceValue}>{currentData.solar} kWh</Text>

            <Text style={styles.sourcePercentage}>
              {currentData.solarPercentage} of usage
            </Text>
          </View>

          <View style={styles.sourceCard}>
            <Text style={styles.icon}>⚡</Text>

            <Text style={styles.sourceTitle}>Grid</Text>

            <Text style={styles.sourceValue}>{currentData.grid} kWh</Text>

            <Text style={styles.sourcePercentage}>
              {currentData.gridPercentage} of usage
            </Text>
          </View>
        </View>

        {/* Summary */}
        <UsageChart
          labels={currentData.labels}
          values={currentData.chartValues}
          title={`${selectedPeriod} Energy Usage`}
          total={currentData.total}
        />
        <Text style={styles.sectionTitle}>Usage Summary</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Highest usage time</Text>

            <Text style={styles.infoValue}>{currentData.highestUsageTime}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peak usage</Text>

            <Text style={styles.infoValue}>{currentData.peakUsage}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Solar contribution</Text>

            <Text style={styles.infoValue}>{currentData.solarPercentage}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Usage Pattern</Text>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },

  content: {
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    fontSize: 38,
    color: "#213721",
    lineHeight: 38,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#213721",
  },

  subtitle: {
    fontSize: 13,
    color: "#747D74",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E9EDE9",
    padding: 4,
    borderRadius: 14,
    marginBottom: 22,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 11,
  },

  activeFilter: {
    backgroundColor: "#FFFFFF",
  },

  filterText: {
    fontSize: 13,
    color: "#6F786F",
  },

  activeFilterText: {
    color: "#245C30",
    fontWeight: "700",
  },

  summaryCard: {
    backgroundColor: "#173D24",
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
  },

  summaryLabel: {
    color: "#C4D1C7",
    fontSize: 13,
  },

  summaryValue: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 7,
  },

  unit: {
    fontSize: 17,
    fontWeight: "500",
  },

  summaryMessage: {
    color: "#C4D1C7",
    fontSize: 12,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#213721",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  sourceCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },

  icon: {
    fontSize: 25,
    marginBottom: 10,
  },

  sourceTitle: {
    fontSize: 13,
    color: "#747D74",
  },

  sourceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#213721",
    marginTop: 5,
  },

  sourcePercentage: {
    fontSize: 11,
    color: "#929992",
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 13,
    color: "#747D74",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#213721",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECEFEC",
    marginVertical: 15,
  },
});
