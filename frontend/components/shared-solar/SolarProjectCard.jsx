import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MapPin,
  Users,
  Zap,
  IndianRupee,
  ArrowRight,
} from "lucide-react-native";

import { SHADOWS } from "../../app/utils/shared-solar/shadows";

export default function SolarProjectCard({
  project,
  onViewProject,
}) {
  const energyGenerated = Number(
    project?.total_energy_generated_kwh || 0
  );

  const estimatedSavings = Number(
    project?.total_estimated_savings || 0
  );

  const currentMembers = Number(
    project?.current_members || 0
  );

  const targetMembers = Number(
    project?.target_members || 0
  );

  const capacity = Number(
    project?.total_capacity_kw || 0
  );

  return (
    <View style={styles.card}>
      {/* Project Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Zap
            size={24}
            color="#16A34A"
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.headerText}>
          <Text
            style={styles.projectName}
            numberOfLines={2}
          >
            {project?.name || "Community Solar Project"}
          </Text>

          <View style={styles.locationRow}>
            <MapPin
              size={14}
              color="#94A3B8"
              strokeWidth={2}
            />

            <Text
              style={styles.location}
              numberOfLines={1}
            >
              {project?.location || "Location not specified"}
            </Text>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {project?.status || "active"}
          </Text>
        </View>
      </View>

      {/* Description */}
      {project?.description ? (
        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {project.description}
        </Text>
      ) : null}

      {/* Main Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Zap
            size={18}
            color="#16A34A"
            strokeWidth={2}
          />

          <Text style={styles.statValue}>
            {energyGenerated.toLocaleString()}
          </Text>

          <Text style={styles.statLabel}>
            kWh Generated
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Users
            size={18}
            color="#2563EB"
            strokeWidth={2}
          />

          <Text style={styles.statValue}>
            {currentMembers}/{targetMembers}
          </Text>

          <Text style={styles.statLabel}>
            Members
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Zap
            size={18}
            color="#F97316"
            strokeWidth={2}
          />

          <Text style={styles.statValue}>
            {capacity}
          </Text>

          <Text style={styles.statLabel}>
            kW Capacity
          </Text>
        </View>
      </View>

      {/* Savings Section */}
      <View style={styles.savingsContainer}>
        <View style={styles.savingsIcon}>
          <IndianRupee
            size={20}
            color="#16A34A"
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.savingsTextContainer}>
          <Text style={styles.savingsLabel}>
            Estimated Community Savings
          </Text>

          <Text style={styles.savingsValue}>
            Rs. {estimatedSavings.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* View Project Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => onViewProject?.(project)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          View Project
        </Text>

        <ArrowRight
          size={18}
          color="#FFFFFF"
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
    paddingRight: 8,
  },

  projectName: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    lineHeight: 23,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },

  location: {
    flex: 1,
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    textTransform: "capitalize",
  },

  description: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    lineHeight: 19,
    marginTop: 14,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginTop: 5,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },

  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },

  savingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  savingsTextContainer: {
    flex: 1,
  },

  savingsLabel: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  savingsValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    marginTop: 2,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 14,
    gap: 8,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
});