// components/features/group-purchasing/CampaignCard.jsx

import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  getStatusColor,
  getStatusLabel,
  SHADOWS,
} from "../../app/utils/group-purchasing";

export const CampaignCard = ({
  campaign,
  progress,
  isFull,
  onJoin,
  onView,
  isOrganizer,
  isMember,
}) => {
  // ✅ FIX: Use snake_case properties from database
  const statusColor = getStatusColor(campaign?.status || "active");
  const statusLabel = getStatusLabel(campaign?.status || "active");

  // ✅ FIX: Use snake_case
  const target =
    campaign?.deal?.needed_neighbors ||
    campaign?.dealType?.neededNeighbors ||
    5;
  const currentMembers =
    campaign?.current_members || campaign?.currentMembers || 0;
  const campaignIsFull = currentMembers >= target;

  // ✅ FIX: organizer name
  const organizerName = campaign?.organizer?.name || "Unknown";
  const organizerInitial = organizerName?.charAt(0) || "?";

  // ✅ FIX: created_at
  const createdAt =
    campaign?.created_at || campaign?.createdAt || new Date().toISOString();
  const formattedDate = new Date(createdAt).toLocaleDateString();

  // ✅ Status checks
  const isLocked = campaign?.status === "locked";
  const isPaymentConfirmed = campaign?.status === "payment_confirmed";
  const isAwaitingApproval = campaign?.status === "awaiting_approval";
  const isCompleted = campaign?.status === "completed";

  // ✅ Combined: any non-active status
  const isInactive =
    isLocked || isPaymentConfirmed || isAwaitingApproval || isCompleted;

  const buttonDisabled = !isOrganizer && !isMember && isInactive;

  console.log("📌 CampaignCard rendered:", {
    campaignId: campaign?.id,
    status: campaign?.status,
    currentMembers,
    target,
    isFull: campaignIsFull,
    isOrganizer,
    isMember,
    buttonDisabled,
  });

  // ✅ Show appropriate button text based on user role
  const getButtonText = () => {
    // Organizer OR member → always "View Campaign"
    if (isOrganizer || isMember) return "View Campaign";

    // Non-members: locked / payment confirmed / awaiting / completed / full → "Campaign Locked"
    if (isInactive || campaignIsFull) return "Campaign Locked";

    // Active + not full → "Join Campaign"
    return "Join Campaign";
  };

  // ✅ Handle button press
  const handlePress = () => {
    console.log("🟢 Campaign button pressed:", {
      campaignId: campaign?.id,
      isFull: campaignIsFull,
      status: campaign?.status,
      isOrganizer,
      isMember,
    });

    // Organizer OR member → view campaign
    if (isOrganizer || isMember) {
      onView(campaign.id);
      return;
    }

    // Non-members + inactive → show alert (shouldn't happen since button disabled)
    if (isInactive) {
      Alert.alert("Campaign Locked", "This campaign is no longer active.");
      return;
    }

    // Non-members + full → show alert
    if (campaignIsFull) {
      Alert.alert(
        "Campaign Full",
        "This campaign has reached its member limit.",
      );
      return;
    }

    // Non-members + active + not full → join
    onJoin(campaign);
  };

  const getButtonStyle = () => {
    // Blue for organizer AND member
    if (isOrganizer || isMember) return styles.viewButton;

    // Orange locked style for inactive / full (non-members)
    if (isInactive || campaignIsFull) return styles.joinButtonLocked;

    // Green for active + not full (non-members)
    return styles.joinButton;
  };

  return (
    <View style={styles.campaignCard}>
      <View style={styles.organizerRow}>
        <View style={styles.organizerAvatar}>
          <Text style={styles.organizerAvatarText}>{organizerInitial}</Text>
        </View>
        <View style={styles.organizerInfo}>
          <Text style={styles.organizerName}>Led by {organizerName}</Text>
          <Text style={styles.organizerDate}>Started {formattedDate}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {currentMembers} / {target} spots filled
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={getButtonStyle()}
        onPress={handlePress}
        disabled={buttonDisabled}
      >
        <Text style={styles.joinButtonText}>{getButtonText()}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A5C4A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  organizerAvatarText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
  },
  organizerDate: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1A5C4A",
    borderRadius: 100,
  },
  joinButton: {
    backgroundColor: "#1A5C4A",
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: "center",
    ...SHADOWS.button,
  },
  viewButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: "center",
    ...SHADOWS.button,
  },
  joinButtonDisabled: {
    backgroundColor: "#94A3B8",
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: "center",
  },
  joinButtonLocked: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
