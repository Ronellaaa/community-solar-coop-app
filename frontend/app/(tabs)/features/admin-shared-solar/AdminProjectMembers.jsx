import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  getAdminSharedSolarProjects,
  getProjectMembers,
  getAllJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  updateProjectMember,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function AdminProjectMembers() {
  const router = useRouter();

  const {
    projectId: paramProjectId,
    projectName: paramProjectName,
  } = useLocalSearchParams();

  const [projectId, setProjectId] =
    React.useState(paramProjectId || null);

  const [projectName, setProjectName] =
    React.useState(paramProjectName || "");

  const [projects, setProjects] =
    React.useState([]);

  const [members, setMembers] =
    React.useState([]);

  const [requests, setRequests] =
    React.useState([]);

  const [loading, setLoading] =
    React.useState(true);

  const [savingMember, setSavingMember] =
    React.useState(null);

  const [error, setError] =
    React.useState(null);

  const [editingMember, setEditingMember] =
    React.useState(null);

  const [editOwnership, setEditOwnership] =
    React.useState("");

  const [editEnergy, setEditEnergy] =
    React.useState("");

  const [editSaving, setEditSaving] =
    React.useState("");

  const [editLifetime, setEditLifetime] =
    React.useState("");

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const projectData =
        await getAdminSharedSolarProjects();

      setProjects(projectData);

      let selectedProjectId = projectId;

      if (!selectedProjectId && projectData.length) {
        selectedProjectId = projectData[0].id;
        setProjectId(selectedProjectId);
        setProjectName(
          projectData[0].name
        );
      }

      if (!selectedProjectId) {
        setMembers([]);
        setRequests([]);
        return;
      }

      const selectedProject =
        projectData.find(
          (project) =>
            String(project.id) ===
            String(selectedProjectId)
        );

      if (selectedProject) {
        setProjectName(selectedProject.name);
      }

      const [memberData, requestData] =
        await Promise.all([
          getProjectMembers(
            selectedProjectId
          ),
          getAllJoinRequests(
            selectedProjectId
          ),
        ]);

      setMembers(memberData);
      setRequests(requestData);
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Unable to load project members."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProjectChange = async (
    selectedId
  ) => {
    const selectedProject =
      projects.find(
        (project) =>
          String(project.id) ===
          String(selectedId)
      );

    setProjectId(selectedId);

    if (selectedProject) {
      setProjectName(
        selectedProject.name
      );
    }

    try {
      setLoading(true);

      const [memberData, requestData] =
        await Promise.all([
          getProjectMembers(selectedId),
          getAllJoinRequests(selectedId),
        ]);

      setMembers(memberData);
      setRequests(requestData);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    Alert.alert(
      "Approve Request",
      "Add this user as a project member?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: async () => {
            try {
              setLoading(true);

              await approveJoinRequest(
                request.id
              );

              await loadData();

              Alert.alert(
                "Success",
                "Member approved successfully."
              );
            } catch (err) {
              Alert.alert(
                "Error",
                err?.message ||
                  "Unable to approve request."
              );
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = (request) => {
    Alert.alert(
      "Reject Request",
      "Reject this joining request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              await rejectJoinRequest(
                request.id
              );

              await loadData();
            } catch (err) {
              Alert.alert(
                "Error",
                err?.message ||
                  "Unable to reject request."
              );

              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const startEditing = (member) => {
    setEditingMember(member.id);

    setEditOwnership(
      String(
        member.ownership_percentage || 0
      )
    );

    setEditEnergy(
      String(
        member.allocated_energy_kwh || 0
      )
    );

    setEditSaving(
      String(
        member.estimated_bill_saving || 0
      )
    );

    setEditLifetime(
      String(
        member.lifetime_saving || 0
      )
    );
  };

  const handleSaveMember = async (
    memberId
  ) => {
    try {
      setSavingMember(memberId);

      await updateProjectMember(
        memberId,
        {
          ownershipPercentage:
            editOwnership,
          allocatedEnergyKwh:
            editEnergy,
          estimatedBillSaving:
            editSaving,
          lifetimeSaving:
            editLifetime,
        }
      );

      setEditingMember(null);

      await loadData();

      Alert.alert(
        "Success",
        "Member information updated."
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err?.message ||
          "Unable to update member."
      );
    } finally {
      setSavingMember(null);
    }
  };

  const pendingRequests =
    requests.filter(
      (request) =>
        request.status === "pending"
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft
            size={22}
            color="#1E293B"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Project Members
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#16A34A"
          />
        }
      >
        <Text style={styles.label}>
          Select Project
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.projectSelector}
        >
          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.projectChip,
                String(project.id) ===
                  String(projectId) &&
                  styles.projectChipSelected,
              ]}
              onPress={() =>
                handleProjectChange(
                  project.id
                )
              }
            >
              <Text
                style={[
                  styles.projectChipText,
                  String(project.id) ===
                    String(projectId) &&
                    styles.projectChipTextSelected,
                ]}
              >
                {project.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.projectHeader}>
          <Users
            size={22}
            color="#16A34A"
          />

          <View style={styles.projectHeaderContent}>
            <Text style={styles.projectTitle}>
              {projectName ||
                "Select a project"}
            </Text>

            <Text style={styles.projectSubtitle}>
              {members.length} approved member
              {members.length === 1
                ? ""
                : "s"}
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Pending Requests */}

        {pendingRequests.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pending Join Requests
            </Text>

            {pendingRequests.map(
              (request) => (
                <View
                  key={request.id}
                  style={styles.requestCard}
                >
                  <View style={styles.requestIcon}>
                    <Users
                      size={20}
                      color="#F97316"
                    />
                  </View>

                  <View
                    style={styles.requestContent}
                  >
                    <Text
                      style={
                        styles.requestUser
                      }
                    >
                      User Request
                    </Text>

                    <Text
                      style={
                        styles.requestDetails
                      }
                    >
                      Energy:{" "}
                      {Number(
                        request.estimated_energy_allocation ||
                          0
                      ).toLocaleString()}{" "}
                      kWh
                    </Text>

                    <Text
                      style={
                        styles.requestDetails
                      }
                    >
                      Commitment: Rs.{" "}
                      {Number(
                        request.contribution_commitment ||
                          0
                      ).toLocaleString()}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.requestActions
                    }
                  >
                    <TouchableOpacity
                      style={
                        styles.approveButton
                      }
                      onPress={() =>
                        handleApprove(
                          request
                        )
                      }
                    >
                      <CheckCircle
                        size={16}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        styles.rejectButton
                      }
                      onPress={() =>
                        handleReject(
                          request
                        )
                      }
                    >
                      <Text
                        style={
                          styles.rejectText
                        }
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}
          </View>
        ) : null}

        {/* Members */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Approved Members
          </Text>

          {members.length === 0 ? (
            <View style={styles.emptyCard}>
              <Users
                size={28}
                color="#94A3B8"
              />

              <Text style={styles.emptyTitle}>
                No members yet
              </Text>

              <Text style={styles.emptyText}>
                Approved community members
                will appear here.
              </Text>
            </View>
          ) : (
            members.map((member) => {
              const isEditing =
                editingMember ===
                member.id;

              return (
                <View
                  key={member.id}
                  style={styles.memberCard}
                >
                  <View style={styles.memberHeader}>
                    <View style={styles.memberIcon}>
                      <Users
                        size={20}
                        color="#2563EB"
                      />
                    </View>

                    <View
                      style={
                        styles.memberHeaderContent
                      }
                    >
                      <Text
                        style={
                          styles.memberTitle
                        }
                      >
                        Community Member
                      </Text>

                      <Text
                        style={
                          styles.memberDate
                        }
                      >
                        Joined{" "}
                        {member.joined_at
                          ? new Date(
                              member.joined_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </View>
                  </View>

                  {!isEditing ? (
                    <>
                      <View
                        style={
                          styles.memberStats
                        }
                      >
                        <View
                          style={
                            styles.memberStat
                          }
                        >
                          <Text
                            style={
                              styles.memberStatLabel
                            }
                          >
                            Ownership
                          </Text>

                          <Text
                            style={
                              styles.memberStatValue
                            }
                          >
                            {Number(
                              member.ownership_percentage ||
                                0
                            )}
                            %
                          </Text>
                        </View>

                        <View
                          style={
                            styles.memberStat
                          }
                        >
                          <Text
                            style={
                              styles.memberStatLabel
                            }
                          >
                            Energy
                          </Text>

                          <Text
                            style={
                              styles.memberStatValue
                            }
                          >
                            {Number(
                              member.allocated_energy_kwh ||
                                0
                            ).toLocaleString()}{" "}
                            kWh
                          </Text>
                        </View>
                      </View>

                      <View
                        style={
                          styles.memberSavingRow
                        }
                      >
                        <TrendingUp
                          size={17}
                          color="#16A34A"
                        />

                        <Text
                          style={
                            styles.memberSavingText
                          }
                        >
                          Current saving: Rs.{" "}
                          {Number(
                            member.estimated_bill_saving ||
                              0
                          ).toLocaleString()}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={
                          styles.editButton
                        }
                        onPress={() =>
                          startEditing(
                            member
                          )
                        }
                      >
                        <Text
                          style={
                            styles.editButtonText
                          }
                        >
                          Edit Allocation
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View
                      style={
                        styles.editContainer
                      }
                    >
                      <Text
                        style={
                          styles.editLabel
                        }
                      >
                        Ownership (%)
                      </Text>

                      <TextInput
                        value={
                          editOwnership
                        }
                        onChangeText={
                          setEditOwnership
                        }
                        keyboardType="numeric"
                        style={
                          styles.editInput
                        }
                      />

                      <Text
                        style={
                          styles.editLabel
                        }
                      >
                        Energy (kWh)
                      </Text>

                      <TextInput
                        value={
                          editEnergy
                        }
                        onChangeText={
                          setEditEnergy
                        }
                        keyboardType="numeric"
                        style={
                          styles.editInput
                        }
                      />

                      <Text
                        style={
                          styles.editLabel
                        }
                      >
                        Current Saving (Rs.)
                      </Text>

                      <TextInput
                        value={
                          editSaving
                        }
                        onChangeText={
                          setEditSaving
                        }
                        keyboardType="numeric"
                        style={
                          styles.editInput
                        }
                      />

                      <Text
                        style={
                          styles.editLabel
                        }
                      >
                        Lifetime Saving (Rs.)
                      </Text>

                      <TextInput
                        value={
                          editLifetime
                        }
                        onChangeText={
                          setEditLifetime
                        }
                        keyboardType="numeric"
                        style={
                          styles.editInput
                        }
                      />

                      <View
                        style={
                          styles.editActions
                        }
                      >
                        <TouchableOpacity
                          style={
                            styles.cancelEditButton
                          }
                          onPress={() =>
                            setEditingMember(
                              null
                            )
                          }
                        >
                          <Text
                            style={
                              styles.cancelEditText
                            }
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={
                            styles.saveEditButton
                          }
                          onPress={() =>
                            handleSaveMember(
                              member.id
                            )
                          }
                          disabled={
                            savingMember ===
                            member.id
                          }
                        >
                          {savingMember ===
                          member.id ? (
                            <ActivityIndicator
                              color="#FFFFFF"
                            />
                          ) : (
                            <Text
                              style={
                                styles.saveEditText
                              }
                            >
                              Save
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
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

  content: {
    padding: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#475569",
    marginBottom: 8,
  },

  projectSelector: {
    marginBottom: 15,
  },

  projectChip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },

  projectChipSelected: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },

  projectChipText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#64748B",
  },

  projectChipTextSelected: {
    color: "#15803D",
  },

  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
    ...SHADOWS.light,
  },

  projectHeaderContent: {
    marginLeft: 11,
  },

  projectTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  projectSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
    fontFamily: "Nunito_400Regular",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },

  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  requestIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  requestContent: {
    flex: 1,
  },

  requestUser: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    fontFamily: "Nunito_700Bold",
  },

  requestDetails: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    fontFamily: "Nunito_400Regular",
  },

  requestActions: {
    gap: 7,
  },

  approveButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectText: {
    fontSize: 22,
    color: "#DC2626",
    fontWeight: "700",
  },

  memberCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  memberIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  memberHeaderContent: {
    flex: 1,
  },

  memberTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  memberDate: {
    fontSize: 10,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
  },

  memberStats: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },

  memberStat: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },

  memberStatLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontFamily: "Nunito_400Regular",
  },

  memberStatValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    fontFamily: "Nunito_700Bold",
    marginTop: 3,
  },

  memberSavingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },

  memberSavingText: {
    fontSize: 11,
    color: "#15803D",
    fontFamily: "Nunito_700Bold",
  },

  editButton: {
    marginTop: 13,
    borderRadius: 11,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F0FDF4",
  },

  editButtonText: {
    fontSize: 12,
    color: "#15803D",
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },

  editContainer: {
    marginTop: 15,
  },

  editLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    marginBottom: 5,
    marginTop: 8,
  },

  editInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#1E293B",
    fontFamily: "Nunito_400Regular",
  },

  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  cancelEditButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },

  cancelEditText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },

  saveEditButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: "#16A34A",
    alignItems: "center",
  },

  saveEditText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },

  errorBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    marginBottom: 15,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomPadding: {
    height: 30,
  },
});