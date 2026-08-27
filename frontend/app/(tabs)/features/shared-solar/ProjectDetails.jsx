import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Users,
  Zap,
  IndianRupee,
  Sun,
  TrendingUp,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useSharedSolar } from "../../../../hooks/shared-solar/useSharedSolar";
import { joinSharedSolarProject } from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function ProjectDetails() {
  const router = useRouter();

  const { projectId } = useLocalSearchParams();

  const {
    project,
    membership,
    loading,
    error,
    refreshProject,
  } = useSharedSolar(projectId);

  const [joining, setJoining] = React.useState(false);

  const handleJoinProject = async () => {
    if (!project?.id) {
      return;
    }

    try {
      setJoining(true);

      await joinSharedSolarProject(project.id);

      Alert.alert(
        "Successfully Joined",
        "You are now a member of this community solar project.",
        [
          {
            text: "OK",
            onPress: () => {
              refreshProject();
            },
          },
        ]
      );
    } catch (err) {
      console.error("Error joining project:", err);

      Alert.alert(
        "Unable to Join",
        err?.message || "Something went wrong while joining the project."
      );
    } finally {
      setJoining(false);
    }
  };

  const handleViewSavings = () => {
    router.push({
      pathname: "/features/shared-solar/MySolarSavings",
      params: {
        projectId: project.id,
      },
    });
  };

  const handleViewMyProject = () => {
    // For now, stay on this project details screen.
    // We can create a separate My Project screen later if needed.
    refreshProject();
  };

  if (loading && !project) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading project details...
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
          onPress={refreshProject}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButtonSimple}
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

        <Text style={styles.errorText}>
          This solar project could not be found.
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

  const capacity = Number(
    project.total_capacity_kw || 0
  );

  const targetMembers = Number(
    project.target_members || 0
  );

  const currentMembers = Number(
    project.current_members || 0
  );

  const energyGenerated = Number(
    project.total_energy_generated_kwh || 0
  );

  const estimatedSavings = Number(
    project.total_estimated_savings || 0
  );

  const isMember = !!membership;

  const memberProgress =
    targetMembers > 0
      ? Math.min(
          (currentMembers / targetMembers) * 100,
          100
        )
      : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshProject}
          tintColor="#16A34A"
        />
      }
    >
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
          Project Details
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Project Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Sun
            size={34}
            color="#16A34A"
            strokeWidth={2}
          />
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {project.status || "active"}
          </Text>
        </View>

        <Text style={styles.projectName}>
          {project.name}
        </Text>

        {project.location ? (
          <View style={styles.locationRow}>
            <MapPin
              size={16}
              color="#94A3B8"
              strokeWidth={2}
            />

            <Text style={styles.locationText}>
              {project.location}
            </Text>
          </View>
        ) : null}
      </View>

      {/* About */}
      {project.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About This Project
          </Text>

          <Text style={styles.description}>
            {project.description}
          </Text>
        </View>
      ) : null}

      {/* Project Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Project Overview
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconGreen}>
              <Zap
                size={21}
                color="#16A34A"
                strokeWidth={2.2}
              />
            </View>

            <Text style={styles.statValue}>
              {capacity}
            </Text>

            <Text style={styles.statLabel}>
              kW Capacity
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBlue}>
              <Users
                size={21}
                color="#2563EB"
                strokeWidth={2.2}
              />
            </View>

            <Text style={styles.statValue}>
              {currentMembers}/{targetMembers}
            </Text>

            <Text style={styles.statLabel}>
              Members
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconOrange}>
              <TrendingUp
                size={21}
                color="#F97316"
                strokeWidth={2.2}
              />
            </View>

            <Text style={styles.statValue}>
              {energyGenerated.toLocaleString()}
            </Text>

            <Text style={styles.statLabel}>
              kWh Generated
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconGreen}>
              <IndianRupee
                size={21}
                color="#16A34A"
                strokeWidth={2.2}
              />
            </View>

            <Text style={styles.statValue}>
              Rs. {estimatedSavings.toLocaleString()}
            </Text>

            <Text style={styles.statLabel}>
              Estimated Savings
            </Text>
          </View>
        </View>
      </View>

      {/* Member Progress */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            Community Participation
          </Text>

          <Text style={styles.progressText}>
            {Math.round(memberProgress)}%
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>
              {currentMembers} members joined
            </Text>

            <Text style={styles.progressLabel}>
              {targetMembers} target
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${memberProgress}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Savings Information */}
      <View style={styles.savingsCard}>
        <View style={styles.savingsIcon}>
          <IndianRupee
            size={23}
            color="#16A34A"
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.savingsContent}>
          <Text style={styles.savingsTitle}>
            Estimated Community Savings
          </Text>

          <Text style={styles.savingsAmount}>
            Rs. {estimatedSavings.toLocaleString()}
          </Text>

          <Text style={styles.savingsDescription}>
            Estimated total savings generated by this
            community solar project.
          </Text>
        </View>
      </View>

      {/* Membership Section */}
      {isMember ? (
        <View style={styles.memberSection}>
          <View style={styles.memberSuccess}>
            <CheckCircle
              size={23}
              color="#16A34A"
              strokeWidth={2.2}
            />

            <View style={styles.memberSuccessText}>
              <Text style={styles.memberTitle}>
                You are a member
              </Text>

              <Text style={styles.memberSubtitle}>
                You have joined this community solar project.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewMyProject}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              View My Project
            </Text>

            <ArrowLeft
              size={18}
              color="#FFFFFF"
              strokeWidth={2.5}
              style={styles.rotatedArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewSavings}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              View My Savings
            </Text>

            <TrendingUp
              size={18}
              color="#16A34A"
              strokeWidth={2.2}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.joinSection}>
          <Text style={styles.joinTitle}>
            Interested in joining this community?
          </Text>

          <Text style={styles.joinDescription}>
            Join this shared solar project to become a
            community member and track your allocated
            energy and estimated savings.
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              joining && styles.disabledButton,
            ]}
            onPress={handleJoinProject}
            disabled={joining}
            activeOpacity={0.8}
          >
            {joining ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Join This Community
                </Text>

                <Users
                  size={18}
                  color="#FFFFFF"
                  strokeWidth={2.2}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
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

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },

  statusText: {
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
    marginTop: 7,
    gap: 5,
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

  description: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  statIconGreen: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  statIconBlue: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  statIconOrange: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFEDD5",
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

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#16A34A",
  },

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  progressLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  progressBackground: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#16A34A",
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
    fontSize: 21,
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

  joinSection: {
    marginHorizontal: 20,
    marginTop: 22,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  joinTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  joinDescription: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    marginTop: 6,
    marginBottom: 15,
  },

  memberSection: {
    marginHorizontal: 20,
    marginTop: 22,
  },

  memberSuccess: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F0FDF4",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    marginBottom: 12,
  },

  memberSuccessText: {
    flex: 1,
    marginLeft: 10,
  },

  memberTitle: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
  },

  memberSubtitle: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    marginTop: 2,
  },

  primaryButton: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 15,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },

  secondaryButton: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#16A34A",
  },

  rotatedArrow: {
    transform: [{ rotate: "180deg" }],
  },

  disabledButton: {
    opacity: 0.7,
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
    textAlignVertical: "center",
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