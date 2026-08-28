import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import {
  calculateSavingsPercentage,
  formatCurrency,
  SHADOWS,
} from "../../app/utils/group-purchasing";

// 🚀 MODERN ICON IMPORTS
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Sun,
  Users,
} from "lucide-react-native";

export const DealCard = ({ deal, installer, onViewCampaigns }) => {
  // ✅ FIX: Use snake_case properties from Supabase with fallbacks
  const regularPrice = deal?.regular_price ?? deal?.regularPrice ?? 0;
  const discountedPrice = deal?.discounted_price ?? deal?.discountedPrice ?? 0;
  const deadlineDays = deal?.deadline_days ?? deal?.deadlineDays ?? 7;
  const neededNeighbors = deal?.needed_neighbors ?? deal?.neededNeighbors ?? 5;
  const title = deal?.title || "Untitled Deal";
  const installerName = installer?.name || "Unknown Installer";

  const imageUrl = deal?.image_url ?? deal?.imageUrl ?? null;

  const savingsPercentage = calculateSavingsPercentage(
    regularPrice,
    discountedPrice,
  );
  const isUrgent = deadlineDays <= 7;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewCampaigns(deal.id)}
      activeOpacity={0.8}
    >
      {/* ✅ Card Image - NOW WITH ACTUAL IMAGE */}
      <View style={styles.cardImageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          // Fallback if no image URL
          <View style={styles.imagePlaceholder}>
            <Sun size={64} color="#F97316" strokeWidth={1.5} />
          </View>
        )}
        <View style={styles.savingsTag}>
          <Text style={styles.savingsTagText}>Save {savingsPercentage}%</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.dealTitle}>{title}</Text>
            <View style={styles.installerRow}>
              <View style={styles.installerDot} />
              <Text style={styles.installerName}>{installerName}</Text>
            </View>
          </View>
          <View style={styles.verifiedBadge}>
            <CheckCircle size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <View style={styles.priceSection}>
          <View>
            <Text style={styles.discountedPrice}>
              {formatCurrency(discountedPrice)}
            </Text>
            <Text style={styles.priceLabel}>Group Price</Text>
          </View>
          <View style={styles.regularPriceContainer}>
            <Text style={styles.regularPrice}>
              {formatCurrency(regularPrice)}
            </Text>
            <Text style={styles.regularPriceLabel}>Regular Price</Text>
          </View>
        </View>

        <View style={styles.dealFooter}>
          <View style={styles.neighborsSection}>
            <Users size={16} color="#64748B" strokeWidth={2} />
            <Text style={styles.neighborsText}>
              Need {neededNeighbors} neighbors
            </Text>
          </View>
          <View style={styles.deadlineSection}>
            <Clock size={16} color="#64748B" strokeWidth={2} />
            <Text
              style={[styles.deadlineText, isUrgent && styles.deadlineUrgent]}
            >
              {deadlineDays} days left
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onViewCampaigns(deal.id)}
        >
          <Text style={styles.viewButtonText}>View Campaigns</Text>
          <ArrowRight
            size={18}
            color="#FFFFFF"
            strokeWidth={2.5}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...SHADOWS.card,
  },
  cardImageContainer: {
    height: 180,
    backgroundColor: "#F0F4F8",
    position: "relative",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF9F6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  savingsTag: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#2DD4BF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    ...SHADOWS.badge,
  },
  savingsTagText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleSection: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  installerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  installerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1A5C4A",
    marginRight: 6,
  },
  installerName: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    fontWeight: "400",
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2DD4BF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  discountedPrice: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Nunito_700Bold",
    color: "#1A5C4A",
    letterSpacing: -0.5,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "500",
  },
  regularPriceContainer: {
    marginLeft: 18,
    paddingBottom: 3,
  },
  regularPrice: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#CBD5E1",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  regularPriceLabel: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#CBD5E1",
    marginTop: 2,
  },
  dealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  neighborsSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  neighborsText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    fontWeight: "500",
  },
  deadlineSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deadlineText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    fontWeight: "500",
  },
  deadlineUrgent: {
    color: "#EF4444",
    fontWeight: "600",
  },
  viewButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    backgroundColor: "#1A5C4A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.button,
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
