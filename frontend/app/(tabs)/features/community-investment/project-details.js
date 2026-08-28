import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ProgressBar from "../../../../components/solar-investment/ProgressBar";

export default function ProjectDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Project Details</Text>

          <TouchableOpacity>
            <Ionicons name="heart-outline" size={25} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Project Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../../assets/images/greenfield-school.jpeg")}
            style={styles.projectImage}
          />

          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.section}>
          <Text style={styles.projectTitle}>
            Greenfield School Solar Project
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#248c3d" />

            <Text style={styles.locationText}>Kandy, Central Province</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="flash" size={22} color="#2d9b45" />
              <Text style={styles.statLabel}>Capacity</Text>
              <Text style={styles.statValue}>200 kWp</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="wallet" size={22} color="#2d9b45" />
              <Text style={styles.statLabel}>Total Cost</Text>
              <Text style={styles.statValue}>Rs. 2,000,000</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="people" size={22} color="#2d9b45" />
              <Text style={styles.statLabel}>Total Shares</Text>
              <Text style={styles.statValue}>2,000</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Price per share</Text>

            <Text style={styles.priceValue}>Rs. 1,000</Text>
          </View>

          {/* Funding */}
          <ProgressBar progress={68} raised={1360000} target={2000000} />

          {/* Description */}
          <Text style={styles.description}>
            This solar project will power Greenfield School and support clean,
            affordable energy for students and the local community.
          </Text>

          {/* Completion */}
          <View style={styles.completionRow}>
            <View style={styles.completionLeft}>
              <Ionicons name="calendar-outline" size={18} color="#2d9b45" />

              <Text style={styles.completionLabel}>Expected Completion</Text>
            </View>

            <Text style={styles.completionDate}>30 Nov 2025</Text>
          </View>

          {/* Funding Progress Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push(
                "/(tabs)/features/community-investment/funding-progress",
              )
            }
          >
            <Text style={styles.secondaryButtonText}>
              View Funding Progress
            </Text>
          </TouchableOpacity>

          {/* Invest Button */}
          <TouchableOpacity
            style={styles.investButton}
            onPress={() =>
              router.push(
                "/(tabs)/features/community-investment/return-calculator",
              )
            }
          >
            <Text style={styles.investButtonText}>Invest Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

  content: {
    paddingBottom: 30,
  },

  header: {
    height: 58,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  imageWrapper: {
    position: "relative",
  },

  projectImage: {
    width: "100%",
    height: 210,
    resizeMode: "cover",
  },

  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#2c9b43",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },

  featuredText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  section: {
    backgroundColor: "#fff",
    padding: 16,
  },

  projectTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  locationText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 8,
  },

  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  statLabel: {
    fontSize: 10,
    color: "#777",
    marginTop: 5,
  },

  statValue: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },

  priceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b7ddb9",
    backgroundColor: "#f6fbf4",
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 15,
  },

  priceLabel: {
    fontSize: 13,
    color: "#444",
  },

  priceValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#238636",
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#444",
    marginTop: 8,
  },

  completionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    marginTop: 18,
    paddingTop: 16,
  },

  completionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  completionLabel: {
    marginLeft: 7,
    fontSize: 12,
    color: "#555",
  },

  completionDate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#238636",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#238636",
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 20,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#238636",
    fontWeight: "700",
  },

  investButton: {
    backgroundColor: "#238636",
    paddingVertical: 14,
    borderRadius: 9,
    marginTop: 10,
    alignItems: "center",
  },

  investButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
