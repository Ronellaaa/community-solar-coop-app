// frontend/app/(tabs)/_layout.js

import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { Home, ShoppingBag, Wrench, Zap, Sun } from "lucide-react-native";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1A5C4A" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        // Hide Expo Router's automatic header.
        // Each feature page can have its own custom header.
        headerShown: false,

        // Bottom tab colors
        tabBarActiveTintColor: "#1A5C4A",
        tabBarInactiveTintColor: "#94A3B8",

        // Bottom tab bar
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },

        // Bottom tab labels
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          fontFamily: "Nunito_500Medium",
        },

        tabBarIconStyle: {
          marginTop: 2,
        },

        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 12,
        },
      }}
    >
      {/* =====================================================
          MAIN BOTTOM TABS
          ===================================================== */}

      {/* Tab 1: Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",

          tabBarIcon: ({ color, size, focused }) => (
            <Home
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />

      {/* Tab 2: Deals */}
      <Tabs.Screen
        name="deals"
        options={{
          title: "Deals",
          tabBarLabel: "Deals",

          tabBarIcon: ({ color, size, focused }) => (
            <ShoppingBag
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      {/* Tab 3: Feature 2 */}
      <Tabs.Screen
        name="feature2"
        options={{
          title: "Energy Monitoring Dashboard",
          tabBarLabel: "Energy",
          tabBarIcon: ({ color, size, focused }) => (
            <Wrench
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      {/* Tab 4: Feature 3 */}
      <Tabs.Screen
        name="feature3"
        options={{
          title: "Feature 3",
          tabBarLabel: "Feature 3",

          tabBarIcon: ({ color, size, focused }) => (
            <Zap
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <Sun
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      {/* =====================================================
          GROUP PURCHASING FEATURE SCREENS
          These DO NOT appear in the bottom navigation.
          ===================================================== */}

      <Tabs.Screen
        name="features/group-purchasing/DealsFeed"
        options={{
          href: null,
          title: "Deals",
        }}
      />

      <Tabs.Screen
        name="features/group-purchasing/CampaignList"
        options={{
          href: null,
          title: "Campaigns",
        }}
      />

      <Tabs.Screen
        name="features/group-purchasing/CampaignDetail/index"
        options={{
          href: null,
          title: "Campaign Detail",
        }}
      />

      <Tabs.Screen
        name="features/group-purchasing/GroupCampaignsScreen"
        options={{
          href: null,
          title: "My Campaigns",
        }}
      />

      <Tabs.Screen
        name="CampaignProfile"
        options={{
          href: null,
          title: "My Campaigns",
        }}
      />

      {/* =====================================================
          SHARED SOLAR FEATURE SCREENS
          These should NOT appear in the bottom navigation.
          ===================================================== */}

      <Tabs.Screen
        name="features/shared-solar/SharedSolarDashboard"
        options={{
          href: null,
          title: "Shared Solar Projects",
        }}
      />

      <Tabs.Screen
        name="features/shared-solar/MySolarProject"
        options={{
          href: null,
          title: "My Solar Project",
        }}
      />

      <Tabs.Screen
        name="features/shared-solar/MySolarSavings"
        options={{
          href: null,
          title: "My Solar Savings",
        }}
      />

      <Tabs.Screen
        name="features/shared-solar/joinSharedSolar"
        options={{
          href: null,
          title: "join shared solar",
        }}
      />

      <Tabs.Screen
        name="features/shared-solar/ProjectDetails"
        options={{
          href: null,
          title: "Details",
        }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminProjectMembers"
        options={{
          href: null,
          title: "Members",
        }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminSavingsRecords"
        options={{
          href: null,
          title: "Savings Records",
        }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminSharedSolarDashboard"
        options={{
          href: null,
          title: "Shared Solar Dashboard",
        }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminSharedSolarProjects"
        options={{
          href: null,
          title: "Shared Solar Projects",
        }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminCreateSolarProject"
        options={{
          href: null,
          title: "Create Solar Project",
        }}
      />

      {/* Feature screens are stack routes, not bottom-tab destinations. */}
      <Tabs.Screen
        name="features/energy-monitoring/index"
        options={{ href: null, title: "Energy Monitoring Dashboard" }}
      />

      <Tabs.Screen
        name="features/energy-monitoring/insights"
        options={{ href: null, title: "Energy Monitoring Insights" }}
      />

      <Tabs.Screen
        name="features/energy-monitoring/savings"
        options={{ href: null, title: "Energy Monitoring Savings" }}
      />

      <Tabs.Screen
        name="features/energy-monitoring/usage"
        options={{ href: null, title: "Energy Monitoring Usage" }}
      />

      <Tabs.Screen
        name="AdminDashboard"
        options={{
          href: null,
          title: "Solar Admin Dashboard",
        }}
      />
    </Tabs>
  );
}
