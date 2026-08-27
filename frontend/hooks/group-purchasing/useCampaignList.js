// hooks/features/group-purchasing/useCampaignList.js

import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Alert, Platform } from "react-native";
import { useCampaigns } from "./useCampaigns";
import { useDeals } from "./useDeals";
import { formatCurrency } from "../../app/utils/group-purchasing";

export const useCampaignList = (dealId) => {
  const router = useRouter();
  const { getDealWithInstaller } = useDeals();
  const {
    getCampaignsForDealWithDetails,
    getCampaignStatus,
    joinCampaign,
    createCampaign,
    currentUser,
  } = useCampaigns();

  const [deal, setDeal] = useState(null);
  const [installer, setInstaller] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Reload whenever this screen becomes active so changes made in another
  // screen are reflected when the user returns to the deal.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          setLoading(true);
          console.log("🔄 Loading campaign list for deal:", dealId);

          const dealData = await getDealWithInstaller(dealId);
          console.log("📦 Deal data:", dealData);

          const campaignsData = await getCampaignsForDealWithDetails(dealId);
          console.log("📦 Campaigns data:", campaignsData);

          if (isActive) {
            setDeal(dealData?.deal || null);
            setInstaller(dealData?.installer || null);
            setCampaigns(campaignsData || []);
          }
        } catch (error) {
          console.error("❌ Error loading data:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [dealId]),
  );

  // ✅ FIX: Use organizer_id (snake_case) from database
  const userIsLeading = campaigns.some(
    (c) => c.organizer_id === currentUser?.id,
  );

  const handleJoinCampaign = async (selectedCampaign) => {
    console.log("🔵 handleJoinCampaign called:", selectedCampaign?.id);

    if (!selectedCampaign?.id) {
      console.error(
        "❌ Join pressed without a valid campaign:",
        selectedCampaign,
      );
      Alert.alert("Error", "This campaign could not be identified.");
      return;
    }

    const campaignId = selectedCampaign.id;

    const discountedPrice =
      selectedCampaign.deal?.discounted_price ||
      selectedCampaign.deal?.discountedPrice ||
      0;

    const joinCampaignAfterConfirmation = async () => {
      try {
        console.log("🔄 Confirmed join; calling joinCampaign:", campaignId);
        const result = await joinCampaign(campaignId);
        console.log("✅ Join completed from campaign list:", result);
        router.push({
          pathname: "/(tabs)/features/group-purchasing/CampaignDetail",
          params: { campaignId },
        });
      } catch (error) {
        console.error("❌ Failed to join campaign from list:", error);
        Alert.alert(
          "Error",
          error?.message || "Failed to join campaign. Please try again.",
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to join this campaign for ${formatCurrency(
          discountedPrice,
        )}?`,
      );

      if (confirmed) {
        await joinCampaignAfterConfirmation();
      }
      return;
    }

    Alert.alert(
      "Reserve Your Spot",
      `Are you sure you want to join this campaign for ${formatCurrency(
        discountedPrice,
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Join!",
          onPress: joinCampaignAfterConfirmation,
        },
      ],
    );
  };

  const handleLeadCampaign = () => {
    if (!deal) return;
    setShowLeadModal(true);
  };

  // ✅ FIXED: Extract campaign ID from returned object
  const confirmLeadCampaign = async () => {
    if (!deal || !currentUser) return;

    setIsCreating(true);

    try {
      const deadlineDays = deal.deadline_days || deal.deadlineDays || 14;

      const newCampaign = await createCampaign({
        dealTypeId: deal.id,
        organizerId: currentUser.id,
        deadline: new Date(
          Date.now() + deadlineDays * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      setShowLeadModal(false);
      setIsCreating(false);

      // ✅ FIX: Extract id from the campaign object
      const campaignId = newCampaign?.id || newCampaign;

      router.push({
        pathname: "/(tabs)/features/group-purchasing/CampaignDetail",
        params: { campaignId: campaignId },
      });
    } catch (error) {
      console.error("❌ Failed to create campaign:", error);
      Alert.alert("Error", "Failed to create campaign. Please try again.");
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    router.replace("/(tabs)/deals");
  };

  const closeModal = () => {
    setShowLeadModal(false);
  };

  return {
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
  };
};
