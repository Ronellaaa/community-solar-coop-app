import React from "react";
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

export default function InvestmentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const shares = Number(params.shares || 10);
  const amount = Number(params.amount || shares * 1000);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Investment Successful!</Text>

        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={54} color="#fff" />
        </View>

        <Image
          source={require("../../../../assets/images/greenfield-school.jpeg")}
          style={styles.image}
        />

        <Text style={styles.thankYou}>Thank you!</Text>

        <Text style={styles.message}>
          Your investment is helping build a cleaner and stronger community.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Project</Text>
            <Text style={styles.value}>Greenfield School Solar Project</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Shares Purchased</Text>
            <Text style={styles.value}>{shares}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Total Invested</Text>
            <Text style={styles.greenValue}>Rs. {amount.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>ONL2026INV001</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>

            <View style={styles.statusBox}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Successful</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.replace(
              "/(tabs)/features/community-investment/my-investments",
            )
          }
        >
          <Text style={styles.primaryButtonText}>View My Portfolio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            router.replace("/(tabs)/features/community-investment")
          }
        >
          <Text style={styles.secondaryButtonText}>Browse More Projects</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8f6",
  },

  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 35,
    paddingBottom: 35,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 25,
  },

  successIcon: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "#39a84b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  image: {
    width: 220,
    height: 110,
    borderRadius: 14,
    resizeMode: "cover",
  },

  thankYou: {
    fontSize: 24,
    fontWeight: "800",
    color: "#238636",
    marginTop: 20,
  },

  message: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
    maxWidth: 320,
  },

  summaryCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    padding: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    flex: 1,
    fontSize: 12,
    color: "#777",
  },

  value: {
    flex: 1.4,
    fontSize: 12,
    fontWeight: "700",
    color: "#222",
    textAlign: "right",
  },

  greenValue: {
    flex: 1.4,
    fontSize: 14,
    fontWeight: "800",
    color: "#238636",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginVertical: 13,
  },

  statusBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#238636",
    marginRight: 5,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#238636",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#238636",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#238636",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryButtonText: {
    color: "#238636",
    fontSize: 14,
    fontWeight: "700",
  },
});
