// app/(tabs)/home.jsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { SHADOWS } from "../utils/group-purchasing/shadows";
import { ProfileAvatar } from "../../components/common";

// Icons
import {
  Users,
  ShoppingBag,
  Zap,
  PiggyBank,
  ArrowRight,
  Sun,
} from "lucide-react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const { user } = useAuth();

  const userName =
    currentUser?.name || user?.email?.split("@")[0] || "Community Member";

  // Feature data - update these with your friends' features
  const features = [
    {
      id: "group-purchasing",
      title: "Group Purchasing",
      description: "Join solar deals with neighbors and save together",
      icon: <Users size={28} color="#1A5C4A" strokeWidth={2} />,
      route: "/(tabs)/deals",
      color: "#E8F8F0",
      textColor: "#1A5C4A",
    },
    {
      id: "feature-2",
      title: "Feature 2",
      description: "Description of friend 1's feature",
      icon: <ShoppingBag size={28} color="#3B82F6" strokeWidth={2} />,
      route: "/(tabs)/feature2", // Your friend's route
      color: "#EFF6FF",
      textColor: "#3B82F6",
    },
    {
      id: "feature-3",
      title: "Feature 3",
      description: "Description of friend 2's feature",
      icon: <Zap size={28} color="#F59E0B" strokeWidth={2} />,
      route: "/(tabs)/feature3", // Your friend's route
      color: "#FFFBEB",
      textColor: "#F59E0B",
    },
    {
      id: "feature-4",
      title: "Shared Solar",
      description: "Track your solar savings and energy benefits",
      icon: <PiggyBank size={28} color="#8B5CF6" strokeWidth={2} />,
      route: "/(tabs)/features/shared-solar/SharedSolarDashboard",
      color: "#F5F3FF",
      textColor: "#8B5CF6",
},
  ];

  const handleFeaturePress = (route) => {
    router.push(route);
  };

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
            <Text style={styles.greeting}>☀️ Solar Community</Text>
            <Text style={styles.subtitle}>Welcome back, {userName}!</Text>
          </View>
          <ProfileAvatar size={44} />
        </View>
        <Text style={styles.headerDescription}>
          Choose a feature to get started with your solar journey
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.featureCard, { backgroundColor: feature.color }]}
            onPress={() => handleFeaturePress(feature.route)}
            activeOpacity={0.8}
          >
            <View style={styles.featureIconContainer}>{feature.icon}</View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: feature.textColor }]}>
                {feature.title}
              </Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
            <ArrowRight
              size={20}
              color={feature.textColor}
              strokeWidth={2}
              style={styles.featureArrow}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Spacing */}
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
    paddingBottom: 24,
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
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Nunito_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  headerDescription: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
    marginTop: 12,
    lineHeight: 20,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...SHADOWS.card,
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    ...SHADOWS.light,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    lineHeight: 18,
  },
  featureArrow: {
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});
