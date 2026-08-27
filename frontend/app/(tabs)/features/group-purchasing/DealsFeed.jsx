// app/(tabs)/features/group-purchasing/DealsFeed.jsx

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DealCard } from "../../../../components/group-purchasing/DealCard";
import { useDealsFeed } from "../../../../hooks/group-purchasing/useDealsFeed";
import { SHADOWS } from "../../../utils/group-purchasing/shadows";
import { ProfileAvatar } from "../../../../components/common";

// 🚀 MODERN ICON IMPORTS
import { Flame } from "lucide-react-native";

export default function DealsFeed() {
  const { deals, loading, stats, handleViewCampaigns } = useDealsFeed();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading deals...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, Community!</Text>
            <Text style={styles.subtitle}>
              Find the best solar deals together
            </Text>
          </View>
          <ProfileAvatar size={44} />
        </View>
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.activeDeals}</Text>
          <Text style={styles.statLabel}>Active Deals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.neighborsJoined}</Text>
          <Text style={styles.statLabel}>Neighbors Joined</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            ${(stats.totalSaved / 1000).toFixed(0)}K
          </Text>
          <Text style={styles.statLabel}>Total Saved</Text>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderRow}>
          <Flame size={24} color="#F97316" strokeWidth={2.5} />
          <Text style={styles.sectionTitle}>Live Deals</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Join a group and save together
        </Text>
      </View>

      {/* Deals List */}
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          installer={deal.installer}
          onViewCampaigns={handleViewCampaigns}
        />
      ))}

      {/* Empty State */}
      {deals.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No deals available</Text>
          <Text style={styles.emptyStateSubtext}>
            Check back later for new solar deals!
          </Text>
        </View>
      )}

      {/* Bottom Padding */}
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
    fontSize: 26,
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
    fontWeight: "400",
    letterSpacing: 0.3,
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
    fontSize: 20,
    fontWeight: "700",
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
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 6,
    letterSpacing: 0.2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 4,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
  },
  bottomPadding: {
    height: 20,
  },
});
