import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EnergyCard from "./energy-card";
import SavingsCard from "./savings-card";
import EnergyTip from "./energy-tip";
import UsageChart from "./usage-chart";

export default function HouseholdDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Good Afternoon 👋</Text>

        <Text style={styles.subtitle}>Here is your household energy today</Text>

        <Text style={styles.sectionTitle}>Current Energy</Text>

        <View style={styles.mainCard}>
          <Text style={styles.mainLabel}>⚡ Current Usage</Text>

          <Text style={styles.mainValue}>
            1.8 <Text style={styles.mainUnit}>kW</Text>
          </Text>

          <Text style={styles.description}>
            Electricity your home is using right now
          </Text>
        </View>

        <View style={styles.energyRow}>
          <EnergyCard
            icon="☀️"
            title="Solar Energy"
            value="1.2"
            unit="kW"
            description="Using from solar now"
          />

          <EnergyCard
            icon="⚡"
            title="Grid Energy"
            value="0.6"
            unit="kW"
            description="Using from the grid"
          />
        </View>
        <Text style={styles.sectionTitle}>Your Savings</Text>

        <SavingsCard todaySavings="420" monthlySavings="3,850" />
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push("/(tabs)/features/energy-monitoring/savings")
          }
        >
          <Text style={styles.detailsButtonText}>View Bill & Savings</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Smart Energy Tip</Text>

        <EnergyTip
          title="Good time to use appliances"
          message="Solar energy is high right now. Try using appliances like your washing machine during this time to reduce grid electricity usage."
        />
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push("/(tabs)/features/energy-monitoring/insights")
          }
        >
          <Text style={styles.detailsButtonText}>View Energy Insights</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Today Usage</Text>

        <UsageChart
          labels={["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"]}
          values={[0.8, 1.3, 2.1, 1.8, 2.4, 1.2]}
          title="Today's Energy Usage"
          total="9.6"
        />
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push("/(tabs)/features/energy-monitoring/usage")
          }
        >
          <Text style={styles.detailsButtonText}>View Energy Details</Text>
        </TouchableOpacity>
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

  greeting: {
    fontSize: 25,
    fontWeight: "700",
    color: "#213721",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B746B",
    marginTop: 5,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#213721",
    marginBottom: 12,
    marginTop: 25,
  },

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    marginBottom: 12,
  },

  mainLabel: {
    fontSize: 14,
    color: "#6B746B",
  },

  mainValue: {
    fontSize: 38,
    fontWeight: "700",
    color: "#213721",
    marginTop: 7,
  },

  mainUnit: {
    fontSize: 18,
    color: "#6B746B",
  },

  description: {
    fontSize: 12,
    color: "#919891",
    marginTop: 5,
  },

  energyRow: {
    flexDirection: "row",
    marginHorizontal: -6,
  },
  detailsButton: {
    backgroundColor: "#E8F3EA",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 25,
  },

  detailsButtonText: {
    color: "#245C30",
    fontSize: 14,
    fontWeight: "700",
  },
});
