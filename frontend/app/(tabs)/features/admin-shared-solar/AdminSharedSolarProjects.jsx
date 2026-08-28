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
  Plus,
  MapPin,
  Users,
  Zap,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";

import {
  getAdminSharedSolarProjects,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function AdminSharedSolarProjects() {
  const router = useRouter();

  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadProjects = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminSharedSolarProjects();

      setProjects(data);
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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
          Solar Projects
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push(
              "/(tabs)/features/admin-shared-solar/AdminCreateSolarProject"
            )
          }
        >
          <Plus size={21} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadProjects}
            tintColor="#16A34A"
          />
        }
      >
        <View style={styles.topText}>
          <Text style={styles.pageTitle}>
            Manage Shared Solar
          </Text>

          <Text style={styles.pageDescription}>
            Create and manage community solar projects.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity onPress={loadProjects}>
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {projects.length === 0 && !loading ? (
          <View style={styles.emptyCard}>
            <Zap size={30} color="#94A3B8" />

            <Text style={styles.emptyTitle}>
              No projects yet
            </Text>

            <Text style={styles.emptyText}>
              Create your first shared solar project.
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() =>
                router.push(
                  "/(tabs)/features/admin-shared-solar/AdminCreateSolarProject"
                )
              }
            >
              <Plus size={18} color="#FFFFFF" />

              <Text style={styles.createButtonText}>
                Create Project
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                project.name,
                "Choose an action",
                [
                  {
                    text: "Members",
                    onPress: () =>
                      router.push({
                        pathname:
                          "/(tabs)/features/admin-shared-solar/AdminProjectMembers",
                        params: {
                          projectId: project.id,
                          projectName: project.name,
                        },
                      }),
                  },
                  {
                    text: "Savings",
                    onPress: () =>
                      router.push({
                        pathname:
                          "/(tabs)/features/admin-shared-solar/AdminSavingsRecords",
                        params: {
                          projectId: project.id,
                          projectName: project.name,
                        },
                      }),
                  },
                  {
                    text: "Edit",
                    onPress: () =>
                      router.push({
                        pathname:
                          "/(tabs)/features/admin-shared-solar/AdminCreateSolarProject",
                        params: {
                          projectId: project.id,
                        },
                      }),
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ]
              )
            }
          >
            <View style={styles.projectTop}>
              <View style={styles.projectIcon}>
                <Zap size={24} color="#16A34A" />
              </View>

              <View style={styles.projectMain}>
                <Text style={styles.projectName}>
                  {project.name}
                </Text>

                {project.location ? (
                  <View style={styles.locationRow}>
                    <MapPin
                      size={13}
                      color="#94A3B8"
                    />

                    <Text style={styles.locationText}>
                      {project.location}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {project.status || "planning"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.projectStats}>
              <View style={styles.projectStat}>
                <Zap size={16} color="#F97316" />

                <Text style={styles.projectStatValue}>
                  {Number(
                    project.total_capacity_kw || 0
                  )}{" "}
                  kW
                </Text>
              </View>

              <View style={styles.projectStat}>
                <Users size={16} color="#2563EB" />

                <Text style={styles.projectStatValue}>
                  {Number(
                    project.current_members || 0
                  )}
                  /
                  {Number(
                    project.target_members || 0
                  )}
                </Text>
              </View>

              <ChevronRight
                size={20}
                color="#94A3B8"
              />
            </View>
          </TouchableOpacity>
        ))}

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

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 20,
  },

  topText: {
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  pageDescription: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 4,
  },

  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  projectTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  projectMain: {
    flex: 1,
  },

  projectName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },

  locationText: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },

  projectStats: {
    flexDirection: "row",
    alignItems: "center",
  },

  projectStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 22,
    gap: 5,
  },

  projectStatValue: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#475569",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 4,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 18,
    gap: 7,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },

  errorCard: {
    backgroundColor: "#FEF2F2",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  errorText: {
    fontSize: 12,
    color: "#DC2626",
  },

  retryText: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "700",
    marginTop: 6,
  },

  bottomPadding: {
    height: 30,
  },
});