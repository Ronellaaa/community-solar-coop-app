import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  IndianRupee,
  Sun,
  Zap,
} from "lucide-react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import {
  getSharedSolarProject,
  getMyJoinRequest,
  createJoinRequest,
} from "../../../../services/sharedSolarService";

import { SHADOWS } from "../../../utils/shared-solar/shadows";

export default function JoinSharedSolar() {
  const router = useRouter();

  const { projectId } = useLocalSearchParams();

  const [project, setProject] = useState(null);
  const [existingRequest, setExistingRequest] =
    useState(null);

  const [contribution, setContribution] =
    useState("");

  const [energyAllocation, setEnergyAllocation] =
    useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [projectData, requestData] =
        await Promise.all([
          getSharedSolarProject(projectId),
          getMyJoinRequest(projectId),
        ]);

      setProject(projectData);
      setExistingRequest(requestData);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        error.message ||
          "Unable to load joining information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleSubmit = async () => {
    if (!contribution.trim()) {
      Alert.alert(
        "Required",
        "Please enter your contribution commitment."
      );
      return;
    }

    if (!energyAllocation.trim()) {
      Alert.alert(
        "Required",
        "Please enter your estimated energy allocation."
      );
      return;
    }

    if (Number(contribution) <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid contribution amount."
      );
      return;
    }

    if (Number(energyAllocation) <= 0) {
      Alert.alert(
        "Invalid Energy",
        "Please enter a valid energy allocation."
      );
      return;
    }

    if (existingRequest) {
      Alert.alert(
        "Already Submitted",
        "You have already submitted a joining request for this project."
      );
      return;
    }

    try {
      setSubmitting(true);

      const request = await createJoinRequest({
        projectId,
        contributionCommitment:
          Number(contribution),
        estimatedEnergyAllocation:
          Number(energyAllocation),
        message,
      });

      setExistingRequest(request);

      Alert.alert(
        "Submitted Successfully",
        "Your joining request has been submitted to the administrator for review.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Unable to Submit",
        error.message ||
          "Something went wrong while submitting your request."
      );
    } finally {
      setSubmitting(false);
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

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Project not found
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  // ALREADY SUBMITTED
  // =====================================================

  if (existingRequest) {
    const status = existingRequest.status;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
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
            Join Shared Solar
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <CheckCircle
              size={48}
              color="#16A34A"
              strokeWidth={2}
            />
          </View>

          <Text style={styles.successTitle}>
            Request Submitted
          </Text>

          <Text style={styles.successDescription}>
            You have already submitted your joining
            request for this community solar project.
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {status === "pending"
                ? "Pending Admin Approval"
                : status === "approved"
                ? "Approved"
                : "Rejected"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>
            Your Commitment
          </Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <IndianRupee
                size={19}
                color="#16A34A"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>
                Fund Commitment
              </Text>

              <Text style={styles.detailValue}>
                Rs.{" "}
                {Number(
                  existingRequest.contribution_commitment
                ).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Zap
                size={19}
                color="#16A34A"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>
                Estimated Energy Allocation
              </Text>

              <Text style={styles.detailValue}>
                {Number(
                  existingRequest.estimated_energy_allocation
                ).toLocaleString()}{" "}
                kWh
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            What happens next?
          </Text>

          <Text style={styles.infoText}>
            The administrator will review your joining
            request. If approved, you will become a member
            of this shared solar project.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>
            Back to Project
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // =====================================================
  // JOIN FORM
  // =====================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
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
          Join Shared Solar
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Sun
            size={34}
            color="#16A34A"
          />
        </View>

        <Text style={styles.projectName}>
          {project.name}
        </Text>

        {project.location ? (
          <Text style={styles.location}>
            {project.location}
          </Text>
        ) : null}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Join this community solar project
        </Text>

        <Text style={styles.infoText}>
          Submit your contribution commitment and
          estimated energy requirement. Your request
          will be reviewed by the project administrator.
        </Text>

        <Text style={styles.commitmentNote}>
          This is a commitment only. No payment is
          processed through the app.
        </Text>
      </View>

      {/* Contribution */}
      <View style={styles.formCard}>
        <Text style={styles.label}>
          Fund Commitment
        </Text>

        <Text style={styles.helperText}>
          Enter the amount you are willing to contribute
          to the community solar project.
        </Text>

        <View style={styles.inputContainer}>
          <IndianRupee
            size={19}
            color="#94A3B8"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. 50000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={contribution}
            onChangeText={setContribution}
          />
        </View>

        <Text style={styles.inputHint}>
          Required project fund: Rs.{" "}
          {Number(
            project.required_fund || 0
          ).toLocaleString()}
        </Text>
      </View>

      {/* Energy */}
      <View style={styles.formCard}>
        <Text style={styles.label}>
          Estimated Energy Allocation
        </Text>

        <Text style={styles.helperText}>
          Enter the estimated amount of solar energy you
          expect to receive from the project.
        </Text>

        <View style={styles.inputContainer}>
          <Zap
            size={19}
            color="#94A3B8"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. 100"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={energyAllocation}
            onChangeText={setEnergyAllocation}
          />

          <Text style={styles.unit}>
            kWh
          </Text>
        </View>
      </View>

      {/* Message */}
      <View style={styles.formCard}>
        <Text style={styles.label}>
          Message
          <Text style={styles.optional}>
            {" "}
            (Optional)
          </Text>
        </Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Add any message for the administrator..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
          textAlignVertical="top"
        />
      </View>

      {/* Submit */}
      <View style={styles.submitSection}>
        <Text style={styles.warningText}>
          You can submit only one joining request for
          this project.
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            submitting && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.primaryButtonText}>
              Submit Joining Request
            </Text>
          )}
        </TouchableOpacity>
      </View>

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
    margin: 20,
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
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

  projectName: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },

  location: {
    fontSize: 13,
    color: "#94A3B8",
    fontFamily: "Nunito_400Regular",
    marginTop: 5,
  },

  infoCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 17,
    backgroundColor: "#F0FDF4",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
  },

  infoText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    fontFamily: "Nunito_400Regular",
    marginTop: 6,
  },

  commitmentNote: {
    fontSize: 11,
    lineHeight: 16,
    color: "#15803D",
    fontFamily: "Nunito_700Bold",
    marginTop: 10,
  },

  formCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 17,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  optional: {
    fontWeight: "400",
    color: "#94A3B8",
  },

  helperText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#64748B",
    fontFamily: "Nunito_400Regular",
    marginTop: 5,
    marginBottom: 12,
  },

  inputContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "Nunito_400Regular",
  },

  unit: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Nunito_700Bold",
  },

  inputHint: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6,
    fontFamily: "Nunito_400Regular",
  },

  messageInput: {
    minHeight: 100,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 13,
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "Nunito_400Regular",
  },

  submitSection: {
    marginHorizontal: 20,
    marginTop: 5,
  },

  warningText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#64748B",
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
    marginBottom: 10,
  },

  primaryButton: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },

  disabledButton: {
    opacity: 0.7,
  },

  successCard: {
    margin: 20,
    padding: 25,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    ...SHADOWS.light,
  },

  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#15803D",
    marginTop: 15,
  },

  successDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
    marginTop: 7,
  },

  statusBadge: {
    marginTop: 15,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
    fontFamily: "Nunito_700Bold",
  },

  detailsCard: {
    marginHorizontal: 20,
    padding: 17,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    ...SHADOWS.light,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  detailLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "Nunito_400Regular",
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    fontFamily: "Nunito_700Bold",
    marginTop: 2,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#64748B",
    fontFamily: "Nunito_400Regular",
  },

  errorContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
    fontFamily: "Nunito_700Bold",
  },

  bottomPadding: {
    height: 20,
  },
});