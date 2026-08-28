import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function InsightsScreen() {
  const insights = [
    {
      icon: "☀️",
      title: "Use more solar energy",
      message:
        "Solar energy is highest between 10 AM and 2 PM. Try using appliances during this time.",
    },
    {
      icon: "⚡",
      title: "High evening usage",
      message:
        "Your electricity usage is usually highest around 6 PM. Reducing usage at this time can lower grid consumption.",
    },
    {
      icon: "💰",
      title: "You are saving money",
      message:
        "Your solar energy use is helping reduce your estimated monthly electricity bill.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Energy Insights</Text>

          <View style={{ width: 35 }} />
        </View>

        <Text style={styles.subtitle}>
          Simple suggestions to help you use electricity wisely
        </Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>🌱</Text>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              Your energy use looks good
            </Text>

            <Text style={styles.statusText}>
              Most of your electricity today is coming from solar energy.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recommended for You</Text>

        {insights.map((item, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>

            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{item.title}</Text>

              <Text style={styles.insightMessage}>
                {item.message}
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Today Energy Check</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Solar contribution</Text>
            <Text style={styles.goodValue}>67%</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Grid usage</Text>
            <Text style={styles.summaryValue}>33%</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Peak usage time</Text>
            <Text style={styles.summaryValue}>6:00 PM</Text>
          </View>
        </View>

        <View style={styles.helpCard}>
          <Text style={styles.helpIcon}>💡</Text>

          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>
              Small changes can help
            </Text>

            <Text style={styles.helpText}>
              Using more electricity when solar energy is available can reduce
              how much electricity your household needs from the grid.
            </Text>
          </View>
        </View>

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
    textAlign: "center",
    fontSize: 13,
    color: "#747D74",
    marginTop: 8,
    marginBottom: 25,
  },

  statusCard: {
    backgroundColor: "#E8F4EA",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    marginBottom: 25,
  },

  statusIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#245C30",
  },

  statusText: {
    fontSize: 12,
    color: "#5C755F",
    lineHeight: 18,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#213721",
    marginBottom: 12,
  },

  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    marginBottom: 12,
  },

  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: "#F3F6F3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  icon: {
    fontSize: 22,
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#213721",
  },

  insightMessage: {
    fontSize: 12,
    color: "#747D74",
    lineHeight: 18,
    marginTop: 5,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#747D74",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#213721",
  },

  goodValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2F7A3D",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECEFEC",
    marginVertical: 15,
  },

  helpCard: {
    backgroundColor: "#FFF7DD",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
  },

  helpIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  helpContent: {
    flex: 1,
  },

  helpTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5A501C",
  },

  helpText: {
    fontSize: 12,
    color: "#776C40",
    lineHeight: 18,
    marginTop: 5,
  },
});