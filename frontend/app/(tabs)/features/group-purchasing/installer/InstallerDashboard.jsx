// frontend/app/(tabs)/features/group-purchasing/installer/InstallerDashboard.jsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAppContext } from "../../../../../context/AppContext";
import { installerService } from "../../../../../services/group-purchasing/installerService";
import { ProfileAvatar } from "../../../../../components/common";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";

// Icons
import {
  Plus,
  Package,
  Users,
  Lock,
  ChevronRight,
  Bell,
  DollarSign,
  CheckCircle,
  Building2,
  AlertCircle,
  List,
} from "lucide-react-native";

export default function InstallerDashboard() {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const [installer, setInstaller] = useState(null);
  const [stats, setStats] = useState({
    activeDeals: 0,
    totalCampaigns: 0,
    lockedCampaigns: 0,
  });
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);

      // Check installer status
      const installerData = await installerService.getInstallerByUserId(
        currentUser.id,
      );

      if (!installerData?.is_verified) {
        router.replace(
          "/(tabs)/features/group-purchasing/installer/PendingApproval",
        );
        return;
      }

      setInstaller(installerData);

      // ✅ Check if bank details are saved
      const bankData = await installerService.getBankDetails(currentUser.id);
      const bankComplete =
        !!bankData?.bank_name &&
        !!bankData?.bank_account_number &&
        !!bankData?.account_holder_name;
      setHasBankDetails(bankComplete);

      // Load stats and campaigns
      const [statsData, campaignsData] = await Promise.all([
        installerService.getInstallerStats(currentUser.id),
        installerService.getCampaignsForInstaller(currentUser.id),
      ]);

      setStats(statsData);
      setAllCampaigns(campaignsData || []);
    } catch (error) {
      console.error("❌ Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refetch every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [currentUser]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ✅ Filter campaigns by status
  const lockedCampaigns = allCampaigns.filter((c) => c.status === "locked");
  const paymentConfirmedCampaigns = allCampaigns.filter(
    (c) => c.status === "payment_confirmed",
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>🔧 Installer Dashboard</Text>
            <Text style={styles.subtitle}>{installer?.name || "Welcome!"}</Text>
          </View>
          <ProfileAvatar size={44} />
        </View>
      </View>

      {/* ✅ WARNING BANNER: Missing Bank Details */}
      {!hasBankDetails && (
        <TouchableOpacity
          style={styles.missingBankBanner}
          onPress={() =>
            router.push(
              "/(tabs)/features/group-purchasing/installer/BankDetails",
            )
          }
          activeOpacity={0.8}
        >
          <View style={styles.missingBankIcon}>
            <AlertCircle size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View style={styles.missingBankContent}>
            <Text style={styles.missingBankTitle}>Add Your Bank Details</Text>
            <Text style={styles.missingBankText}>
              Members can't pay you until your bank details are set. Tap to add
              them now.
            </Text>
          </View>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      {/* ✅ NOTIFICATION BANNER: Campaigns awaiting payment verification */}
      {lockedCampaigns.length > 0 && (
        <View style={styles.notificationBanner}>
          <View style={styles.notificationIcon}>
            <Bell size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              Payment Verification Needed
            </Text>
            <Text style={styles.notificationText}>
              {lockedCampaigns.length}{" "}
              {lockedCampaigns.length === 1 ? "campaign has" : "campaigns have"}{" "}
              members ready to pay. Check your bank account.
            </Text>
          </View>
        </View>
      )}

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.activeDeals}</Text>
          <Text style={styles.statLabel}>Active Deals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalCampaigns}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{lockedCampaigns.length}</Text>
          <Text style={styles.statLabel}>Awaiting Payment</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {/* Post New Deal */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push(
                "/(tabs)/features/group-purchasing/installer/PostDeal",
              )
            }
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
              <Plus size={24} color="#1A5C4A" strokeWidth={2.5} />
            </View>
            <Text style={styles.actionTitle}>Post New Deal</Text>
            <Text style={styles.actionSubtitle}>Create a new offer</Text>
          </TouchableOpacity>

          {/* My Deals */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push("/(tabs)/features/group-purchasing/installer/MyDeals")
            }
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
              <Package size={24} color="#3B82F6" strokeWidth={2.5} />
            </View>
            <Text style={styles.actionTitle}>My Deals</Text>
            <Text style={styles.actionSubtitle}>Manage your offers</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Bank Details Card (full width) */}
        <TouchableOpacity
          style={styles.bankDetailsCard}
          onPress={() =>
            router.push(
              "/(tabs)/features/group-purchasing/installer/BankDetails",
            )
          }
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: hasBankDetails ? "#F0FDF4" : "#FFFBEB",
                marginBottom: 0,
                marginRight: 14,
              },
            ]}
          >
            <Building2
              size={24}
              color={hasBankDetails ? "#1A5C4A" : "#F59E0B"}
              strokeWidth={2.5}
            />
          </View>
          <View style={styles.bankDetailsContent}>
            <Text style={styles.actionTitle}>
              {hasBankDetails ? "View Bank Details" : "Add Bank Details"}
            </Text>
            <Text style={styles.actionSubtitle}>
              {hasBankDetails
                ? "Manage your payment information"
                : "Required to receive payments"}
            </Text>
          </View>
          {!hasBankDetails && (
            <View style={styles.bankRequiredBadge}>
              <Text style={styles.bankRequiredText}>Required</Text>
            </View>
          )}
          <ChevronRight size={18} color="#94A3B8" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* ✅ NEW: View All Campaigns button */}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push(
              "/(tabs)/features/group-purchasing/installer/DealCampaigns?installerId=" +
                currentUser.id,
            )
          }
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: "#FFF7ED",
                marginBottom: 0,
                marginRight: 14,
              },
            ]}
          >
            <List size={24} color="#F59E0B" strokeWidth={2.5} />
          </View>
          <View style={styles.bankDetailsContent}>
            <Text style={styles.actionTitle}>View All Campaigns</Text>
            <Text style={styles.actionSubtitle}>
              See all campaigns across your deals
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* ✅ SECTION 1: Campaigns Awaiting Payment Verification */}
      {lockedCampaigns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <DollarSign size={20} color="#F59E0B" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Awaiting Payment</Text>
            </View>
            <Text style={styles.sectionCount}>{lockedCampaigns.length}</Text>
          </View>

          {lockedCampaigns.map((campaign) => {
            const deal = campaign.deal || {};
            const organizer = campaign.organizer || {};
            const members = campaign.members || [];
            const paidCount = members.filter((m) => m.status === "paid").length;

            return (
              <TouchableOpacity
                key={campaign.id}
                style={[styles.campaignCard, styles.campaignCardAwaiting]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/(tabs)/features/group-purchasing/installer/DealCampaigns",
                    params: { campaignId: campaign.id },
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>
                    {deal.title || "Untitled Deal"}
                  </Text>
                  <View style={styles.awaitingBadge}>
                    <DollarSign size={10} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.awaitingBadgeText}>Verify Payment</Text>
                  </View>
                </View>

                <View style={styles.campaignMeta}>
                  <View style={styles.metaItem}>
                    <Users size={14} color="#64748B" strokeWidth={2} />
                    <Text style={styles.metaText}>
                      {paidCount}/{members.length} paid
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>
                      Led by {organizer.name || "Unknown"}
                    </Text>
                  </View>
                </View>

                <View style={styles.campaignFooter}>
                  <Text style={styles.viewText}>Verify & Confirm</Text>
                  <ChevronRight size={16} color="#1A5C4A" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ✅ SECTION 2: Payment Confirmed — Ready for Installation */}
      {paymentConfirmedCampaigns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <CheckCircle size={20} color="#10B981" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Ready for Installation</Text>
            </View>
            <Text style={styles.sectionCount}>
              {paymentConfirmedCampaigns.length}
            </Text>
          </View>

          {paymentConfirmedCampaigns.map((campaign) => {
            const deal = campaign.deal || {};
            const members = campaign.members || [];

            return (
              <TouchableOpacity
                key={campaign.id}
                style={[styles.campaignCard, styles.campaignCardReady]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/(tabs)/features/group-purchasing/installer/DealCampaigns",
                    params: { campaignId: campaign.id },
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>
                    {deal.title || "Untitled Deal"}
                  </Text>
                  <View style={styles.readyBadge}>
                    <CheckCircle size={10} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.readyBadgeText}>Ready</Text>
                  </View>
                </View>

                <View style={styles.campaignMeta}>
                  <View style={styles.metaItem}>
                    <Users size={14} color="#64748B" strokeWidth={2} />
                    <Text style={styles.metaText}>
                      {members.length} members
                    </Text>
                  </View>
                </View>

                <View style={styles.campaignFooter}>
                  <Text style={styles.viewText}>Schedule Installation</Text>
                  <ChevronRight size={16} color="#1A5C4A" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ✅ Empty state when no locked/confirmed campaigns */}
      {lockedCampaigns.length === 0 &&
        paymentConfirmedCampaigns.length === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Lock size={20} color="#94A3B8" strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Campaigns</Text>
              </View>
            </View>

            <View style={styles.emptyState}>
              <Lock size={48} color="#CBD5E1" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
              <Text style={styles.emptySubtitle}>
                Campaigns ready for payment verification will appear here.
              </Text>
            </View>
          </View>
        )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  contentContainer: { paddingBottom: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  headerText: { flex: 1 },
  greeting: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
  },

  // ✅ Missing Bank Details Banner
  missingBankBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  missingBankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  missingBankContent: { flex: 1 },
  missingBankTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  missingBankText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 16,
  },

  // Notification Banner
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: { flex: 1 },
  notificationTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  notificationText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 16,
  },

  statsBanner: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -10,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.light,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: { width: 1, backgroundColor: "#E2E8F0" },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },
  actionsGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },

  // ✅ Bank Details Card
  bankDetailsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
    ...SHADOWS.card,
  },
  bankDetailsContent: { flex: 1 },

  // ✅ View All Campaigns Button
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },

  bankRequiredBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    marginRight: 8,
  },
  bankRequiredText: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#92400E",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },
  campaignCardAwaiting: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  campaignCardReady: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  campaignTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    flex: 1,
  },
  awaitingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    gap: 4,
  },
  awaitingBadgeText: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    gap: 4,
  },
  readyBadgeText: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  campaignMeta: { flexDirection: "row", gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },
  campaignFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  viewText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#1A5C4A",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#64748B",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
  },
  bottomPadding: { height: 20 },
});
