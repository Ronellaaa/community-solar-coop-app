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

export default function SavingsScreen() {
  const savingsData = {
    currentBill: 5900,
    normalBill: 8200,
    monthlySavings: 2300,
    totalSavings: 12400,
    solarUsed: 176.8,
  };

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

          <Text style={styles.headerTitle}>Bill & Savings</Text>

          <View style={{ width: 35 }} />
        </View>

        <Text style={styles.subtitle}>
          See how solar energy helps reduce your electricity bill
        </Text>

        <View style={styles.mainCard}>
          <Text style={styles.mainLabel}>Estimated Monthly Savings</Text>

          <Text style={styles.mainAmount}>
            Rs. {savingsData.monthlySavings.toLocaleString()}
          </Text>

          <Text style={styles.mainMessage}>
            You are paying less because part of your household energy comes from solar.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your Estimated Bill</Text>

        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <View>
              <Text style={styles.billLabel}>Without Solar</Text>
              <Text style={styles.billValue}>
                Rs. {savingsData.normalBill.toLocaleString()}
              </Text>
            </View>

            <Text style={styles.arrow}>→</Text>

            <View style={styles.rightBill}>
              <Text style={styles.billLabel}>With Solar</Text>
              <Text style={styles.currentBillValue}>
                Rs. {savingsData.currentBill.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.savingMessage}>
            <Text style={styles.savingMessageText}>
              You save about Rs. {savingsData.monthlySavings.toLocaleString()} this month
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Savings Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>This month</Text>
            <Text style={styles.summaryValue}>
              Rs. {savingsData.monthlySavings.toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total savings</Text>
            <Text style={styles.summaryValue}>
              Rs. {savingsData.totalSavings.toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Solar energy used</Text>
            <Text style={styles.summaryValue}>
              {savingsData.solarUsed} kWh
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How are savings calculated?</Text>

            <Text style={styles.infoText}>
              We compare the estimated cost of using only grid electricity with
              the estimated cost after solar energy is used by your household.
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
    justifyContent: "space-between",
    alignItems: "center",
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

  mainCard: {
    backgroundColor: "#173D24",
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
  },

  mainLabel: {
    color: "#C6D2C8",
    fontSize: 13,
  },

  mainAmount: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 6,
  },

  mainMessage: {
    color: "#C6D2C8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#213721",
    marginBottom: 12,
  },

  billCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
  },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  billLabel: {
    fontSize: 12,
    color: "#777F77",
  },

  billValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7A7A7A",
    marginTop: 5,
  },

  currentBillValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#245C30",
    marginTop: 5,
  },

  rightBill: {
    alignItems: "flex-end",
  },

  arrow: {
    fontSize: 24,
    color: "#A3AAA3",
  },

  savingMessage: {
    backgroundColor: "#EAF5EC",
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },

  savingMessageText: {
    color: "#245C30",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
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
    color: "#747D74",
    fontSize: 13,
  },

  summaryValue: {
    color: "#213721",
    fontSize: 14,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECEFEC",
    marginVertical: 15,
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF7DD",
    borderRadius: 18,
    padding: 18,
  },

  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5A501C",
  },

  infoText: {
    fontSize: 12,
    color: "#776C40",
    lineHeight: 18,
    marginTop: 5,
  },
});