import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ReturnCalculatorScreen() {
  const router = useRouter();

  const SHARE_PRICE = 1000;
  const ANNUAL_RETURN_RATE = 0.12;

  const [shares, setShares] = useState("5");

  const numberOfShares = Math.max(parseInt(shares || "0", 10), 0);

  const investmentAmount = numberOfShares * SHARE_PRICE;

  const estimatedAnnualReturn = useMemo(() => {
    return investmentAmount * ANNUAL_RETURN_RATE;
  }, [investmentAmount]);

  const estimatedMonthlyReturn = estimatedAnnualReturn / 12;

  const increaseShares = () => {
    setShares(String(numberOfShares + 1));
  };

  const decreaseShares = () => {
    if (numberOfShares > 1) {
      setShares(String(numberOfShares - 1));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Estimated Returns
          </Text>

          <View style={{ width: 25 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Project Info */}
          <View style={styles.projectCard}>
            <Text style={styles.projectLabel}>
              You're investing in
            </Text>

            <Text style={styles.projectTitle}>
              Greenfield School Solar Project
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color="#238636"
              />

              <Text style={styles.location}>
                Kandy, Central Province
              </Text>
            </View>
          </View>

          {/* Share Selection */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Number of Shares
            </Text>

            <Text style={styles.helperText}>
              Each share costs Rs. 1,000
            </Text>

            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={decreaseShares}
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color="#238636"
                />
              </TouchableOpacity>

              <TextInput
                style={styles.shareInput}
                value={shares}
                onChangeText={(value) =>
                  setShares(value.replace(/[^0-9]/g, ""))
                }
                keyboardType="number-pad"
                textAlign="center"
              />

              <TouchableOpacity
                style={styles.counterButton}
                onPress={increaseShares}
              >
                <Ionicons
                  name="add"
                  size={22}
                  color="#238636"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>
                Investment Amount
              </Text>

              <Text style={styles.investmentValue}>
                Rs. {investmentAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Return Summary */}
          <View style={styles.returnCard}>
            <View style={styles.returnIcon}>
              <Ionicons
                name="trending-up"
                size={28}
                color="#238636"
              />
            </View>

            <Text style={styles.returnTitle}>
              Estimated Annual Return
            </Text>

            <Text style={styles.returnValue}>
              Rs. {estimatedAnnualReturn.toLocaleString()}
            </Text>

            <Text style={styles.returnPercent}>
              Based on an estimated 12% annual return
            </Text>
          </View>

          {/* Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Estimated Earnings
            </Text>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Monthly
              </Text>

              <Text style={styles.breakdownValue}>
                Rs. {Math.round(
                  estimatedMonthlyReturn
                ).toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Yearly
              </Text>

              <Text style={styles.breakdownValue}>
                Rs. {Math.round(
                  estimatedAnnualReturn
                ).toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Investment
              </Text>

              <Text style={styles.breakdownValue}>
                Rs. {investmentAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Notice */}
          <View style={styles.noticeCard}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#796500"
            />

            <Text style={styles.noticeText}>
              Returns are estimates only. Actual earnings may
              vary depending on solar production and project
              performance.
            </Text>
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              numberOfShares === 0 && styles.disabledButton,
            ]}
            disabled={numberOfShares === 0}
            onPress={() =>
              router.push({
                pathname:
                  "/community-investment/purchase-shares",
                params: {
                  shares: numberOfShares,
                  amount: investmentAmount,
                },
              })
            }
          >
            <Text style={styles.continueButtonText}>
              Continue to Purchase
            </Text>
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
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
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

  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e7e7e7",
  },

  projectLabel: {
    fontSize: 11,
    color: "#777",
  },

  projectTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
    color: "#111",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  helperText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  counterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  counterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#238636",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7fff6",
  },

  shareInput: {
    width: 90,
    height: 48,
    marginHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    backgroundColor: "#fff",
  },

  investmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#f6fbf4",
    borderRadius: 9,
    padding: 13,
  },

  investmentLabel: {
    fontSize: 13,
    color: "#555",
  },

  investmentValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#238636",
  },

  returnCard: {
    backgroundColor: "#eff9ee",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#beddbd",
    padding: 22,
    alignItems: "center",
    marginTop: 14,
  },

  returnIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  returnTitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 12,
  },

  returnValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#238636",
    marginTop: 5,
  },

  returnPercent: {
    fontSize: 11,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },

  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  breakdownLabel: {
    fontSize: 13,
    color: "#666",
  },

  breakdownValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginTop: 13,
  },

  noticeCard: {
    flexDirection: "row",
    backgroundColor: "#fffbea",
    borderWidth: 1,
    borderColor: "#eee3ad",
    padding: 13,
    borderRadius: 10,
    marginTop: 14,
  },

  noticeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 8,
    color: "#655b26",
  },

  continueButton: {
    backgroundColor: "#238636",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },

  disabledButton: {
    opacity: 0.5,
  },

  continueButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});