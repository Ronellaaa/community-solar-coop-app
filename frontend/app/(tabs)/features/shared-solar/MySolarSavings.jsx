
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
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  getSharedSolarProject,
  getMyMembership,
  getMySavingsHistory,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function MySolarSavings() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();

  const [project, setProject] = React.useState(null);
  const [membership, setMembership] = React.useState(null);
  const [savingsHistory, setSavingsHistory] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Load project, membership and savings history
  const loadData = React.useCallback(async () => {
    if (!projectId) {
      setError("Project information is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [projectData, membershipData, savingsData] =
        await Promise.all([
          getSharedSolarProject(projectId),
          getMyMembership(projectId),
          getMySavingsHistory(projectId),
        ]);

      setProject(projectData);
      setMembership(membershipData);
      setSavingsHistory(
        Array.isArray(savingsData) ? savingsData : []
      );
    } catch (err) {
      console.error("Error loading solar savings:", err);

      setError(
        err?.message ||
          "Unable to load your savings information."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Loading state
  if (loading && !project) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading your savings...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && !project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Unable to load savings
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadData}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButtonSimple}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonSimpleText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Project not found
  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Project not found
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * Calculate total savings from the individual
   * savings history records.
   */
  const historyTotalSavings = savingsHistory.reduce(
    (total, record) =>
      total + Number(record?.estimated_saving || 0),
    0
  );

  /*
   * Calculate total energy allocated from the
   * individual savings history records.
   */
  const historyTotalEnergy = savingsHistory.reduce(
    (total, record) =>
      total +
      Number(record?.energy_allocated_kwh || 0),
    0
  );

  /*
   * Membership-level values are used when there
   * are no individual savings history records yet.
   */
  const membershipSaving = Number(
    membership?.estimated_bill_saving || 0
  );

  const membershipEnergy = Number(
    membership?.allocated_energy_kwh || 0
  );

  const lifetimeSaving = Number(
    membership?.lifetime_saving || 0
  );

  const displayedTotalSavings =
    savingsHistory.length > 0
      ? historyTotalSavings
      : membershipSaving;

  const displayedEnergy =
    savingsHistory.length > 0
      ? historyTotalEnergy
      : membershipEnergy;

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
          My Solar Savings
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
        {/* Project Information */}
        <View style={styles.projectCard}>
          <View style={styles.projectIcon}>
            <TrendingUp
              size={25}
              color="#16A34A"
              strokeWidth={2.3}
            />
          </View>

          <View style={styles.projectContent}>
            <Text style={styles.projectLabel}>
              Solar Project
            </Text>

            <Text
              style={styles.projectName}
              numberOfLines={2}
            >
              {project.name}
            </Text>
          </View>
        </View>

        {/* Main Savings */}
        <View style={styles.mainSavingsCard}>
          <View style={styles.mainSavingsIcon}>
            <TrendingDown
              size={26}
              color="#16A34A"
              strokeWidth={2.4}
            />
          </View>

          <Text style={styles.mainSavingsLabel}>
            Total Estimated Savings
          </Text>

          <Text style={styles.mainSavingsAmount}>
            Rs. {displayedTotalSavings.toLocaleString()}
          </Text>

          <Text style={styles.mainSavingsDescription}>
            Estimated savings from your allocated
            shared solar energy.
          </Text>
        </View>

        {/* Savings Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Savings Summary
          </Text>

          <View style={styles.statsGrid}>
            {/* Energy */}
            <View style={styles.statCard}>
              <View style={styles.greenIcon}>
                <Zap
                  size={21}
                  color="#16A34A"
                  strokeWidth={2.2}
                />
              </View>

              <Text style={styles.statValue}>
                {displayedEnergy.toLocaleString()}
              </Text>

              <Text style={styles.statLabel}>
                Energy Allocated (kWh)
              </Text>
            </View>

            {/* Lifetime Saving */}
            <View style={styles.statCard}>
              <View style={styles.blueIcon}>
                <TrendingUp
                  size={21}
                  color="#2563EB"
                  strokeWidth={2.2}
                />
              </View>

              <Text style={styles.statValue}>
                Rs. {lifetimeSaving.toLocaleString()}
              </Text>

              <Text style={styles.statLabel}>
                Lifetime Saving
              </Text>
            </View>
          </View>
        </View>

        {/* Savings History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Savings History
          </Text>

          {savingsHistory.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <CalendarDays
                  size={24}
                  color="#94A3B8"
                  strokeWidth={2}
                />
              </View>

              <Text style={styles.emptyTitle}>
                No savings records yet
              </Text>

              <Text style={styles.emptyText}>
                Your savings history will appear here
                once savings records are added to the
                project.
              </Text>
            </View>
          ) : (
            savingsHistory.map((record) => {
              const energy = Number(
                record?.energy_allocated_kwh || 0
              );

              const saving = Number(
                record?.estimated_saving || 0
              );

              const date = record?.record_date
                ? new Date(
                    record.record_date
                  ).toLocaleDateString()
                : "Unknown date";

              return (
                <View
                  key={record.id}
                  style={styles.historyCard}
                >
                  <View style={styles.historyIcon}>
                    <TrendingUp
                      size={20}
                      color="#16A34A"
                      strokeWidth={2.3}
                    />
                  </View>

                  <View style={styles.historyContent}>
                    <Text style={styles.historyDate}>
                      {date}
                    </Text>

                    <Text style={styles.historyEnergy}>
                      {energy.toLocaleString()} kWh
                      allocated
                    </Text>
                  </View>

                  <View
                    style={
                      styles.historyAmountContainer
                    }
                  >
                    <Text
                      style={styles.historyAmount}
                    >
                      Rs. {saving.toLocaleString()}
                    </Text>

                    <Text
                      style={
                        styles.historySavingLabel
                      }
                    >
                      saving
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Information */}
        <View style={styles.infoCard}>
          <TrendingUp
            size={21}
            color="#16A34A"
            strokeWidth={2.2}
          />

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              About Estimated Savings
            </Text>

            <Text style={styles.infoText}>
              Savings shown here are estimates based on
              your allocated shared solar energy and the
              savings records provided for the project.
              Actual savings may vary depending on energy
              generation and usage.
            </Text>
          </View>
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

  // Header
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

  // Project Card
  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  projectContent: {
    flex: 1,
  },

  projectLabel: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  projectName: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginTop: 2,
  },

  // Main Savings
  mainSavingsCard: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 24,
    backgroundColor: "#F0FDF4",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    alignItems: "center",
  },

  mainSavingsIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  mainSavingsLabel: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  mainSavingsAmount: {
    fontSize: 30,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    marginTop: 3,
  },

  mainSavingsDescription: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
  },

  // Sections
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

  // Statistics
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
    fontSize: 17,
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

  // Empty State
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 5,
  },

  // History
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  historyContent: {
    flex: 1,
  },

  historyDate: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  historyEnergy: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 3,
  },

  historyAmountContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  historyAmount: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
  },

  historySavingLabel: {
    fontSize: 10,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
  },

  // Information
  infoCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  infoText: {
    fontSize: 11,
    lineHeight: 17,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    marginTop: 4,
  },

  // Loading
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

  // Error
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

