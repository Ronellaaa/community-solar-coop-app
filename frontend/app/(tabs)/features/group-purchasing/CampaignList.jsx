// app/(tabs)/features/group-purchasing/CampaignList.jsx

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CampaignCard } from "../../../../components/group-purchasing/CampaignCard";
import { LeadCampaignModal } from "../../../../components/group-purchasing/LeadCampaignModal";
import { useCampaignList } from "../../../../hooks/group-purchasing/useCampaignList";
import { useCampaigns } from "../../../../hooks/group-purchasing/useCampaigns";
import { formatCurrency } from "../../../utils/group-purchasing";
import { SHADOWS } from "../../../utils/group-purchasing/shadows";

// 🚀 ICON IMPORTS
import { ArrowLeft, Crown, Plus, Users, UserCheck } from "lucide-react-native";

export default function CampaignList() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dealId = params.dealId;

  const {
    deal,
    installer,
    campaigns,
    loading,
    currentUser,
    userIsLeading,
    showLeadModal,
    isCreating,
    handleJoinCampaign,
    handleLeadCampaign,
    confirmLeadCampaign,
    handleBack,
    closeModal,
  } = useCampaignList(dealId);

  const { getCampaignStatus } = useCampaigns();

  const [campaignsWithStatus, setCampaignsWithStatus] = useState([]);

  useEffect(() => {
    const loadCampaignStatuses = async () => {
      if (!campaigns || campaigns.length === 0) {
        setCampaignsWithStatus([]);
        return;
      }

      const statuses = await Promise.all(
        campaigns.map(async (campaign) => {
          const statusMeta = await getCampaignStatus(campaign.id);
          return { ...campaign, statusMeta };
        }),
      );
      setCampaignsWithStatus(statuses);
    };
    loadCampaignStatuses();
  }, [campaigns]);

  // ✅ Handler for viewing campaign (both organizer and member)
  const handleViewCampaign = (campaignId) => {
    console.log("👀 Viewing campaign:", campaignId);
    router.push({
      pathname: "./CampaignDetail",
      params: { campaignId },
    });
  };

  // ✅ Check if current user is a member of the campaign
  const isUserMember = (campaign) => {
    return (
      campaign.members?.some((member) => member.user?.id === currentUser?.id) ||
      false
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!deal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Deal not found</Text>
      </View>
    );
  }

  // Use snake_case properties from Supabase
  const regularPrice = deal?.regular_price ?? deal?.regularPrice ?? 0;
  const discountedPrice = deal?.discounted_price ?? deal?.discountedPrice ?? 0;
  const neededNeighbors = deal?.needed_neighbors ?? deal?.neededNeighbors ?? 5;
  const dealTitle = deal?.title || "Untitled Deal";
  const installerName = installer?.name || "Unknown";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ArrowLeft size={20} color="#1A5C4A" strokeWidth={2.5} />
        <Text style={styles.backButtonText}>Back to Deals</Text>
      </TouchableOpacity>

      {/* Deal Header */}
      <View style={styles.dealHeader}>
        <Text style={styles.dealTitle}>{dealTitle}</Text>
        <Text style={styles.installerName}>By {installerName}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.discountedPrice}>
            {formatCurrency(discountedPrice)}
          </Text>
          <Text style={styles.regularPrice}>
            {formatCurrency(regularPrice)}
          </Text>
        </View>
        <View style={styles.neighborsContainer}>
          <Users size={16} color="#B8D4C8" strokeWidth={2} />
          <Text style={styles.neighborsText}>
            Need {neededNeighbors} neighbors to trigger the deal
          </Text>
        </View>
      </View>

      {/* Campaigns Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Campaigns</Text>
        <Text style={styles.sectionCount}>{campaigns.length} campaigns</Text>
      </View>

      {campaigns.length === 0 ? (
        <View style={styles.emptyState}>
          <Crown size={48} color="#94A3B8" strokeWidth={1.5} />
          <Text style={styles.emptyStateTitle}>No campaigns yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Be the first to lead a campaign for this deal!
          </Text>
          {!userIsLeading && (
            <TouchableOpacity
              style={styles.leadButton}
              onPress={handleLeadCampaign}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.leadButtonText}>Lead This Campaign</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {campaignsWithStatus.map((campaign) => {
            const statusMeta = campaign.statusMeta;
            if (!statusMeta) return null;

            const isUserOrganizer = campaign.organizer_id === currentUser?.id;
            const isUserJustMember = isUserMember(campaign) && !isUserOrganizer;

            return (
              <View key={campaign.id} style={styles.campaignCardWrapper}>
                {/* ✅ Badge for organizer */}
                {isUserOrganizer && (
                  <View style={styles.organizerBadge}>
                    <Crown size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.organizerBadgeText}>
                      You are leading this
                    </Text>
                  </View>
                )}
                {/* ✅ Badge for member */}
                {isUserJustMember && (
                  <View style={styles.memberBadge}>
                    <UserCheck size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.memberBadgeText}>You are a member</Text>
                  </View>
                )}

                <CampaignCard
                  campaign={campaign}
                  progress={statusMeta.progress}
                  isFull={statusMeta.isFull}
                  onJoin={handleJoinCampaign}
                  onView={handleViewCampaign}
                  isOrganizer={isUserOrganizer}
                  isMember={isUserJustMember || isUserOrganizer}
                />
              </View>
            );
          })}

          {!userIsLeading && (
            <TouchableOpacity
              style={styles.leadButton}
              onPress={handleLeadCampaign}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.leadButtonText}>Lead Your Own Campaign</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Lead Campaign Modal */}
      <LeadCampaignModal
        visible={showLeadModal}
        dealTitle={dealTitle}
        isCreating={isCreating}
        onConfirm={confirmLeadCampaign}
        onCancel={closeModal}
      />

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
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#1A5C4A",
    letterSpacing: 0.3,
  },
  dealHeader: {
    backgroundColor: "#1A5C4A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...SHADOWS.button,
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  installerName: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#B8D4C8",
    marginTop: 2,
    fontWeight: "400",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  regularPrice: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#94B0A3",
    textDecorationLine: "line-through",
    marginLeft: 12,
    fontWeight: "500",
  },
  neighborsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },
  neighborsText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#B8D4C8",
    fontWeight: "400",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },
  campaignCardWrapper: {
    marginBottom: 16,
  },
  organizerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A5C4A",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  organizerBadgeText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  // ✅ NEW: Member badge style
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6", // Blue
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  memberBadgeText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  leadButton: {
    backgroundColor: "#1A5C4A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 100,
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
    ...SHADOWS.button,
  },
  leadButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F1F5F9",
    borderStyle: "dashed",
    ...SHADOWS.light,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    ...SHADOWS.card,
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  modalIcon: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  modalDealTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1A5C4A",
    textAlign: "center",
    marginTop: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },
  modalResponsibilityTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
    marginBottom: 8,
  },
  responsibilityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  responsibilityText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#475569",
  },
  modalWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 12,
  },
  modalWarningText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#F59E0B",
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  modalConfirmButton: {
    flex: 2,
    backgroundColor: "#1A5C4A",
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  modalConfirmDisabled: {
    backgroundColor: "#94A3B8",
  },
  modalConfirmText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  bottomPadding: {
    height: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#EF4444",
    textAlign: "center",
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
  },
});
