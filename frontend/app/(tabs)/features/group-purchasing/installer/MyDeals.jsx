// frontend/app/(tabs)/features/group-purchasing/installer/MyDeals.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../../../../../context/AppContext";
import { installerService } from "../../../../../services/group-purchasing/installerService";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";
import { formatCurrency } from "../../../../utils/group-purchasing";

// Icons
import {
  ArrowLeft,
  Plus,
  Users,
  Clock,
  Eye,
  Package,
} from "lucide-react-native";

export default function MyDealsScreen() {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDeals = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const data = await installerService.getDealsByInstaller(currentUser.id);
      setDeals(data || []);
    } catch (error) {
      console.error("❌ Error loading deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, [currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeals();
    setRefreshing(false);
  };

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
        <Text style={styles.headerTitle}>My Deals</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.push("/(tabs)/features/group-purchasing/installer/PostDeal")
          }
        >
          <Plus size={22} color="#1A5C4A" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {deals.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Package size={48} color="#94A3B8" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No Deals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Post your first deal to start attracting customers.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() =>
                router.push(
                  "/(tabs)/features/group-purchasing/installer/PostDeal",
                )
              }
              activeOpacity={0.8}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.emptyButtonText}>Post New Deal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {deals.length} {deals.length === 1 ? "Deal" : "Deals"}
              </Text>
            </View>

            {deals.map((deal) => (
              <TouchableOpacity
                key={deal.id}
                style={styles.dealCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/(tabs)/features/group-purchasing/installer/DealCampaigns",
                    params: { dealId: deal.id },
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.dealContent}>
                  {deal.image_url ? (
                    <Image
                      source={{ uri: deal.image_url }}
                      style={styles.dealImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.dealImagePlaceholder}>
                      <Package size={32} color="#94A3B8" strokeWidth={1.5} />
                    </View>
                  )}

                  <View style={styles.dealDetails}>
                    <Text style={styles.dealTitle} numberOfLines={2}>
                      {deal.title}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.discountedPrice}>
                        {formatCurrency(deal.discounted_price)}
                      </Text>
                      <Text style={styles.regularPrice}>
                        {formatCurrency(deal.regular_price)}
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Users size={12} color="#64748B" strokeWidth={2} />
                        <Text style={styles.metaText}>
                          {deal.needed_neighbors} neighbors
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Clock size={12} color="#64748B" strokeWidth={2} />
                        <Text style={styles.metaText}>
                          {deal.deadline_days} days
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.viewArrow}>
                    <Eye size={18} color="#1A5C4A" strokeWidth={2.5} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
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
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  dealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    ...SHADOWS.card,
  },
  dealContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  dealImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  dealImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  dealDetails: { flex: 1, gap: 6 },
  dealTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  discountedPrice: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#1A5C4A",
  },
  regularPrice: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  metaRow: { flexDirection: "row", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
  },
  viewArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A5C4A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    gap: 8,
    ...SHADOWS.button,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
});
