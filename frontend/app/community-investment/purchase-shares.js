import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PurchaseSharesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const shares = Number(params.shares || 10);
  const amount = Number(params.amount || shares * 1000);

  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const paymentOptions = [
    {
      id: "wallet",
      title: "Onella Wallet",
      subtitle: "Balance: Rs. 25,000",
      icon: "wallet-outline",
    },
    {
      id: "bank",
      title: "Bank Transfer",
      subtitle: "Transfer via your bank",
      icon: "business-outline",
    },
    {
      id: "card",
      title: "Card Payment",
      subtitle: "Visa / MasterCard",
      icon: "card-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Purchase Shares</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <View style={styles.stepsRow}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.activeStep]}>
                <Text style={styles.activeStepText}>1</Text>
              </View>
              <Text style={styles.stepText}>Select</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.stepText}>Payment</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <Text style={styles.stepText}>Confirm</Text>
            </View>
          </View>

          {/* Selected Project */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Selected Project</Text>

            <View style={styles.projectRow}>
              <Image
                source={require("../../assets/images/greenfield-school.jpeg")}
                style={styles.projectImage}
              />

              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>
                  Greenfield School Solar Project
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={14}
                    color="#238636"
                  />

                  <Text style={styles.location}>
                    Kandy, Central Province
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Price per Share</Text>
              <Text style={styles.value}>Rs. 1,000</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Number of Shares</Text>
              <Text style={styles.value}>{shares}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Total Investment</Text>
              <Text style={styles.totalValue}>
                Rs. {amount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <Text style={styles.paymentTitle}>Payment Method</Text>

          {paymentOptions.map((option) => {
            const selected = paymentMethod === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.paymentCard,
                  selected && styles.selectedPayment,
                ]}
                onPress={() => setPaymentMethod(option.id)}
              >
                <View style={styles.radioOuter}>
                  {selected && <View style={styles.radioInner} />}
                </View>

                <View style={styles.paymentIcon}>
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={selected ? "#238636" : "#555"}
                  />
                </View>

                <View style={styles.paymentInfo}>
                  <Text
                    style={[
                      styles.paymentName,
                      selected && styles.selectedText,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.paymentSubtitle}>
                    {option.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shares</Text>
              <Text style={styles.summaryValue}>{shares}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per Share</Text>
              <Text style={styles.summaryValue}>Rs. 1,000</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.finalLabel}>Total</Text>
              <Text style={styles.finalValue}>
                Rs. {amount.toLocaleString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() =>
              router.push({
                pathname:
                  "/community-investment/investment-success",
                params: {
                  shares,
                  amount,
                  paymentMethod,
                },
              })
            }
          >
            <Text style={styles.confirmButtonText}>
              Proceed to Confirm
            </Text>
          </TouchableOpacity>

          <Text style={styles.secureText}>
            🔒 Your payment information is protected.
          </Text>
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
    backgroundColor: "#f7f8f6",
  },

  header: {
    height: 58,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  stepsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 20,
  },

  stepItem: {
    alignItems: "center",
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  activeStep: {
    backgroundColor: "#238636",
    borderColor: "#238636",
  },

  activeStepText: {
    color: "#fff",
    fontWeight: "700",
  },

  stepNumber: {
    color: "#666",
    fontWeight: "700",
  },

  stepText: {
    fontSize: 10,
    marginTop: 4,
    color: "#555",
  },

  stepLine: {
    width: 75,
    height: 2,
    backgroundColor: "#d7d7d7",
    marginTop: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  projectRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  projectImage: {
    width: 85,
    height: 62,
    borderRadius: 8,
  },

  projectInfo: {
    flex: 1,
    marginLeft: 12,
  },

  projectName: {
    fontSize: 14,
    fontWeight: "700",
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
    backgroundColor: "#eee",
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  label: {
    fontSize: 13,
    color: "#666",
  },

  value: {
    fontSize: 13,
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#238636",
  },

  paymentTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  paymentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 11,
    padding: 13,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedPayment: {
    borderColor: "#238636",
    backgroundColor: "#f4fbf3",
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#238636",
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#238636",
  },

  paymentIcon: {
    marginLeft: 12,
  },

  paymentInfo: {
    marginLeft: 10,
  },

  paymentName: {
    fontSize: 14,
    fontWeight: "600",
  },

  selectedText: {
    color: "#238636",
  },

  paymentSubtitle: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 16,
    marginTop: 10,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  summaryLabel: {
    color: "#666",
    fontSize: 13,
  },

  summaryValue: {
    fontWeight: "600",
    fontSize: 13,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  finalLabel: {
    fontSize: 15,
    fontWeight: "700",
  },

  finalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#238636",
  },

  confirmButton: {
    backgroundColor: "#238636",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 18,
  },

  confirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  secureText: {
    textAlign: "center",
    fontSize: 10,
    color: "#777",
    marginTop: 12,
  },
});