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

import BottomNav from "../../components/solar-investment/BottomNav";

export default function MyInvestmentsScreen() {
  const investments = [
    {
      id: 1,
      name: "Greenfield School Solar Project",
      location: "Kandy, Central Province",
      shares: 20,
      invested: 20000,
      ownership: "1.00%",
      annualReturn: 2400,
      status: "Active",
      image: require("../../assets/images/greenfield-school.jpeg"),
    },
    {
      id: 2,
      name: "Sudarshana Temple Solar Project",
      location: "Galle, Southern Province",
      shares: 20,
      invested: 20000,
      ownership: "1.33%",
      annualReturn: 2400,
      status: "Active",
      image: require("../../assets/images/sudarshana-temple.jpeg"),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="menu-outline" size={27} color="#111" />

          <Text style={styles.headerTitle}>My Investments</Text>

          <View style={styles.notificationWrapper}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#111"
            />

            <View style={styles.notificationDot} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Portfolio Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Portfolio Summary</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Invested</Text>
                <Text style={styles.summaryValue}>Rs. 40,000</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Shares</Text>
                <Text style={styles.summaryValue}>40</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Est. Annual Return</Text>
                <Text style={styles.summaryValue}>Rs. 4,800</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Active Projects</Text>
                <Text style={styles.summaryValue}>2</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>My Solar Investments</Text>

          {/* Investment Cards */}
          {investments.map((investment) => (
            <View key={investment.id} style={styles.investmentCard}>
              <View style={styles.topRow}>
                <Image
                  source={investment.image}
                  style={styles.projectImage}
                />

                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>
                    {investment.name}
                  </Text>

                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location"
                      size={13}
                      color="#238636"
                    />

                    <Text style={styles.location}>
                      {investment.location}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Shares</Text>
                  <Text style={styles.detailValue}>
                    {investment.shares}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Invested</Text>
                  <Text style={styles.detailValue}>
                    Rs. {investment.invested.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ownership</Text>
                  <Text style={styles.detailValue}>
                    {investment.ownership}
                  </Text>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <Text style={styles.returnText}>
                  Est. Annual Return:{" "}
                  <Text style={styles.returnValue}>
                    Rs. {investment.annualReturn.toLocaleString()}
                  </Text>
                </Text>

                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>
                    {investment.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <BottomNav active="investments" />
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

  notificationWrapper: {
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#e53935",
    right: 0,
    top: 0,
  },

  content: {
    padding: 14,
    paddingBottom: 24,
  },

  summaryCard: {
    backgroundColor: "#238636",
    borderRadius: 13,
    padding: 16,
  },

  summaryTitle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 9,
    color: "#d7efdb",
    textAlign: "center",
  },

  summaryValue: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  summaryDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 18,
    marginBottom: 10,
  },

  investmentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  projectImage: {
    width: 92,
    height: 65,
    borderRadius: 8,
  },

  projectInfo: {
    flex: 1,
    marginLeft: 11,
  },

  projectName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  location: {
    fontSize: 10,
    color: "#666",
    marginLeft: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginVertical: 12,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 10,
    color: "#777",
  },

  detailValue: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
    color: "#222",
  },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  returnText: {
    fontSize: 10,
    color: "#666",
  },

  returnValue: {
    color: "#238636",
    fontWeight: "700",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#238636",
    marginRight: 5,
  },

  statusText: {
    fontSize: 10,
    color: "#238636",
    fontWeight: "700",
  },
});