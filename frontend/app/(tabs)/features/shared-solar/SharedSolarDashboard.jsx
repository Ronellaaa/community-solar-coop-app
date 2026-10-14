
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Bell, Sun } from "lucide-react-native";
import { useRouter, useFocusEffect } from "expo-router";

import SolarProjectCard from "../../../../components/shared-solar/SolarProjectCard";
import { useSharedSolar } from "../../../../hooks/shared-solar/useSharedSolar";
import { SHADOWS } from "../../../utils/shared-solar/shadows";
import { supabase } from "../../../../lib/supabase";

export default function SharedSolarDashboard() {
  const router = useRouter();

  const {
    projects,
    loading,
    error,
    refreshProjects,
  } = useSharedSolar();

  const [membershipProjectId, setMembershipProjectId] =
    React.useState(null);

  const [membershipChecked, setMembershipChecked] =
    React.useState(false);

  const [membershipError, setMembershipError] =
    React.useState(null);

  // Check whether the current user already belongs to a community.
  const checkMembership = React.useCallback(async () => {
    setMembershipChecked(false);
    setMembershipError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setMembershipProjectId(null);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("shared_solar_members")
        .select("project_id")
        .eq("user_id", user.id)
        .limit(1);

      if (queryError) {
        throw queryError;
      }

      setMembershipProjectId(data?.[0]?.project_id ?? null);
    } catch (err) {
      console.error("Error checking solar membership:", err);
      setMembershipError(
        "Unable to check your community membership. Please try again."
      );
    } finally {
      setMembershipChecked(true);
    }
  }, []);

  // Recheck membership whenever the dashboard becomes active.
  useFocusEffect(
    React.useCallback(() => {
      checkMembership();
    }, [checkMembership])
  );

  // Refresh both the projects and membership information.
  const handleRefresh = React.useCallback(async () => {
    await Promise.all([
      refreshProjects(),
      checkMembership(),
    ]);
  }, [refreshProjects, checkMembership]);

  // Members see only their own project.
  // Users who have not joined a community can see all projects.
  const visibleProjects = React.useMemo(() => {
    if (!membershipProjectId) {
      return projects;
    }

    return projects.filter(
      (project) =>
        String(project.id) === String(membershipProjectId)
    );
  }, [projects, membershipProjectId]);

  // Navigate to project details.
  const handleViewProject = (project) => {
    router.push({
      pathname: "/features/shared-solar/ProjectDetails",
      params: {
        projectId: String(project.id),
      },
    });
  };

  // Avoid showing all projects while membership is still being checked.
  if (
    loading ||
    !membershipChecked
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading community solar projects...
        </Text>
      </View>
    );
  }

  // Do not show the complete project list if membership could not be checked.
  if (membershipError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Unable to check membership
        </Text>

        <Text style={styles.errorText}>
          {membershipError}
        </Text>

        <Text
          style={styles.retryText}
          onPress={handleRefresh}
        >
          Tap here to try again
        </Text>
      </View>
    );
  }

  if (error && projects.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Unable to load projects
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Text
          style={styles.retryText}
          onPress={handleRefresh}
        >
          Tap here to try again
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleRefresh}
          tintColor="#16A34A"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>
              Community Solar
            </Text>

            <Text style={styles.subtitle}>
              Share energy. Save together.
            </Text>
          </View>

          <View style={styles.notificationBadge}>
            <Bell
              size={23}
              color="#1E293B"
              strokeWidth={2}
            />

            <View style={styles.notificationDot} />
          </View>
        </View>
      </View>

      {/* Overview Banner */}
      <View style={styles.overviewBanner}>
        <View style={styles.overviewIcon}>
          <Sun
            size={25}
            color="#F97316"
            strokeWidth={2.2}
          />
        </View>

        <View style={styles.overviewText}>
          <Text style={styles.overviewTitle}>
            Community Solar Projects
          </Text>

          <Text style={styles.overviewSubtitle}>
            View shared solar projects and estimated
            community savings.
          </Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {membershipProjectId
            ? "My Solar Community"
            : "Solar Projects"}
        </Text>

        <Text style={styles.sectionSubtitle}>
          {membershipProjectId
            ? "View your community project and its details"
            : "Explore available community projects"}
        </Text>
      </View>

      {/* Error while refreshing */}
      {error && projects.length > 0 && (
        <View style={styles.smallError}>
          <Text style={styles.smallErrorText}>
            {error}
          </Text>
        </View>
      )}

      {/* Project Cards */}
      {visibleProjects.map((project) => (
        <SolarProjectCard
          key={project.id}
          project={project}
          onViewProject={handleViewProject}
        />
      ))}

      {/* Empty State */}
      {visibleProjects.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Sun
              size={32}
              color="#16A34A"
              strokeWidth={2}
            />
          </View>

          <Text style={styles.emptyTitle}>
            {membershipProjectId
              ? "Your project could not be found"
              : "No solar projects yet"}
          </Text>

          <Text style={styles.emptySubtitle}>
            {membershipProjectId
              ? "Your membership exists, but its project is not currently available. Please refresh or contact the administrator."
              : "Community solar projects will appear here when they are created."}
          </Text>
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
    paddingBottom: 20,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...SHADOWS.light,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTextContainer: {
    flex: 1,
  },

  greeting: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 3,
    letterSpacing: 0.2,
  },

  notificationBadge: {
    position: "relative",
    padding: 4,
  },

  notificationDot: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F97316",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  overviewBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: -6,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  overviewText: {
    flex: 1,
  },

  overviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  overviewSubtitle: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    lineHeight: 17,
    marginTop: 3,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 5,
  },

  emptyState: {
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 45,
    paddingHorizontal: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
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
    textAlign: "center",
  },

  errorText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#EF4444",
    textAlign: "center",
    marginTop: 8,
  },

  retryText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#16A34A",
    marginTop: 15,
  },

  smallError: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
  },

  smallErrorText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#DC2626",
  },

  bottomPadding: {
    height: 20,
  },
});
