// hooks/features/group-purchasing/useCampaignDetail.js

import { useCallback, useRef, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Alert } from "react-native";
import { useCampaigns } from "./useCampaigns";
import { installerService } from "../../services/group-purchasing/installerService";
import {
  calculateProgress,
  formatCurrency,
  getMembersNeeded,
  getStatusColor,
  getStatusLabel,
  isCampaignFull,
} from "../../app/utils/group-purchasing";

export const useCampaignDetail = (campaignId) => {
  const router = useRouter();
  const {
    getCampaignWithDetails,
    joinCampaign,
    currentUser,
    confirmGroup,
    markPaymentStatus,
    leaveCampaign,
    deleteCampaign,
    approveCompletion, // ✅ ADDED
  } = useCampaigns();
  const getCampaignWithDetailsRef = useRef(getCampaignWithDetails);
  getCampaignWithDetailsRef.current = getCampaignWithDetails;

  const [campaign, setCampaign] = useState(null);
  const [installerBankDetails, setInstallerBankDetails] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [optimisticMemberAdded, setOptimisticMemberAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCampaign = useCallback(async () => {
    if (!campaignId) return;

    try {
    setLoading(true);
    console.log("🔄 useCampaignDetail: Loading campaign:", campaignId);
    const data = await getCampaignWithDetailsRef.current(campaignId);
    console.log("📦 useCampaignDetail: Campaign data:", data);

    if (!data) {
      console.log("⚠️ Campaign not found, redirecting...");
      router.replace("/(tabs)/CampaignProfile");
      return;
    }

    setCampaign(data);
    setOptimisticMemberAdded(false);

      const installerId = data?.deal?.installer?.id;
      if (installerId) {
        const bankData = await installerService.getBankDetails(installerId);
        setInstallerBankDetails(bankData);
        console.log("🏦 Bank details loaded:", !!bankData);
      }
    } catch (error) {
      console.error("❌ Error loading campaign:", error);
    } finally {
      setLoading(false);
    }
  }, [campaignId, router]);

  const refreshCampaign = useCallback(async () => {
    console.log("🔄 Refreshing campaign data...");
    await loadCampaign();
    console.log("✅ Campaign refreshed");
  }, [loadCampaign]);

  useFocusEffect(
    useCallback(() => {
    loadCampaign();
    }, [loadCampaign]),
  );

  // ✅ FIXED: handleJoin with async/await and data refresh
  const handleJoin = () => {
    if (!campaign) return;

    const alreadyJoined = campaign.members?.some(
      (member) => member.user?.id === currentUser?.id,
    );

    if (alreadyJoined) {
      Alert.alert("Already Joined", "You have already joined this campaign!");
      return;
    }

    const target = campaign.deal?.needed_neighbors || 5;
    const currentMembers = campaign.current_members || 0;
    if (currentMembers >= target) {
      Alert.alert(
        "Campaign Full",
        "This campaign has reached its maximum number of members!",
      );
      return;
    }

    const discountedPrice =
      campaign.deal?.discounted_price || campaign.deal?.discountedPrice || 0;

    Alert.alert(
      "Reserve Your Spot",
      `Are you sure you want to join this campaign for ${formatCurrency(
        discountedPrice,
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Join!",
          onPress: async () => {
            setIsJoining(true);

            try {
              const result = await joinCampaign(campaign.id);
              if (!result?.success) {
                throw new Error("The campaign join did not complete");
              }
              console.log("✅ Successfully joined campaign");

              if (currentUser) {
                const optimisticMember = {
                  user: currentUser,
                  status: "pending",
                  campaignId: campaign.id,
                  memberId: currentUser.id,
                  joinedAt: new Date().toISOString(),
                };

                setCampaign({
                  ...campaign,
                  members: [...(campaign.members || []), optimisticMember],
                  current_members: (campaign.current_members || 0) + 1,
                });
                setOptimisticMemberAdded(true);
              }

              setHasJoined(true);
              setIsJoining(false);

              const refreshedCampaign = await getCampaignWithDetails(
                campaign.id,
              );
              if (refreshedCampaign) {
                setCampaign(refreshedCampaign);
              }

              Alert.alert(
                "🎉 Success!",
                "You have successfully joined the campaign!",
                [
                  {
                    text: "View My Campaigns",
                    onPress: () => router.push("/(tabs)/CampaignProfile"),
                  },
                  { text: "Stay Here", style: "cancel" },
                ],
              );
            } catch (error) {
              console.error("❌ Error joining campaign:", error);
              Alert.alert(
                "Error",
                error?.message || "Failed to join campaign. Please try again.",
              );
              setIsJoining(false);
            }
          },
        },
      ],
    );
  };

  // ✅ Handle leaving campaign (for organizer when only member)
  const handleLeaveCampaign = async (campaignId, userId) => {
    try {
      const result = await leaveCampaign(campaignId, userId);
      return result;
    } catch (error) {
      console.error("❌ Error leaving campaign:", error);
      throw error;
    }
  };

  const handleDeleteCampaign = async (campaignId, userId) => {
    try {
      const result = await deleteCampaign(campaignId, userId);
      return result;
    } catch (error) {
      console.error("❌ Error deleting campaign:", error);
      throw error;
    }
  };

  // ✅ UPDATED: Handle organizer's approval of completion
  // Now uses `approveCompletion` from useCampaigns() (which routes
  // through AppContext → campaignService) instead of installerService
  const handleApproveCompletion = async (campaignId) => {
    try {
      console.log(
        "🔄 useCampaignDetail: Approving completion for:",
        campaignId,
      );
      const result = await approveCompletion(campaignId);
      console.log("✅ useCampaignDetail: Completion approved");
      return result;
    } catch (error) {
      console.error("❌ Error approving completion:", error);
      throw error;
    }
  };

  const handleBack = () => {
    if (campaign?.deal_type_id) {
      router.replace({
        pathname: "/(tabs)/features/group-purchasing/CampaignList",
        params: { dealId: campaign.deal_type_id },
      });
      return;
    }

    router.replace("/(tabs)/deals");
  };

  // Compute values
  const target = campaign?.deal?.needed_neighbors || 5;
  const currentMembers = campaign?.current_members || 0;
  const isFull = isCampaignFull(currentMembers, target);
  const progress = calculateProgress(currentMembers, target);
  const membersNeeded = getMembersNeeded(currentMembers, target);
  const statusColor = getStatusColor(campaign?.status || "active");
  const statusLabel = getStatusLabel(campaign?.status || "active");

  const isUserMember =
    campaign?.members?.some((member) => member.user?.id === currentUser?.id) ||
    false;

  return {
    campaign,
    currentUser,
    isUserMember,
    hasJoined,
    isJoining,
    optimisticMemberAdded,
    loading,
    target,
    isFull,
    progress,
    membersNeeded,
    statusColor,
    statusLabel,
    handleJoin,
    handleBack,
    confirmGroup,
    markPaymentStatus,
    leaveCampaign: handleLeaveCampaign,
    deleteCampaign: handleDeleteCampaign,
    refreshCampaign,
    installerBankDetails,
    approveCompletion: handleApproveCompletion,
  };
};
