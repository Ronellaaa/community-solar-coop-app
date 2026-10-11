// frontend/app/(tabs)/features/group-purchasing/manage-installers.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../../context/AuthContext";
import { adminInstallerService } from "../../../../services/group-purchasing/adminInstallerService";
import { SHADOWS } from "../../../utils/group-purchasing/shadows";

// Icons
import {
  CheckCircle,
  Building2,
  Star,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Award,
} from "lucide-react-native";

export default function ManageInstallersScreen() {
  const router = useRouter();
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'verified'
  const [pendingInstallers, setPendingInstallers] = useState([]);
  const [verifiedInstallers, setVerifiedInstallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(null);

  // Load data
  const loadInstallers = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading installers...");

      const [pending, verified] = await Promise.all([
        adminInstallerService.getPendingInstallers(),
        adminInstallerService.getVerifiedInstallers(),
      ]);

      console.log("📦 Pending:", pending?.length || 0);
      console.log("📦 Verified:", verified?.length || 0);

      setPendingInstallers(pending || []);
      setVerifiedInstallers(verified || []);
    } catch (error) {
      console.error("❌ Error loading installers:", error);
      showAlert("Error", "Failed to load installers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInstallers();
    setRefreshing(false);
  };

  // Helper: Show alert (web + mobile)
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Helper: Show confirm dialog (web + mobile)
  const showConfirm = (title, message, onConfirm) => {
    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: onConfirm,
        },
      ]);
    }
  };

  // Handle verify installer
  const handleVerify = (installer) => {
    showConfirm(
      "Verify Installer",
      `Are you sure you want to verify "${installer.name}"? They will be able to post deals.`,
      async () => {
        try {
          setProcessing(installer.id);
          await adminInstallerService.verifyInstaller(installer.id);
          showAlert("✅ Verified", `${installer.name} has been verified.`);
          await loadInstallers();
        } catch (error) {
          console.error("❌ Verify error:", error);
          showAlert("Error", "Failed to verify installer.");
        } finally {
          setProcessing(null);
        }
      },
    );
  };

  // Handle unverify installer
  const handleUnverify = (installer) => {
    showConfirm(
      "Unverify Installer",
      `Are you sure you want to unverify "${installer.name}"? They will no longer be able to post deals.`,
      async () => {
        try {
          setProcessing(installer.id);
          await adminInstallerService.unverifyInstaller(installer.id);
          showAlert("⚠️ Unverified", `${installer.name} has been unverified.`);
          await loadInstallers();
        } catch (error) {
          console.error("❌ Unverify error:", error);
          showAlert("Error", "Failed to unverify installer.");
        } finally {
          setProcessing(null);
        }
      },
    );
  };

  const currentInstallers =
    activeTab === "pending" ? pendingInstallers : verifiedInstallers;

  // ============================================================
  // RENDER INSTALLER CARD
  // ============================================================
  const renderInstallerCard = (installer) => {
    const isProcessing = processing === installer.id;
    const yearsMap = {
      3: "0-5 years",
      7: "5-10 years",
      15: "10-20 years",
      25: "20+ years",
    };
    const yearsLabel =
      yearsMap[installer.years_in_business] ||
      `${installer.years_in_business} years`;

    return (
      <View key={installer.id} style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.companyInfo}>
            <View style={styles.companyLogo}>
              <Building2 size={24} color="#1A5C4A" strokeWidth={2} />
            </View>
            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>
                {installer.name || "Unknown"}
              </Text>
              <View style={styles.ratingRow}>
                <Star
                  size={12}
                  color="#F59E0B"
                  fill="#F59E0B"
                  strokeWidth={0}
                />
                <Text style={styles.ratingText}>
                  {installer.rating?.toFixed(1) || "0.0"}
                </Text>
                <View style={styles.dotSeparator} />
                <Award size={12} color="#64748B" strokeWidth={2} />
                <Text style={styles.yearsText}>{yearsLabel}</Text>
              </View>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              installer.is_verified
                ? styles.statusBadgeVerified
                : styles.statusBadgePending,
            ]}
          >
            {installer.is_verified ? (
              <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <Clock size={12} color="#FFFFFF" strokeWidth={2.5} />
            )}
            <Text style={styles.statusText}>
              {installer.is_verified ? "Verified" : "Pending"}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {installer.id}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {installer.is_verified ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.unverifyButton]}
            onPress={() => handleUnverify(installer)}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator color="#EF4444" size="small" />
            ) : (
              <>
                <ShieldAlert size={18} color="#EF4444" strokeWidth={2.5} />
                <Text style={styles.unverifyButtonText}>
                  Unverify Installer
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.verifyButton]}
            onPress={() => handleVerify(installer)}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <CheckCircle size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.verifyButtonText}>Verify Installer</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
        <Text style={styles.loadingText}>Loading installers...</Text>
      </View>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            role === "admin"
              ? router.replace(
                  "/(tabs)/features/admin-shared-solar/AdminSharedSolarDashboard",
                )
              : router.back()
          }
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Installers</Text>
        <View style={styles.backButton} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.tabActive]}
          onPress={() => setActiveTab("pending")}
          activeOpacity={0.7}
        >
          <Clock
            size={16}
            color={activeTab === "pending" ? "#1A5C4A" : "#64748B"}
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.tabTextActive,
            ]}
          >
            Pending
          </Text>
          <View
            style={[
              styles.tabBadge,
              activeTab === "pending" && styles.tabBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.tabBadgeText,
                activeTab === "pending" && styles.tabBadgeTextActive,
              ]}
            >
              {pendingInstallers.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "verified" && styles.tabActive]}
          onPress={() => setActiveTab("verified")}
          activeOpacity={0.7}
        >
          <ShieldCheck
            size={16}
            color={activeTab === "verified" ? "#1A5C4A" : "#64748B"}
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "verified" && styles.tabTextActive,
            ]}
          >
            Verified
          </Text>
          <View
            style={[
              styles.tabBadge,
              activeTab === "verified" && styles.tabBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.tabBadgeText,
                activeTab === "verified" && styles.tabBadgeTextActive,
              ]}
            >
              {verifiedInstallers.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {currentInstallers.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              {activeTab === "pending" ? (
                <CheckCircle size={48} color="#10B981" strokeWidth={1.5} />
              ) : (
                <Building2 size={48} color="#94A3B8" strokeWidth={1.5} />
              )}
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === "pending"
                ? "All Caught Up!"
                : "No Verified Installers"}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === "pending"
                ? "There are no pending installer applications."
                : "No installers have been verified yet."}
            </Text>
          </View>
        ) : (
          currentInstallers.map(renderInstallerCard)
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================
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
    fontSize: 16,
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
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#F1F5F9",
    gap: 8,
  },
  tabActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#1A5C4A",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#1A5C4A",
  },
  tabBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    minWidth: 24,
    alignItems: "center",
  },
  tabBadgeActive: {
    backgroundColor: "#1A5C4A",
  },
  tabBadgeText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#64748B",
  },
  tabBadgeTextActive: {
    color: "#FFFFFF",
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#F59E0B",
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 4,
  },
  yearsText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },

  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    gap: 4,
  },
  statusBadgeVerified: {
    backgroundColor: "#10B981",
  },
  statusBadgePending: {
    backgroundColor: "#F59E0B",
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Details
  detailsSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#94A3B8",
    minWidth: 40,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    flex: 1,
  },

  // Action Button
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  verifyButton: {
    backgroundColor: "#1A5C4A",
    ...SHADOWS.button,
  },
  verifyButtonText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  unverifyButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  unverifyButtonText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#EF4444",
    letterSpacing: 0.3,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
});
