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
  FolderOpen,
  Users,
  Zap,
  TrendingUp,
  Plus,
  ClipboardList,
} from "lucide-react-native";
import { useRouter } from "expo-router";

import {
  getAdminSharedSolarProjects,
  getAllJoinRequests,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function AdminSharedSolarDashboard() {
  const router = useRouter();

  const [projects, setProjects] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectData, requestData] = await Promise.all([
        getAdminSharedSolarProjects(),
        getAllJoinRequests(),
      ]);

      setProjects(projectData);
      setRequests(requestData);
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;

  const totalMembers = projects.reduce(
    (total, project) =>
      total + Number(project.current_members || 0),
    0
  );

  const totalCapacity = projects.reduce(
    (total, project) =>
      total + Number(project.total_capacity_kw || 0),
    0
  );

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  ).length;

  if (loading && projects.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>
          Loading admin dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Solar Admin Dashboard
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#16A34A"
          />
        }
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Zap size={28} color="#16A34A" />
          </View>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Shared Solar Management
            </Text>

            <Text style={styles.welcomeText}>
              Manage community solar projects, members,
              allocations and estimated savings.
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.greenIcon}>
              <FolderOpen size={21} color="#16A34A" />
            </View>

            <Text style={styles.statValue}>
              {projects.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Projects
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.blueIcon}>
              <Zap size={21} color="#2563EB" />
            </View>

            <Text style={styles.statValue}>
              {activeProjects}
            </Text>

            <Text style={styles.statLabel}>
              Active Projects
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.purpleIcon}>
              <Users size={21} color="#7C3AED" />
            </View>

            <Text style={styles.statValue}>
              {totalMembers}
            </Text>

            <Text style={styles.statLabel}>
              Members
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.orangeIcon}>
              <TrendingUp size={21} color="#F97316" />
            </View>

            <Text style={styles.statValue}>
              {totalCapacity}
            </Text>

            <Text style={styles.statLabel}>
              Capacity (kW)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push(
                "/(tabs)/features/admin-shared-solar/AdminCreateSolarProject"
              )
            }
          >
            <View style={styles.actionIcon}>
              <Plus size={22} color="#16A34A" />
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                Create Solar Project
              </Text>

              <Text style={styles.actionText}>
                Add a new community shared solar project.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push(
                "/(tabs)/features/admin-shared-solar/AdminSharedSolarProjects"
              )
            }
          >
            <View style={styles.actionIcon}>
              <FolderOpen size={22} color="#2563EB" />
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                Manage Projects
              </Text>

              <Text style={styles.actionText}>
                View and manage all shared solar projects.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push(
                "/(tabs)/features/admin-shared-solar/AdminProjectMembers"
              )
            }
          >
            <View style={styles.actionIcon}>
              <Users size={22} color="#7C3AED" />
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                Manage Members
              </Text>

              <Text style={styles.actionText}>
                View member ownership and energy allocation.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push(
                "/(tabs)/features/admin-shared-solar/AdminSavingsRecords"
              )
            }
          >
            <View style={styles.actionIcon}>
              <TrendingUp size={22} color="#F97316" />
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                Manage Savings
              </Text>

              <Text style={styles.actionText}>
                Add and maintain estimated savings records.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.pendingCard}>
          <ClipboardList size={22} color="#F97316" />

          <View style={styles.pendingContent}>
            <Text style={styles.pendingTitle}>
              Pending Join Requests
            </Text>

            <Text style={styles.pendingValue}>
              {pendingRequests}
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

  welcomeCard: {
    flexDirection: "row",
    margin: 20,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },

  welcomeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#166534",
  },

  welcomeText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    marginTop: 4,
  },

  errorBox: {
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 20,
  },

  statCard: {
    width: "48%",
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

  purpleIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  orangeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  statValue: {
    fontSize: 20,
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

  section: {
    marginHorizontal: 20,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  actionText: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 3,
  },

  pendingCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  pendingContent: {
    flex: 1,
    marginLeft: 12,
  },

  pendingTitle: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#9A3412",
  },

  pendingValue: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#EA580C",
    marginTop: 2,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  bottomPadding: {
    height: 30,
  },
});