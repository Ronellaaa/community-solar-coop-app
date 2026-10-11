// frontend/app/(tabs)/features/group-purchasing/installer/PendingApproval.jsx

import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../../../../../context/AppContext";
import { useAuth } from "../../../../../context/AuthContext";
import { installerService } from "../../../../../services/group-purchasing/installerService";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";

// Icons
import {
  Clock,
  ShieldCheck,
  Building2,
  Star,
  Award,
  LogOut,
  RefreshCw,
  CheckCircle,
} from "lucide-react-native";

export default function PendingApprovalScreen() {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const { role, roleLoading, signOut } = useAuth();
  const [installer, setInstaller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInstaller = useCallback(async () => {
    if (roleLoading) return;

    if (role !== "installer") {
      router.replace(
        role === "admin"
          ? "/(tabs)/features/admin-shared-solar/AdminSharedSolarDashboard"
          : "/(tabs)/home",
      );
      return;
    }

    if (!currentUser?.id) return;

    try {
      const data = await installerService.getInstallerByUserId(currentUser.id);
      setInstaller(data);

      // ✅ If verified, redirect to dashboard
      if (data?.is_verified) {
        router.replace(
          "/(tabs)/features/group-purchasing/installer/InstallerDashboard",
        );
      }
    } catch (error) {
      console.error("❌ Error loading installer:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, role, roleLoading, router]);

  useEffect(() => {
    if (!roleLoading) {
      loadInstaller();
    }
  }, [loadInstaller, roleLoading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInstaller();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
      </View>
    );
  }

  const yearsMap = {
    3: "0-5 years",
    7: "5-10 years",
    15: "10-20 years",
    25: "20+ years",
  };
  const yearsLabel =
    yearsMap[installer?.years_in_business] ||
    `${installer?.years_in_business || 0} years`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Clock size={48} color="#F59E0B" strokeWidth={2} />
          </View>
        </View>
        <Text style={styles.title}>Pending Approval</Text>
        <Text style={styles.subtitle}>
          Your installer account is currently under review
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Company</Text>
          <Text style={styles.infoValue}>{installer?.name || "Unknown"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rating</Text>
          <View style={styles.ratingInline}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.infoValue}>
              {installer?.rating?.toFixed(1) || "0.0"}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Years in Business</Text>
          <Text style={styles.infoValue}>{yearsLabel}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Clock size={12} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.statusText}>Pending Review</Text>
          </View>
        </View>
      </View>

      {/* What Happens Next */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What happens next?</Text>

        <View style={styles.stepRow}>
          <View style={styles.stepIcon}>
            <CheckCircle size={20} color="#10B981" strokeWidth={2.5} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Account Created</Text>
            <Text style={styles.stepDescription}>
              Your installer account has been successfully created.
            </Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.stepIcon, styles.stepIconPending]}>
            <Clock size={20} color="#F59E0B" strokeWidth={2.5} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review in Progress</Text>
            <Text style={styles.stepDescription}>
              Our team is reviewing your application. This usually takes 24-48
              hours.
            </Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.stepIcon, styles.stepIconInactive]}>
            <ShieldCheck size={20} color="#94A3B8" strokeWidth={2.5} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Start Posting Deals</Text>
            <Text style={styles.stepDescription}>
              Once verified, you'll be able to post deals and manage campaigns.
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={refreshing}
        activeOpacity={0.8}
      >
        {refreshing ? (
          <ActivityIndicator color="#1A5C4A" size="small" />
        ) : (
          <>
            <RefreshCw size={18} color="#1A5C4A" strokeWidth={2.5} />
            <Text style={styles.refreshButtonText}>Check Status</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFFBEB",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    color: "#94A3B8",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  ratingInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepIconPending: {
    backgroundColor: "#FFFBEB",
  },
  stepIconInactive: {
    backgroundColor: "#F1F5F9",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    lineHeight: 18,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#1A5C4A",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  refreshButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#1A5C4A",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#EF4444",
  },
});
