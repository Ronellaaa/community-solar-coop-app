// frontend/app/(tabs)/features/group-purchasing/installer/BankDetails.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../../../../../context/AppContext";
import { installerService } from "../../../../../services/group-purchasing/installerService";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";

// Icons
import {
  ArrowLeft,
  Save,
  Building2,
  CreditCard,
  User,
  MapPin,
  ShieldCheck,
  AlertCircle,
} from "lucide-react-native";

export default function BankDetailsScreen() {
  const router = useRouter();
  const { currentUser } = useAppContext();

  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExistingDetails, setHasExistingDetails] = useState(false);

  // ============================================================
  // Helper: Show alert (web + mobile)
  // ============================================================
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // ============================================================
  // Load existing bank details
  // ============================================================
  useEffect(() => {
    const load = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const data = await installerService.getBankDetails(currentUser.id);

        if (data) {
          setBankName(data.bank_name || "");
          setAccountHolderName(data.account_holder_name || "");
          setBankAccountNumber(data.bank_account_number || "");
          setBankBranch(data.bank_branch || "");

          // Check if they already have details saved
          const hasDetails =
            !!data.bank_name ||
            !!data.bank_account_number ||
            !!data.account_holder_name;

          setHasExistingDetails(hasDetails);
        }
      } catch (error) {
        console.error("❌ Error loading bank details:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser]);

  // ============================================================
  // Validation
  // ============================================================
  const validate = () => {
    if (!bankName.trim()) return "Please enter your bank name";
    if (!accountHolderName.trim())
      return "Please enter the account holder name";
    if (!bankAccountNumber.trim()) return "Please enter your account number";
    if (bankAccountNumber.trim().length < 6)
      return "Account number looks too short";
    if (!bankBranch.trim()) return "Please enter your branch name";
    return null;
  };

  // ============================================================
  // Save handler
  // ============================================================
  const handleSave = async () => {
    const error = validate();
    if (error) {
      showAlert("Validation Error", error);
      return;
    }

    try {
      setSaving(true);

      await installerService.updateBankDetails(currentUser.id, {
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
        bankAccountNumber: bankAccountNumber.trim(),
        bankBranch: bankBranch.trim(),
      });

      showAlert(
        "✅ Saved",
        "Your bank details have been saved. Members will use these details when paying you.",
      );
      setHasExistingDetails(true);
    } catch (error) {
      console.error("❌ Error saving bank details:", error);
      showAlert("Error", "Failed to save bank details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // Loading
  // ============================================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
        <Text style={styles.loadingText}>Loading bank details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <ShieldCheck size={20} color="#1A5C4A" strokeWidth={2.5} />
          <View style={styles.infoBannerText}>
            <Text style={styles.infoTitle}>
              {hasExistingDetails
                ? "Your bank details are saved"
                : "Why we ask for bank details"}
            </Text>
            <Text style={styles.infoSubtitle}>
              {hasExistingDetails
                ? "Members of locked campaigns will see these details to pay you directly."
                : "When a campaign is locked, members will use these details to transfer their payments to you."}
            </Text>
          </View>
        </View>

        {/* Warning if missing details */}
        {!hasExistingDetails && (
          <View style={styles.warningBanner}>
            <AlertCircle size={18} color="#F59E0B" strokeWidth={2.5} />
            <Text style={styles.warningText}>
              Please add your bank details before members can pay you.
            </Text>
          </View>
        )}

        {/* Bank Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Bank Name *</Text>
          <View style={styles.inputWrapper}>
            <Building2
              size={18}
              color="#94A3B8"
              strokeWidth={2}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g., Commercial Bank"
              value={bankName}
              onChangeText={setBankName}
              editable={!saving}
            />
          </View>
        </View>

        {/* Account Holder Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Account Holder Name *</Text>
          <View style={styles.inputWrapper}>
            <User
              size={18}
              color="#94A3B8"
              strokeWidth={2}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g., SunPower Co. (Pvt) Ltd"
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              editable={!saving}
            />
          </View>
          <Text style={styles.helperText}>
            Must match the name registered with your bank
          </Text>
        </View>

        {/* Account Number */}
        <View style={styles.field}>
          <Text style={styles.label}>Account Number *</Text>
          <View style={styles.inputWrapper}>
            <CreditCard
              size={18}
              color="#94A3B8"
              strokeWidth={2}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g., 1234567890"
              value={bankAccountNumber}
              onChangeText={setBankAccountNumber}
              keyboardType="numeric"
              editable={!saving}
            />
          </View>
        </View>

        {/* Branch */}
        <View style={styles.field}>
          <Text style={styles.label}>Branch *</Text>
          <View style={styles.inputWrapper}>
            <MapPin
              size={18}
              color="#94A3B8"
              strokeWidth={2}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g., Colombo 07"
              value={bankBranch}
              onChangeText={setBankBranch}
              editable={!saving}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveButtonText}>
                {hasExistingDetails
                  ? "Update Bank Details"
                  : "Save Bank Details"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Security note */}
        <View style={styles.securityNote}>
          <ShieldCheck size={14} color="#64748B" strokeWidth={2} />
          <Text style={styles.securityNoteText}>
            Only verified members of your locked campaigns can view these
            details.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  // Content
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },

  // Info banner
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 12,
  },
  infoBannerText: { flex: 1 },
  infoTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1A5C4A",
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#166534",
    lineHeight: 18,
  },

  // Warning banner
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 10,
  },
  warningText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#92400E",
    flex: 1,
  },

  // Form fields
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#1E293B",
  },
  helperText: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  // Save button
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A5C4A",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    ...SHADOWS.button,
  },
  saveButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Security note
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  securityNoteText: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    flex: 1,
  },
});
