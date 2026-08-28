import React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
} from "lucide-react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  createSharedSolarProject,
  getSharedSolarProject,
  updateSharedSolarProject,
} from "../../../../services/sharedSolarService";
import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function AdminCreateSolarProject() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const projectId = params.projectId;

  const isEditing = Boolean(projectId);

  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [targetMembers, setTargetMembers] =
    React.useState("");
  const [requiredFund, setRequiredFund] =
    React.useState("");
  const [description, setDescription] =
    React.useState("");
  const [status, setStatus] =
    React.useState("planning");

  const [loading, setLoading] =
    React.useState(isEditing);
  const [saving, setSaving] =
    React.useState(false);
  const [error, setError] =
    React.useState(null);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }

    const loadProject = async () => {
      try {
        setLoading(true);

        const project =
          await getSharedSolarProject(projectId);

        setName(project.name || "");
        setLocation(project.location || "");
        setCapacity(
          String(project.total_capacity_kw || "")
        );
        setTargetMembers(
          String(project.target_members || "")
        );
        setRequiredFund(
          String(project.required_fund || "")
        );
        setDescription(
          project.description || ""
        );
        setStatus(
          project.status || "planning"
        );
      } catch (err) {
        console.error(err);
        setError(
          err?.message ||
            "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [isEditing, projectId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!name.trim()) {
        throw new Error(
          "Please enter a project name."
        );
      }

      if (!capacity || Number(capacity) <= 0) {
        throw new Error(
          "Please enter a valid capacity."
        );
      }

      if (
        !targetMembers ||
        Number(targetMembers) <= 0
      ) {
        throw new Error(
          "Please enter a valid target member count."
        );
      }

      if (isEditing) {
        await updateSharedSolarProject(
          projectId,
          {
            name,
            location,
            totalCapacityKw: capacity,
            targetMembers,
            requiredFund,
            description,
            status,
          }
        );

        Alert.alert(
          "Success",
          "Solar project updated successfully.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        await createSharedSolarProject({
          name,
          location,
          totalCapacityKw: capacity,
          targetMembers,
          requiredFund,
          description,
          status,
        });

        Alert.alert(
          "Success",
          "Solar project created successfully.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading project...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
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
          {isEditing
            ? "Edit Solar Project"
            : "Create Solar Project"}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            Project Details
          </Text>

          <Text style={styles.label}>
            Project Name *
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Matara Community Solar"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          <Text style={styles.label}>
            Location
          </Text>

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Matara"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          <Text style={styles.label}>
            Solar Capacity (kW) *
          </Text>

          <TextInput
            value={capacity}
            onChangeText={setCapacity}
            placeholder="e.g. 50"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>
            Target Members *
          </Text>

          <TextInput
            value={targetMembers}
            onChangeText={setTargetMembers}
            placeholder="e.g. 40"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>
            Required Community Fund (Rs.)
          </Text>

          <TextInput
            value={requiredFund}
            onChangeText={setRequiredFund}
            placeholder="e.g. 500000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the shared solar project..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textArea,
            ]}
          />

          <Text style={styles.label}>
            Project Status
          </Text>

          <View style={styles.statusRow}>
            {[
              "planning",
              "active",
              "completed",
              "cancelled",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.statusOption,
                  status === item &&
                    styles.statusOptionSelected,
                ]}
                onPress={() =>
                  setStatus(item)
                }
              >
                {status === item ? (
                  <CheckCircle
                    size={14}
                    color="#15803D"
                  />
                ) : null}

                <Text
                  style={[
                    styles.statusOptionText,
                    status === item &&
                      styles.statusOptionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing
                ? "Update Project"
                : "Create Project"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
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

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#475569",
    marginBottom: 7,
    marginTop: 13,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#1E293B",
  },

  textArea: {
    minHeight: 100,
  },

  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 11,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statusOptionSelected: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },

  statusOptionText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#64748B",
    textTransform: "capitalize",
  },

  statusOptionTextSelected: {
    color: "#15803D",
  },

  saveButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 13,
    padding: 13,
    marginBottom: 12,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  bottomPadding: {
    height: 30,
  },
});