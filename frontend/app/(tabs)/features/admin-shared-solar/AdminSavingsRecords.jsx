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
  CalendarDays,
  TrendingUp,
  Users,
  Zap,
  Trash2,
} from "lucide-react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  getAdminSharedSolarProjects,
  getProjectMembers,
  getProjectSavingsRecords,
  addSavingsRecord,
  deleteSavingsRecord,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function AdminSavingsRecords() {
  const router = useRouter();

  const {
    projectId: paramProjectId,
    projectName: paramProjectName,
  } = useLocalSearchParams();

  const [projects, setProjects] =
    React.useState([]);

  const [members, setMembers] =
    React.useState([]);

  const [records, setRecords] =
    React.useState([]);

  const [projectId, setProjectId] =
    React.useState(paramProjectId || null);

  const [projectName, setProjectName] =
    React.useState(
      paramProjectName || ""
    );

  const [selectedMember, setSelectedMember] =
    React.useState(null);

  const [recordDate, setRecordDate] =
    React.useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [energy, setEnergy] =
    React.useState("");

  const [saving, setSaving] =
    React.useState("");

  const [loading, setLoading] =
    React.useState(true);

  const [savingRecord, setSavingRecord] =
    React.useState(false);

  const [error, setError] =
    React.useState(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const projectData =
        await getAdminSharedSolarProjects();

      setProjects(projectData);

      let selectedProjectId =
        projectId;

      if (
        !selectedProjectId &&
        projectData.length
      ) {
        selectedProjectId =
          projectData[0].id;

        setProjectId(
          selectedProjectId
        );

        setProjectName(
          projectData[0].name
        );
      }

      if (!selectedProjectId) {
        return;
      }

      const selectedProject =
        projectData.find(
          (project) =>
            String(project.id) ===
            String(selectedProjectId)
        );

      if (selectedProject) {
        setProjectName(
          selectedProject.name
        );
      }

      const [memberData, recordData] =
        await Promise.all([
          getProjectMembers(
            selectedProjectId
          ),
          getProjectSavingsRecords(
            selectedProjectId
          ),
        ]);

      setMembers(memberData);
      setRecords(recordData);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load savings records."
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

      const [memberData, recordData] =
        await Promise.all([
          getProjectMembers(
            selectedId
          ),
          getProjectSavingsRecords(
            selectedId
          ),
        ]);

      setMembers(memberData);
      setRecords(recordData);
      setSelectedMember(null);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!selectedMember) {
      Alert.alert(
        "Select Member",
        "Please select a project member first."
      );
      return;
    }

    try {
      setSavingRecord(true);

      await addSavingsRecord({
        memberId: selectedMember.id,
        recordDate,
        energyAllocatedKwh: energy,
        estimatedSaving: saving,
      });

      setEnergy("");
      setSaving("");

      await loadData();

      Alert.alert(
        "Success",
        "Savings record added successfully."
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err?.message ||
          "Unable to add savings record."
      );
    } finally {
      setSavingRecord(false);
    }
  };

  const handleDelete = (record) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this savings record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSavingsRecord(
                record.id
              );

              await loadData();
            } catch (err) {
              Alert.alert(
                "Error",
                err?.message ||
                  "Unable to delete record."
              );
            }
          },
        },
      ]
    );
  };

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
          Savings Records
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

        <View style={styles.projectCard}>
          <TrendingUp
            size={23}
            color="#16A34A"
          />

          <View style={styles.projectContent}>
            <Text style={styles.projectLabel}>
              Solar Project
            </Text>

            <Text style={styles.projectName}>
              {projectName ||
                "Select a project"}
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

        {/* Add record */}

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            Add Savings Record
          </Text>

          <Text style={styles.label}>
            Select Member
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {members.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberChip,
                  selectedMember?.id ===
                    member.id &&
                    styles.memberChipSelected,
                ]}
                onPress={() =>
                  setSelectedMember(
                    member
                  )
                }
              >
                <Users
                  size={14}
                  color={
                    selectedMember?.id ===
                    member.id
                      ? "#15803D"
                      : "#64748B"
                  }
                />

                <Text
                  style={[
                    styles.memberChipText,
                    selectedMember?.id ===
                      member.id &&
                      styles.memberChipTextSelected,
                  ]}
                >
                  Member
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>
            Record Date
          </Text>

          <View style={styles.inputWithIcon}>
            <CalendarDays
              size={17}
              color="#94A3B8"
            />

            <TextInput
              value={recordDate}
              onChangeText={
                setRecordDate
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
              style={styles.iconInput}
            />
          </View>

          <Text style={styles.label}>
            Energy Allocated (kWh)
          </Text>

          <View style={styles.inputWithIcon}>
            <Zap
              size={17}
              color="#2563EB"
            />

            <TextInput
              value={energy}
              onChangeText={setEnergy}
              placeholder="e.g. 200"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.iconInput}
            />
          </View>

          <Text style={styles.label}>
            Estimated Saving (Rs.)
          </Text>

          <View style={styles.inputWithIcon}>
            <TrendingUp
              size={17}
              color="#16A34A"
            />

            <TextInput
              value={saving}
              onChangeText={setSaving}
              placeholder="e.g. 6000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.iconInput}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              savingRecord &&
                styles.addButtonDisabled,
            ]}
            onPress={handleAddRecord}
            disabled={savingRecord}
          >
            {savingRecord ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={
                  styles.addButtonText
                }
              >
                Add Savings Record
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Records */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Existing Records
          </Text>

          {records.length === 0 ? (
            <View style={styles.emptyCard}>
              <CalendarDays
                size={28}
                color="#94A3B8"
              />

              <Text style={styles.emptyTitle}>
                No records yet
              </Text>

              <Text style={styles.emptyText}>
                Savings records added by the
                admin will appear here.
              </Text>
            </View>
          ) : (
            records.map((record) => (
              <View
                key={record.id}
                style={styles.recordCard}
              >
                <View
                  style={styles.recordIcon}
                >
                  <TrendingUp
                    size={20}
                    color="#16A34A"
                  />
                </View>

                <View
                  style={styles.recordContent}
                >
                  <Text
                    style={styles.recordDate}
                  >
                    {record.record_date
                      ? new Date(
                          record.record_date
                        ).toLocaleDateString()
                      : "Unknown date"}
                  </Text>

                  <Text
                    style={
                      styles.recordEnergy
                    }
                  >
                    {Number(
                      record.energy_allocated_kwh ||
                        0
                    ).toLocaleString()}{" "}
                    kWh
                  </Text>
                </View>

                <View
                  style={
                    styles.recordAmountContainer
                  }
                >
                  <Text
                    style={
                      styles.recordAmount
                    }
                  >
                    Rs.{" "}
                    {Number(
                      record.estimated_saving ||
                        0
                    ).toLocaleString()}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      handleDelete(
                        record
                      )
                    }
                  >
                    <Trash2
                      size={17}
                      color="#DC2626"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
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
    marginTop: 12,
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

  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    ...SHADOWS.light,
  },

  projectContent: {
    marginLeft: 11,
  },

  projectLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontFamily: "Nunito_400Regular",
  },

  projectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    fontFamily: "Nunito_700Bold",
    marginTop: 2,
  },

  errorBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },

  formCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 17,
    ...SHADOWS.light,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },

  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 11,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },

  memberChipSelected: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },

  memberChipText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#64748B",
  },

  memberChipTextSelected: {
    color: "#15803D",
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    paddingHorizontal: 12,
  },

  iconInput: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#1E293B",
  },

  addButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  addButtonDisabled: {
    opacity: 0.7,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },

  section: {
    marginTop: 24,
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
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Nunito_400Regular",
  },

  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.light,
  },

  recordIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  recordContent: {
    flex: 1,
  },

  recordDate: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    fontFamily: "Nunito_700Bold",
  },

  recordEnergy: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
    fontFamily: "Nunito_400Regular",
  },

  recordAmountContainer: {
    alignItems: "flex-end",
    gap: 8,
  },

  recordAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#15803D",
    fontFamily: "Nunito_700Bold",
  },

  bottomPadding: {
    height: 30,
  },
});