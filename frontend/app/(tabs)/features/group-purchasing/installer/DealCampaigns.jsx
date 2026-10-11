// frontend/app/(tabs)/features/group-purchasing/installer/DealCampaigns.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../../../lib/supabase";
import { installerService } from "../../../../../services/group-purchasing/installerService";
import { useAppContext } from "../../../../../context/AppContext";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";
import { formatDate, formatCurrency } from "../../../../utils/group-purchasing";

// Icons
import {
  ArrowLeft,
  Users,
  Clock,
  Lock,
  ShieldCheck,
  Crown,
  User,
  DollarSign,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react-native";

export default function DealCampaignsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { dealId, campaignId, installerId: paramInstallerId } = params;
  const { currentUser } = useAppContext();

  // ✅ Fallback: use param installerId, or current user
  const installerId = paramInstallerId || currentUser?.id;

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("all");

  // ============================================================
  // LOAD CAMPAIGNS
  // ============================================================
  const loadCampaigns = async () => {
    try {
      setLoading(true);

      const selectQuery = `
        *,
        deal:deal_type_id (
          id,
          title,
          image_url,
          needed_neighbors,
          discounted_price,
          regular_price
        ),
        organizer:organizer_id (
          id,
          name,
          profile_picture,
          phone
        ),
        members:campaign_members (
          id,
          campaign_id,
          member_id,
          status,
          joined_at,
          paid_at,
          user:member_id (
            id,
            name,
            profile_picture
          )
        )
      `;

      // CASE 1: Specific campaign
      if (campaignId) {
        const { data, error } = await supabase
          .from("campaigns")
          .select(selectQuery)
          .eq("id", campaignId)
          .maybeSingle();

        if (error) throw error;
        setCampaigns(data ? [data] : []);
        return;
      }

      // CASE 2: Campaigns for a specific deal
      if (dealId) {
        const { data, error } = await supabase
          .from("campaigns")
          .select(selectQuery)
          .eq("deal_type_id", dealId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCampaigns(data || []);
        return;
      }

      // CASE 3: ALL campaigns for the installer
      if (installerId) {
        console.log(
          "🔄 DealCampaigns: Loading ALL campaigns for installer:",
          installerId,
        );
        const data =
          await installerService.getCampaignsForInstaller(installerId);
        setCampaigns(data || []);
        return;
      }

      setCampaigns([]);
    } catch (error) {
      console.error("❌ Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [dealId, campaignId, installerId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCampaigns();
    setRefreshing(false);
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const showConfirm = (title, message, onConfirm) => {
    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    } else {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "destructive", onPress: onConfirm },
      ]);
    }
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleConfirmPayment = (campaign) => {
    showConfirm(
      "Confirm Payment Received",
      `Have you verified in your bank account that the payment for "${campaign.deal?.title}" has been received?`,
      async () => {
        try {
          setProcessing(campaign.id);
          await installerService.confirmPaymentReceived(campaign.id);
          showAlert(
            "✅ Confirmed",
            "Payment confirmed. You can now proceed with installation.",
          );
          await loadCampaigns();
        } catch (error) {
          console.error("❌ Confirm payment error:", error);
          showAlert("Error", "Failed to confirm payment.");
        } finally {
          setProcessing(null);
        }
      },
    );
  };

  const handleCompleteInstallation = (campaign) => {
    showConfirm(
      "Mark Installation Completed",
      `Has the installation for "${campaign.deal?.title}" been fully completed? The organizer will be notified to approve.`,
      async () => {
        try {
          setProcessing(campaign.id);
          await installerService.markInstallationCompleted(campaign.id);
          showAlert(
            "🎉 Installation Marked",
            "The organizer will now review and approve the completion.",
          );
          await loadCampaigns();
        } catch (error) {
          console.error("❌ Complete installation error:", error);
          showAlert("Error", "Failed to mark installation complete.");
        } finally {
          setProcessing(null);
        }
      },
    );
  };

  // ============================================================
  // FILTER
  // ============================================================
  const filteredCampaigns = campaigns.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5C4A" />
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
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaigns</Text>
        <View style={styles.backButton} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "locked", label: "Awaiting Payment" },
          { id: "payment_confirmed", label: "Paid" },
          { id: "awaiting_approval", label: "Awaiting Approval" },
          { id: "completed", label: "Completed" },
        ].map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filter, filter === f.id && styles.filterActive]}
            onPress={() => setFilter(f.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.id && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredCampaigns.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Users size={48} color="#94A3B8" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No Campaigns</Text>
            <Text style={styles.emptySubtitle}>
              Nothing to show in this filter.
            </Text>
          </View>
        ) : (
          filteredCampaigns.map((campaign) => {
            const deal = campaign.deal || {};
            const organizer = campaign.organizer || {};
            const members = campaign.members || [];
            const paidCount = members.filter((m) => m.status === "paid").length;
            const isAllPaid =
              members.length > 0 && paidCount === members.length;
            const isLocked = campaign.status === "locked";
            const isPaymentConfirmed = campaign.status === "payment_confirmed";
            const isAwaitingApproval = campaign.status === "awaiting_approval";
            const isCompleted = campaign.status === "completed";
            const isProcessing = processing === campaign.id;

            return (
              <View key={campaign.id} style={styles.campaignCard}>
                {/* Header */}
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>
                    {deal.title || "Untitled Deal"}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted
                        ? styles.statusBadgeCompleted
                        : isAwaitingApproval
                          ? styles.statusBadgeAwaiting
                          : isPaymentConfirmed
                            ? styles.statusBadgePaid
                            : isLocked
                              ? styles.statusBadgeLocked
                              : styles.statusBadgeActive,
                    ]}
                  >
                    {isCompleted ? (
                      <CheckCircle
                        size={10}
                        color="#FFFFFF"
                        strokeWidth={2.5}
                      />
                    ) : isAwaitingApproval ? (
                      <ClockIcon size={10} color="#FFFFFF" strokeWidth={2.5} />
                    ) : isPaymentConfirmed ? (
                      <DollarSign size={10} color="#FFFFFF" strokeWidth={2.5} />
                    ) : isLocked ? (
                      <Lock size={10} color="#FFFFFF" strokeWidth={2.5} />
                    ) : (
                      <ShieldCheck
                        size={10}
                        color="#FFFFFF"
                        strokeWidth={2.5}
                      />
                    )}
                    <Text style={styles.statusText}>
                      {isCompleted
                        ? "Completed"
                        : isAwaitingApproval
                          ? "Awaiting Approval"
                          : isPaymentConfirmed
                            ? "Paid"
                            : isLocked
                              ? "Awaiting Payment"
                              : "Active"}
                    </Text>
                  </View>
                </View>

                {/* Price */}
                <View style={styles.priceRow}>
                  <Text style={styles.discountedPrice}>
                    {formatCurrency(deal.discounted_price || 0)}
                  </Text>
                  <Text style={styles.regularPrice}>
                    {formatCurrency(deal.regular_price || 0)}
                  </Text>
                </View>

                {/* Organizer */}
                <View style={styles.organizerRow}>
                  <View style={styles.organizerAvatar}>
                    <Text style={styles.organizerAvatarText}>
                      {organizer.name?.charAt(0) || "?"}
                    </Text>
                  </View>
                  <View style={styles.organizerInfo}>
                    <Text style={styles.organizerName}>
                      Led by {organizer.name || "Unknown"}
                    </Text>
                    <View style={styles.dateRow}>
                      <Clock size={11} color="#94A3B8" strokeWidth={2} />
                      <Text style={styles.dateText}>
                        Started {formatDate(campaign.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Users size={14} color="#64748B" strokeWidth={2} />
                    <Text style={styles.statText}>
                      {members.length}{" "}
                      {members.length === 1 ? "member" : "members"}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Crown size={14} color="#F59E0B" strokeWidth={2} />
                    <Text style={styles.statText}>
                      {paidCount}/{members.length} paid
                    </Text>
                  </View>
                </View>

                {/* Members List */}
                {(isLocked ||
                  isPaymentConfirmed ||
                  isAwaitingApproval ||
                  isCompleted) &&
                  members.length > 0 && (
                    <View style={styles.membersSection}>
                      <Text style={styles.membersSectionTitle}>
                        Members ({members.length})
                      </Text>
                      {members.slice(0, 3).map((member, idx) => (
                        <View key={idx} style={styles.memberItem}>
                          <View style={styles.memberAvatar}>
                            <User size={12} color="#64748B" strokeWidth={2} />
                          </View>
                          <Text style={styles.memberName}>
                            {member.user?.name || "Unknown"}
                          </Text>
                          <View
                            style={[
                              styles.payBadge,
                              member.status === "paid"
                                ? styles.payBadgePaid
                                : styles.payBadgePending,
                            ]}
                          >
                            <Text style={styles.payBadgeText}>
                              {member.status === "paid" ? "Paid" : "Pending"}
                            </Text>
                          </View>
                        </View>
                      ))}
                      {members.length > 3 && (
                        <Text style={styles.moreText}>
                          +{members.length - 3} more members
                        </Text>
                      )}
                    </View>
                  )}

                {/* ✅ Status: locked → Confirm Payment Received (only when all paid) */}
                {isLocked && isAllPaid && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.confirmPaymentButton,
                      isProcessing && styles.actionButtonDisabled,
                    ]}
                    onPress={() => handleConfirmPayment(campaign)}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <DollarSign
                          size={18}
                          color="#FFFFFF"
                          strokeWidth={2.5}
                        />
                        <Text style={styles.actionButtonText}>
                          Confirm Payment Received
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

                {/* ✅ Status: locked but NOT all paid → Waiting banner */}
                {isLocked && !isAllPaid && (
                  <View style={styles.pendingPaymentBanner}>
                    <ClockIcon size={16} color="#F59E0B" strokeWidth={2.5} />
                    <Text style={styles.pendingPaymentText}>
                      Waiting for all members to pay ({paidCount}/
                      {members.length})
                    </Text>
                  </View>
                )}

                {/* Status: payment_confirmed → Mark Installation Completed */}
                {isPaymentConfirmed && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.completeButton,
                      isProcessing && styles.actionButtonDisabled,
                    ]}
                    onPress={() => handleCompleteInstallation(campaign)}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <CheckCircle
                          size={18}
                          color="#FFFFFF"
                          strokeWidth={2.5}
                        />
                        <Text style={styles.actionButtonText}>
                          Mark Installation Completed
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

                {/* ✅ Status: awaiting_approval → Waiting banner (no action) */}
                {isAwaitingApproval && (
                  <View style={styles.awaitingBanner}>
                    <ClockIcon size={16} color="#F97316" strokeWidth={2.5} />
                    <Text style={styles.awaitingText}>
                      Waiting for organizer to approve completion
                    </Text>
                  </View>
                )}

                {/* Status: completed → Completed banner */}
                {isCompleted && (
                  <View style={styles.completedBanner}>
                    <CheckCircle size={16} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.completedText}>
                      Installation Completed
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
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
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  filter: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: "#F1F5F9",
  },
  filterActive: { backgroundColor: "#1A5C4A" },
  filterText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  filterTextActive: { color: "#FFFFFF" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 16 },
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  campaignTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  statusBadgeActive: { backgroundColor: "#10B981" },
  statusBadgeLocked: { backgroundColor: "#F59E0B" },
  statusBadgePaid: { backgroundColor: "#3B82F6" },
  statusBadgeAwaiting: { backgroundColor: "#F97316" },
  statusBadgeCompleted: { backgroundColor: "#1A5C4A" },
  statusText: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1A5C4A",
  },
  regularPrice: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 10,
  },
  organizerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A5C4A",
    justifyContent: "center",
    alignItems: "center",
  },
  organizerAvatarText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  organizerInfo: { flex: 1 },
  organizerName: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  membersSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 8,
  },
  membersSectionTitle: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: "#64748B",
    marginBottom: 4,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  memberName: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: "#1E293B",
    flex: 1,
  },
  payBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  payBadgePaid: { backgroundColor: "#10B981" },
  payBadgePending: { backgroundColor: "#F59E0B" },
  payBadgeText: {
    fontSize: 9,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  moreText: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
    color: "#64748B",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 20,
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
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 14,
    ...SHADOWS.button,
  },
  actionButtonDisabled: { backgroundColor: "#94A3B8" },
  confirmPaymentButton: { backgroundColor: "#3B82F6" },
  completeButton: { backgroundColor: "#1A5C4A" },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  completedText: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "#10B981",
  },
  awaitingBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF7ED",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#F97316",
  },
  awaitingText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "#F97316",
    textAlign: "center",
  },
  // ✅ NEW: Pending payment banner (locked but not all paid)
  pendingPaymentBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  pendingPaymentText: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "#F59E0B",
  },
});
