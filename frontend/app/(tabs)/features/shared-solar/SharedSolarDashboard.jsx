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
import { useRouter } from "expo-router";

import SolarProjectCard from "../../../../components/shared-solar/SolarProjectCard";
import { useSharedSolar } from "../../../../hooks/shared-solar/useSharedSolar";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function SharedSolarDashboard() {
  const router = useRouter();

  const {
    projects,
    loading,
    error,
    refreshProjects,
  } = useSharedSolar();

  // Navigate to project details
  const handleViewProject = (project) => {
    router.push({
      pathname: "/features/shared-solar/ProjectDetails",
      params: {
        projectId: project.id,
      },
    });
  };

  // Loading state
  if (loading && projects.length === 0) {
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

  // Error state
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
          onPress={refreshProjects}
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
          onRefresh={refreshProjects}
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
          Solar Projects
        </Text>

        <Text style={styles.sectionSubtitle}>
          Explore available community projects
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
      {projects.map((project) => (
        <SolarProjectCard
          key={project.id}
          project={project}
          onViewProject={handleViewProject}
        />
      ))}

      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Sun
              size={32}
              color="#16A34A"
              strokeWidth={2}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No solar projects yet
          </Text>

          <Text style={styles.emptySubtitle}>
            Community solar projects will appear here
            when they are created.
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

  // Header
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

  // Overview
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

  // Section
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

  // Empty state
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
  },

  emptySubtitle: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
  },

  // Errors
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