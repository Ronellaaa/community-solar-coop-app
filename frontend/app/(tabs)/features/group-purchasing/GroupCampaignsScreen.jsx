// app/(tabs)/groupcampaigns.jsx

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../../../../context/AppContext";
import { useCampaigns } from "../../../../hooks/group-purchasing/useCampaigns";
import { formatCurrency, formatDate } from "../../../utils/group-purchasing";
import { SHADOWS } from "../../../utils/group-purchasing/shadows";
import { ProfileAvatar } from "../../../../components/common";

// 🚀 ICON IMPORTS
import {
  Crown,
  Users,
  User,
  Calendar,
  TrendingUp,
  Eye,
  Plus,
} from "lucide-react-native";

export default function GroupCampaignsScreen() {
  const router = useRouter();
  const { currentUser, loading: contextLoading } = useAppContext();
  const { getCampaignsLedByUser, getCampaignsJoinedByUser } = useCampaigns();

  const [leadingCampaigns, setLeadingCampaigns] = useState([]);
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const [leading, joined] = await Promise.all([
        getCampaignsLedByUser(currentUser.id),
        getCampaignsJoinedByUser(currentUser.id),
      ]);

      setLeadingCampaigns(leading || []);
      setJoinedCampaigns(joined || []);
    } catch (error) {
      console.error("❌ Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleViewCampaign = (campaignId) => {
    router.push({
      pathname: "/(tabs)/features/group-purchasing/CampaignDetail",
      params: { campaignId },
    });
  };

  const handleBrowseDeals = () => {
    router.push("/(tabs)/deals");
  };

  const totalCampaigns = joinedCampaigns.length;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your campaigns...</Text>
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
          <View>
            <Text style={styles.greeting}>📋 My Campaigns</Text>
            <Text style={styles.subtitle}>
              {currentUser?.name || "Community Member"}'s solar journey
            </Text>
          </View>
          <ProfileAvatar size={44} />
        </View>
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{leadingCampaigns.length}</Text>
          <View style={styles.statLabelRow}>
            <Crown size={14} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.statLabel}>Leading</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{joinedCampaigns.length}</Text>
          <View style={styles.statLabelRow}>
            <Users size={14} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalCampaigns}</Text>
          <View style={styles.statLabelRow}>
            <TrendingUp size={14} color="#10B981" strokeWidth={2} />
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Empty State */}
      {totalCampaigns === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <User size={48} color="#94A3B8" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
          <Text style={styles.emptySubtext}>
            You haven't joined or led any campaigns yet.
          </Text>
          <Text style={styles.emptySubtext}>
            Browse deals and join a campaign to get started!
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={handleBrowseDeals}
          >
            <Text style={styles.browseButtonText}>Browse Deals →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Campaigns I'm Leading */}
      {leadingCampaigns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Crown size={20} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Leading</Text>
            </View>
            <Text style={styles.sectionCount}>{leadingCampaigns.length}</Text>
          </View>

          {leadingCampaigns.map((campaign) => (
            <TouchableOpacity
              key={campaign.id}
              style={styles.campaignCard}
              onPress={() => handleViewCampaign(campaign.id)}
              activeOpacity={0.8}
            >
              <View style={styles.campaignCardHeader}>
                <Text style={styles.campaignTitle}>
                  {campaign.deal?.title || "Untitled"}
                </Text>
                <View style={styles.organizerBadge}>
                  <Crown size={12} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.organizerBadgeText}>Organizer</Text>
                </View>
              </View>
              <View style={styles.campaignMeta}>
                <View style={styles.metaItem}>
                  <Users size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.metaText}>
                    {campaign.current_members || 0} /{" "}
                    {campaign.deal?.needed_neighbors || 5} spots
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Calendar size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.metaText}>
                    {formatDate(campaign.deadline)}
                  </Text>
                </View>
                <View style={styles.viewArrow}>
                  <Eye size={16} color="#1A5C4A" strokeWidth={2} />
                  <Text style={styles.viewText}>View</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Campaigns I've Joined */}
      {joinedCampaigns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Users size={20} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Joined</Text>
            </View>
            <Text style={styles.sectionCount}>{joinedCampaigns.length}</Text>
          </View>

          {joinedCampaigns.map((campaign) => (
            <TouchableOpacity
              key={campaign.id}
              style={styles.campaignCard}
              onPress={() => handleViewCampaign(campaign.id)}
              activeOpacity={0.8}
            >
              <View style={styles.campaignCardHeader}>
                <Text style={styles.campaignTitle}>
                  {campaign.deal?.title || "Untitled"}
                </Text>
                <View style={styles.memberBadge}>
                  <Users size={12} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.memberBadgeText}>Member</Text>
                </View>
              </View>
              <View style={styles.campaignMeta}>
                <View style={styles.metaItem}>
                  <Users size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.metaText}>
                    {campaign.current_members || 0} /{" "}
                    {campaign.deal?.needed_neighbors || 5} spots
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Calendar size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.metaText}>
                    {formatDate(campaign.deadline)}
                  </Text>
                </View>
                <View style={styles.viewArrow}>
                  <Eye size={16} color="#1A5C4A" strokeWidth={2} />
                  <Text style={styles.viewText}>View</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
    paddingBottom: 20,
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
  greeting: {
    fontSize: 22,
    fontWeight: "700",
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
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  sectionCount: {
    fontSize: 14,
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
  campaignCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
    flex: 1,
  },
  organizerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  organizerBadgeText: {
    fontSize: 10,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  memberBadgeText: {
    fontSize: 10,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  campaignMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },
  viewArrow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 4,
  },
  viewText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#1A5C4A",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textAlign: "center",
  },
  browseButton: {
    marginTop: 20,
    backgroundColor: "#1A5C4A",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    ...SHADOWS.button,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 60,
  },
  bottomPadding: {
    height: 20,
  },
});
