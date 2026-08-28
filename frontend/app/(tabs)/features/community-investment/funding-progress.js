import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ProgressBar from "../../../../components/solar-investment/ProgressBar";

export default function FundingProgressScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Funding Progress</Text>

          <View style={{ width: 25 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Project Name */}
          <Text style={styles.projectTitle}>
            Greenfield School Solar Project
          </Text>

          <Text style={styles.location}>Kandy, Central Province</Text>

          {/* Main Progress Card */}
          <View style={styles.progressCard}>
            <Text style={styles.progressBig}>68%</Text>
            <Text style={styles.progressLabel}>Funded</Text>

            <ProgressBar progress={68} raised={1360000} target={2000000} />

            <View style={styles.amountRow}>
              <View>
                <Text style={styles.amountLabel}>Raised</Text>
                <Text style={styles.amountValue}>Rs. 1,360,000</Text>
              </View>

              <View style={styles.rightAmount}>
                <Text style={styles.amountLabel}>Target</Text>
                <Text style={styles.amountValue}>Rs. 2,000,000</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={25} color="#238636" />
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Investors</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={25} color="#238636" />
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="layers-outline" size={25} color="#238636" />
              <Text style={styles.statValue}>2,000</Text>
              <Text style={styles.statLabel}>Total Shares</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="cash-outline" size={25} color="#238636" />
              <Text style={styles.statValue}>Rs. 1,000</Text>
              <Text style={styles.statLabel}>Per Share</Text>
            </View>
          </View>

          {/* Funding Information */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Funding Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Remaining Amount</Text>

              <Text style={styles.infoValue}>Rs. 640,000</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shares Remaining</Text>

              <Text style={styles.infoValue}>640 shares</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expected Completion</Text>

              <Text style={styles.infoValue}>30 Nov 2025</Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.investButton}
            onPress={() =>
              router.push(
                "/(tabs)/features/community-investment/return-calculator",
              )
            }
          >
            <Text style={styles.investButtonText}>Calculate My Returns</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: "#f6f7f5",
  },

  header: {
    height: 58,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
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
    padding: 16,
    paddingBottom: 35,
  },

  projectTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  location: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
    marginBottom: 16,
  },

  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e7e7e7",
  },

  progressBig: {
    fontSize: 42,
    fontWeight: "800",
    color: "#238636",
  },

  progressLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },

  amountRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  rightAmount: {
    alignItems: "flex-end",
  },

  amountLabel: {
    fontSize: 11,
    color: "#777",
  },

  amountValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 14,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e7e7e7",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    color: "#111",
  },

  statLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 3,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    marginTop: 2,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 13,
    color: "#666",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },

  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginVertical: 13,
  },

  investButton: {
    backgroundColor: "#238636",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
  },

  investButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
