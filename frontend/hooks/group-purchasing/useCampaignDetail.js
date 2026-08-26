// hooks/features/group-purchasing/useCampaignDetail.js

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useCampaigns } from "./useCampaigns";
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
    campaigns,
    campaignMembers,
    confirmGroup, // ✅ ADD THIS
    markPaymentStatus, // ✅ ADD THIS
  } = useCampaigns();

  const [campaign, setCampaign] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [optimisticMemberAdded, setOptimisticMemberAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load campaign data
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true);
        console.log("🔄 useCampaignDetail: Loading campaign:", campaignId);
        const data = await getCampaignWithDetails(campaignId);
        console.log("📦 useCampaignDetail: Campaign data:", data);
        setCampaign(data);
        setOptimisticMemberAdded(false);
      } catch (error) {
        console.error("❌ Error loading campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCampaign();
  }, [campaignId, campaigns, campaignMembers]);

  // ✅ FIXED: handleJoin with async/await and data refresh
  const handleJoin = () => {
    if (!campaign) return;

    // Check if user is already a member
    const alreadyJoined = campaign.members?.some(
      (member) => member.user?.id === currentUser?.id,
    );

    if (alreadyJoined) {
      Alert.alert("Already Joined", "You have already joined this campaign!");
      return;
    }

    // Check if campaign is full
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
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Join!",
          onPress: async () => {
            setIsJoining(true);

            try {
              // ✅ Call joinCampaign and wait for it to complete
              const result = await joinCampaign(campaign.id);
              if (!result?.success) {
                throw new Error("The campaign join did not complete");
              }
              console.log("✅ Successfully joined campaign");

              // ✅ Update local state optimistically
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

              // ✅ Refresh campaign data from database to get accurate counts
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
                    onPress: () => router.push("/(tabs)/campaigns"),
                  },
                  {
                    text: "Stay Here",
                    style: "cancel",
                  },
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

  const handleBack = () => router.back();

  // Compute values from campaign data
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
    confirmGroup, // ✅ ADD THIS
    markPaymentStatus, // ✅ ADD THIS
  };
};
