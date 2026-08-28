import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BottomNav from "../../../../components/solar-investment/BottomNav";

export default function EarningsHistoryScreen() {
  const monthlyEarnings = [
    { month: "Nov", value: 180 },
    { month: "Dec", value: 210 },
    { month: "Jan", value: 260 },
    { month: "Feb", value: 310 },
    { month: "Mar", value: 340 },
    { month: "Apr", value: 420 },
    { month: "May", value: 620 },
  ];

  const projects = [
    {
      id: 1,
      name: "Greenfield School Solar Project",
      location: "Kandy",
      earnings: 420,
      percentage: "67.7%",
      image: require("../../../../assets/images/greenfield-school.jpeg"),
    },
    {
      id: 2,
      name: "Sudarshana Temple Solar Project",
      location: "Galle",
      earnings: 200,
      percentage: "32.3%",
      image: require("../../../../assets/images/sudarshana-temple.jpeg"),
    },
  ];

  const maxValue = Math.max(...monthlyEarnings.map((item) => item.value));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#111" />

          <Text style={styles.headerTitle}>Earnings History</Text>

          <Ionicons name="filter-outline" size={24} color="#111" />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Earnings */}
          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLabel}>Total Earnings (All Time)</Text>

              <Text style={styles.totalValue}>Rs. 2,340</Text>
            </View>

            <Ionicons name="cash-outline" size={42} color="#238636" />
          </View>

          {/* Monthly Earnings Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Earnings Overview</Text>

            <Text style={styles.chartSubtitle}>Monthly earnings</Text>

            <View style={styles.chart}>
              {monthlyEarnings.map((item) => {
                const height = (item.value / maxValue) * 140;

                return (
                  <View key={item.month} style={styles.barItem}>
                    <Text style={styles.barValue}>{item.value}</Text>

                    <View style={styles.barArea}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.month}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Earnings by Project */}
          <View style={styles.projectSection}>
            <Text style={styles.sectionTitle}>Earnings by Project</Text>

            <Text style={styles.projectSubtitle}>May 2026</Text>

            {projects.map((project) => (
              <View key={project.id} style={styles.projectRow}>
                <Image source={project.image} style={styles.projectImage} />

                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{project.name}</Text>

                  <Text style={styles.location}>{project.location}</Text>
                </View>

                <View style={styles.earningsInfo}>
                  <Text style={styles.projectEarnings}>
                    Rs. {project.earnings}
                  </Text>

                  <Text style={styles.percentage}>{project.percentage}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={22} color="#238636" />
            </View>

            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Your earnings are growing</Text>

              <Text style={styles.summaryText}>
                You earned Rs. 620 this month from your solar investments.
              </Text>
            </View>
          </View>
        </ScrollView>

        <BottomNav active="earnings" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#f7f8f6",
  },

  header: {
    height: 58,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  content: {
    padding: 14,
    paddingBottom: 24,
  },

  totalCard: {
    backgroundColor: "#eef8eb",
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#d9ead7",
  },

  totalLabel: {
    fontSize: 12,
    color: "#238636",
    fontWeight: "600",
  },

  totalValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#238636",
    marginTop: 4,
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  chartSubtitle: {
    fontSize: 11,
    color: "#777",
    marginTop: 3,
  },

  chart: {
    height: 200,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  barItem: {
    flex: 1,
    alignItems: "center",
  },

  barValue: {
    fontSize: 9,
    color: "#555",
    marginBottom: 5,
  },

  barArea: {
    height: 140,
    justifyContent: "flex-end",
  },

  bar: {
    width: 22,
    backgroundColor: "#35a64a",
    borderRadius: 4,
  },

  month: {
    fontSize: 9,
    color: "#666",
    marginTop: 7,
  },

  projectSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  projectSubtitle: {
    fontSize: 11,
    color: "#777",
    marginTop: 3,
    marginBottom: 12,
  },

  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  projectImage: {
    width: 58,
    height: 45,
    borderRadius: 7,
  },

  projectInfo: {
    flex: 1,
    marginLeft: 10,
  },

  projectName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },

  location: {
    fontSize: 10,
    color: "#777",
    marginTop: 3,
  },

  earningsInfo: {
    alignItems: "flex-end",
  },

  projectEarnings: {
    fontSize: 13,
    fontWeight: "700",
    color: "#238636",
  },

  percentage: {
    fontSize: 10,
    color: "#777",
    marginTop: 3,
  },

  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#f5faef",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#dce8d6",
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryContent: {
    flex: 1,
    marginLeft: 12,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#238636",
  },

  summaryText: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
    marginTop: 3,
  },
});
