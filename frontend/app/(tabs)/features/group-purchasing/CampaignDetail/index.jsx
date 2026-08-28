// app/(tabs)/features/group-purchasing/CampaignDetail/index.jsx

import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCampaignDetail } from "../../../../../hooks/group-purchasing/useCampaignDetail";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";
import { formatDate, formatCurrency } from "../../../../utils/group-purchasing";

// Icons
import {
  ArrowLeft,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  ThumbsUp,
  User,
  Users,
  Crown,
  Send,
  LogOut,
} from "lucide-react-native";
import { campaignDetailStyles as styles } from "./CampaignDetail.styles";

export default function CampaignDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const campaignId = params.campaignId;

  const {
    campaign,
    currentUser,
    isUserMember,
    hasJoined,
    isJoining,
    optimisticMemberAdded,
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
    deleteCampaign,
    leaveCampaign,
  } = useCampaignDetail(campaignId);

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Campaign not found</Text>
      </View>
    );
  }

  // ✅ Check if current user is the organizer
  const isOrganizer = campaign.organizer?.id === currentUser?.id;

  // ✅ Data comes as campaign.deal (not campaign.dealType)
  const deal = campaign.deal || {};
  const installer = deal.installer || {};
  const organizer = campaign.organizer || {};

  // ✅ Get the image URL from the deal
  const imageUrl = deal?.image_url ?? deal?.imageUrl ?? null;

  // ✅ Ensure members is an array
  const members = campaign.members || [];
  const memberCount = members.length;

  // ✅ Get organizer name safely
  const organizerName = organizer.name || "Unknown";
  const organizerInitial = organizerName?.charAt(0) || "?";

  // ✅ Get dates safely
  const createdAt = campaign.created_at || campaign.createdAt;

  // ✅ Get current members count
  const currentMembers =
    campaign.current_members || campaign.currentMembers || 0;

  // ✅ Get deal prices (snake_case from database)
  const discountedPrice = deal.discounted_price || deal.discountedPrice || 0;
  const regularPrice = deal.regular_price || deal.regularPrice || 0;

  // ✅ Check if only organizer is in the campaign
  const isOnlyOrganizer = isOrganizer && memberCount === 1;

  // ✅ Check if campaign is locked
  const isLocked = campaign.status === "locked";

  // ✅ Helper: Show confirmation dialog (works on web and mobile)
  const showConfirm = (title, message, onConfirm, onCancel) => {
    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    } else {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel", onPress: onCancel },
        {
          text: "Confirm",
          style: "destructive",
          onPress: onConfirm,
        },
      ]);
    }
  };

  // ✅ Handler: Leave campaign (for organizer when only member)
  const handleOrganizerLeaveCampaign = () => {
    showConfirm(
      "Delete Campaign",
      "You are the only member in this campaign. If you leave, the campaign will be permanently deleted.\n\nAre you sure you want to continue?",
      async () => {
        try {
          await deleteCampaign(campaignId, currentUser?.id);
          if (Platform.OS === "web") {
            alert("✅ Campaign deleted successfully!");
          } else {
            Alert.alert(
              "✅ Campaign Deleted",
              "Your campaign has been successfully deleted.",
            );
          }
          router.replace("/(tabs)/CampaignProfile");
        } catch (error) {
          console.error("❌ Error deleting campaign:", error);
          if (Platform.OS === "web") {
            alert("Failed to delete campaign. Please try again.");
          } else {
            Alert.alert(
              "Error",
              "Failed to delete campaign. Please try again.",
            );
          }
        }
      },
    );
  };

  // ✅ NEW: Handler: Leave campaign (for regular members)
  const handleMemberLeaveCampaign = () => {
    showConfirm(
      "Leave Campaign",
      "Are you sure you want to leave this campaign?\n\nYou will lose your spot and will need to rejoin if you change your mind.",
      async () => {
        try {
          await leaveCampaign(campaignId, currentUser?.id);
          if (Platform.OS === "web") {
            alert("✅ You have left the campaign!");
          } else {
            Alert.alert(
              "✅ Left Campaign",
              "You have successfully left the campaign.",
            );
          }
          router.replace("/(tabs)/CampaignProfile");
        } catch (error) {
          console.error("❌ Error leaving campaign:", error);
          if (Platform.OS === "web") {
            alert("Failed to leave campaign. Please try again.");
          } else {
            Alert.alert("Error", "Failed to leave campaign. Please try again.");
          }
        }
      },
    );
  };

  // ✅ Helper: Show alert (works on web and mobile)
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // ✅ Handler: Mark member as paid
  const handleMarkPaid = async (memberId) => {
    showConfirm(
      "Mark as Paid",
      "Are you sure you want to mark this member as paid?",
      async () => {
        try {
          await markPaymentStatus(campaignId, memberId, "paid");
          showAlert("✅ Success", "Member marked as paid!");
        } catch (error) {
          showAlert("Error", "Failed to mark payment status.");
        }
      },
    );
  };

  // ✅ Handler: Confirm group
  const handleConfirmGroup = async () => {
    // Check if all members have paid
    const allPaid = members.every((member) => member.status === "paid");
    if (!allPaid) {
      showAlert(
        "⚠️ Not Ready",
        "All members must pay before confirming the group.",
      );
      return;
    }

    showConfirm(
      "Confirm Group",
      "Are you ready to lock this campaign and notify the installer?",
      async () => {
        try {
          await confirmGroup(campaignId);
          showAlert(
            "🎉 Success",
            "Campaign confirmed! Installer has been notified.",
          );
        } catch (error) {
          showAlert("Error", "Failed to confirm group.");
        }
      },
    );
  };

  // ✅ Handler: Share campaign
  const handleShare = () => {
    showAlert("Share", "Share this campaign with your neighbors!");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Image with Overlay Buttons */}
      <View style={styles.heroContainer}>
        <View style={styles.heroActions}>
          <TouchableOpacity onPress={handleBack} style={styles.circleButton}>
            <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleButton} onPress={handleShare}>
            <Share2 size={20} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <Sun size={80} color="#F97316" strokeWidth={1.5} />
          )}
          <View style={styles.verifiedOverlay}>
            <ShieldCheck size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.verifiedText}>Verified Deal</Text>
          </View>
        </View>
      </View>

      {/* Deal Info */}
      <View style={styles.card}>
        <View style={styles.dealHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dealTitle}>
              {deal.title || "Untitled Deal"}
            </Text>
            <View style={styles.installerRow}>
              <User size={14} color="#64748B" strokeWidth={2} />
              <Text style={styles.installerName}>
                By {installer.name || "Unknown Installer"}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>
              {formatCurrency(discountedPrice)}
            </Text>
            <Text style={styles.priceSubtext}>Group Price</Text>
          </View>
        </View>

        <View style={styles.regularPriceRow}>
          <Text style={styles.regularPriceLabel}>Regular Price</Text>
          <Text style={styles.regularPrice}>
            {formatCurrency(regularPrice)}
          </Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.card}>
        <View style={styles.progressHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Users size={18} color="#1E293B" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Campaign Progress</Text>
          </View>
          <View style={styles.progressCountContainer}>
            <Text style={styles.progressCount}>
              {currentMembers} / {target}
            </Text>
            <Text style={styles.progressLabel}>spots</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` },
              ]}
            />
          </View>
        </View>

        {!isFull && (
          <View style={styles.neededContainer}>
            <Clock size={16} color="#64748B" strokeWidth={2} />
            <Text style={styles.neededText}>
              {membersNeeded} more{" "}
              {membersNeeded === 1 ? "reservation" : "reservations"} needed
            </Text>
          </View>
        )}
        {isFull && (
          <View style={styles.fullTextContainer}>
            <Sparkles size={16} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.fullText}>Deal is ready to lock!</Text>
          </View>
        )}
      </View>

      {/* Organizer Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Campaign Organizer</Text>
        <View style={styles.organizerRow}>
          <View style={styles.organizerAvatar}>
            <Text style={styles.organizerAvatarText}>{organizerInitial}</Text>
          </View>
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerName}>{organizerName}</Text>
            <View style={styles.organizerDateRow}>
              <Calendar size={13} color="#94A3B8" strokeWidth={2} />
              <Text style={styles.organizerDate}>
                Started {formatDate(createdAt)}
              </Text>
            </View>
          </View>
          {/* ✅ Hide Message Button for Organizer */}
          {!isOrganizer && (
            <TouchableOpacity style={styles.messageButton}>
              <MessageCircle size={18} color="#64748B" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Members List */}
      <View style={styles.card}>
        <View style={styles.membersHeader}>
          <View style={styles.sectionTitleRow}>
            <Users size={18} color="#1E293B" strokeWidth={2} />
            <Text style={styles.sectionTitle}>
              Joined Neighbors ({memberCount})
            </Text>
          </View>
          <ThumbsUp size={16} color="#94A3B8" strokeWidth={2} />
        </View>

        {memberCount === 0 ? (
          <View style={styles.emptyStateContainer}>
            <User size={32} color="#94A3B8" strokeWidth={1.5} />
            <Text style={styles.emptyMembersText}>
              No one has joined yet. Be the first!
            </Text>
          </View>
        ) : (
          members.map((member, index) => {
            const isCurrentUser = member.user?.id === currentUser?.id;
            const isOrganizerUser = member.user?.id === campaign.organizer?.id;

            return (
              <View
                key={isCurrentUser ? "current-user" : index}
                style={[
                  styles.memberRow,
                  isCurrentUser && styles.currentUserRow,
                  isCurrentUser && optimisticMemberAdded && styles.newMemberRow,
                ]}
              >
                <View
                  style={[
                    styles.memberAvatar,
                    isCurrentUser && styles.currentUserAvatar,
                  ]}
                >
                  <Text
                    style={[
                      styles.memberAvatarText,
                      isCurrentUser && styles.currentUserAvatarText,
                    ]}
                  >
                    {member.user?.name?.charAt(0) || "?"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.memberName,
                    isCurrentUser && styles.currentUserName,
                  ]}
                >
                  {member.user?.name}
                </Text>

                {isOrganizerUser && (
                  <View style={styles.organizerBadge}>
                    <Crown size={12} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.organizerBadgeText}>Organizer</Text>
                  </View>
                )}

                {isCurrentUser && (
                  <View style={styles.youBadge}>
                    <User size={10} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.youBadgeText}>You</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.memberStatusBadge,
                    {
                      backgroundColor:
                        member.status === "paid" ? "#10B981" : "#F59E0B",
                    },
                  ]}
                >
                  <Text style={styles.memberStatusText}>
                    {member.status === "paid" ? "Paid" : "Pending"}
                  </Text>
                </View>

                {/* ✅ Organizer-only action: Mark as Paid */}
                {isOrganizer &&
                  member.status === "pending" &&
                  !isCurrentUser && (
                    <TouchableOpacity
                      style={styles.markPaidButton}
                      onPress={() => handleMarkPaid(member.user?.id)}
                    >
                      <CheckCircle2
                        size={14}
                        color="#FFFFFF"
                        strokeWidth={2.5}
                      />
                      <Text style={styles.markPaidText}>Mark Paid</Text>
                    </TouchableOpacity>
                  )}
              </View>
            );
          })
        )}
      </View>

      {/* ✅ Organizer-Only Section */}
      {isOrganizer && (
        <View style={styles.card}>
          <View style={styles.organizerSectionHeader}>
            <Crown size={20} color="#1A5C4A" strokeWidth={2} />
            <Text style={styles.organizerSectionTitle}>Organizer Actions</Text>
          </View>

          {/* ✅ Leave Campaign Button (only when organizer is the only member) */}
          {isOnlyOrganizer ? (
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleOrganizerLeaveCampaign}
            >
              <LogOut size={20} color="#EF4444" strokeWidth={2} />
              <Text style={styles.leaveButtonText}>
                Leave & Delete Campaign
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Confirm Group Button */}
              {isFull ? (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmGroup}
                >
                  <Sparkles size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.confirmButtonText}>
                    📦 Confirm Group & Notify Installer
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.confirmDisabledContainer}>
                  <Text style={styles.confirmDisabledText}>
                    ⏳ Need {membersNeeded} more member
                    {membersNeeded > 1 ? "s" : ""} to confirm
                  </Text>
                </View>
              )}

              {/* Share Campaign Button */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
              >
                <Send size={18} color="#1A5C4A" strokeWidth={2} />
                <Text style={styles.shareButtonText}>Share Campaign</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ✅ NEW: Member Leave Campaign Section */}
      {isUserMember && !isOrganizer && !isLocked && (
        <View style={styles.card}>
          <View style={styles.memberSectionHeader}>
            <User size={20} color="#EF4444" strokeWidth={2} />
            <Text style={styles.memberSectionTitle}>Member Actions</Text>
          </View>

          <TouchableOpacity
            style={styles.memberLeaveButton}
            onPress={handleMemberLeaveCampaign}
          >
            <LogOut size={20} color="#EF4444" strokeWidth={2} />
            <Text style={styles.memberLeaveButtonText}>Leave Campaign</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Join Button */}
      {isUserMember || hasJoined ? (
        <View style={styles.alreadyJoinedContainer}>
          <CheckCircle2 size={20} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.alreadyJoinedText}>
            You have joined this campaign!
          </Text>
        </View>
      ) : !isFull ? (
        <TouchableOpacity
          style={[styles.joinButton, isJoining && styles.joinButtonDisabled]}
          onPress={handleJoin}
          disabled={isJoining}
        >
          <Banknote size={22} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.joinButtonText}>
            {isJoining ? "Joining..." : "Reserve My Spot"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.joinButtonDisabled} disabled>
          <FileText size={22} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.joinButtonText}>Join Waitlist</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
