
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  MapPin,
  Sun,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  getSharedSolarProject,
  getMyMembership,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function MySolarProject() {
  const router = useRouter();

  const { projectId } = useLocalSearchParams();

  const [project, setProject] = React.useState(null);
  const [membership, setMembership] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    if (!projectId) {
      setError("Project information is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [projectData, membershipData] =
        await Promise.all([
          getSharedSolarProject(projectId),
          getMyMembership(projectId),
        ]);

      setProject(projectData);
      setMembership(membershipData);
    } catch (err) {
      console.error(
        "Error loading my solar project:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your project information."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !project) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading your project...
        </Text>
      </View>
    );
  }

  if (error && !project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Unable to load project
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadData}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButtonSimple}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonSimpleText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Project not found
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ownership = Number(
    membership?.ownership_percentage || 0
  );

  const allocatedEnergy = Number(
    membership?.allocated_energy_kwh || 0
  );

  const estimatedBillSaving = Number(
    membership?.estimated_bill_saving || 0
  );

  const lifetimeSaving = Number(
    membership?.lifetime_saving || 0
  );

  const currentMembers = Number(
    project.current_members || 0
  );

  const targetMembers = Number(
    project.target_members || 0
  );

  const capacity = Number(
    project.total_capacity_kw || 0
  );

  const memberSince = membership?.joined_at
    ? new Date(
        membership.joined_at
      ).toLocaleDateString()
    : "Not available";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={22}
            color="#1E293B"
            strokeWidth={2.2}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          My Solar Project
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#16A34A"
          />
        }
      >
        {/* Project Header */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Sun
              size={34}
              color="#16A34A"
              strokeWidth={2}
            />
          </View>

          <View style={styles.activeBadge}>
            <CheckCircle
              size={14}
              color="#15803D"
              strokeWidth={2.5}
            />

            <Text style={styles.activeBadgeText}>
              {project.status || "active"}
            </Text>
          </View>

          <Text style={styles.projectName}>
            {project.name}
          </Text>

          {project.location ? (
            <View style={styles.locationRow}>
              <MapPin
                size={15}
                color="#94A3B8"
                strokeWidth={2}
              />

              <Text style={styles.locationText}>
                {project.location}
              </Text>
            </View>
          ) : null}
        </View>

        {/* My Participation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            My Participation
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.greenIcon}>
                <Users
                  size={21}
                  color="#16A34A"
                  strokeWidth={2.2}
                />
              </View>

              <Text style={styles.statValue}>
                {ownership}%
              </Text>

              <Text style={styles.statLabel}>
                My Ownership
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.blueIcon}>
                <Zap
                  size={21}
                  color="#2563EB"
                  strokeWidth={2.2}
                />
              </View>

              <Text style={styles.statValue}>
                {allocatedEnergy.toLocaleString()}
              </Text>

              <Text style={styles.statLabel}>
                Allocated Energy (kWh)
              </Text>
            </View>
          </View>
        </View>

        {/* My Energy Allocation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            My Energy Allocation
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Zap
                  size={20}
                  color="#16A34A"
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Allocated Energy
                </Text>

                <Text style={styles.infoValue}>
                  {allocatedEnergy.toLocaleString()} kWh
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Users
                  size={20}
                  color="#2563EB"
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Ownership Share
                </Text>

                <Text style={styles.infoValue}>
                  {ownership}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Project Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Project Information
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Zap
                  size={20}
                  color="#F97316"
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Project Capacity
                </Text>

                <Text style={styles.infoValue}>
                  {capacity} kW
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Users
                  size={20}
                  color="#2563EB"
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Community Members
                </Text>

                <Text style={styles.infoValue}>
                  {currentMembers}/{targetMembers}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <CalendarDays
                  size={20}
                  color="#7C3AED"
                  strokeWidth={2.2}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Member Since
                </Text>

                <Text style={styles.infoValue}>
                  {memberSince}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Savings Summary */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsIcon}>
            <TrendingUp
              size={23}
              color="#16A34A"
              strokeWidth={2.4}
            />
          </View>

          <View style={styles.savingsContent}>
            <Text style={styles.savingsTitle}>
              Current Estimated Saving
            </Text>

            <Text style={styles.savingsAmount}>
              Rs. {estimatedBillSaving.toLocaleString()}
            </Text>

            <Text style={styles.savingsDescription}>
              Based on the savings information recorded
              for your project membership.
            </Text>
          </View>
        </View>

        {/* Lifetime Saving */}
        <View style={styles.lifetimeCard}>
          <Text style={styles.lifetimeLabel}>
            Lifetime Estimated Saving
          </Text>

          <Text style={styles.lifetimeValue}>
            Rs. {lifetimeSaving.toLocaleString()}
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  contentContainer: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    ...SHADOWS.light,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  headerSpacer: {
    width: 40,
  },

  heroCard: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },

  activeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    textTransform: "capitalize",
  },

  projectName: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },

  locationText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  greenIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  blueIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  statValue: {
    fontSize: 19,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  statLabel: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 3,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  savingsCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 17,
    backgroundColor: "#F0FDF4",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },

  savingsIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  savingsContent: {
    flex: 1,
  },

  savingsTitle: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  savingsAmount: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    marginTop: 2,
  },

  savingsDescription: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    marginTop: 4,
  },

  lifetimeCard: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 17,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  lifetimeLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  lifetimeValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginTop: 4,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    marginTop: 12,
  },

  errorContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  errorText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#EF4444",
    textAlign: "center",
    marginTop: 8,
  },

  retryButton: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 18,
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },

  backButtonSimple: {
    marginTop: 15,
  },

  backButtonSimpleText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#16A34A",
  },

  bottomPadding: {
    height: 20,
  },
});

