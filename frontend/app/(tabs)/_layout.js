// frontend/app/(tabs)/_layout.js

import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Home, ShoppingBag, Wrench, Zap, BarChart3 } from "lucide-react-native";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
        tabBarActiveTintColor: "#1A5C4A",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: "#1E293B",
        },
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

      {/* Tab 5: Feature 4 */}
      <Tabs.Screen
        name="feature4"
        options={{
          title: "Feature 4",
          tabBarLabel: "Feature 4",
          tabBarIcon: ({ color, size, focused }) => (
            <BarChart3
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      {/* Feature screens are stack routes, not bottom-tab destinations. */}
      <Tabs.Screen
        name="features/group-purchasing/DealsFeed"
        options={{ href: null, title: "Deals" }}
      />
      <Tabs.Screen
        name="features/group-purchasing/CampaignList"
        options={{ href: null, title: "Campaigns" }}
      />
      <Tabs.Screen
        name="features/group-purchasing/CampaignDetail/index"
        options={{ href: null, title: "Campaign Detail" }}
      />
      <Tabs.Screen
        name="features/group-purchasing/GroupCampaignsScreen"
        options={{ href: null, title: "My Campaigns" }}
      />

      <Tabs.Screen
        name="CampaignProfile"
        options={{ href: null, title: "My Campaigns" }}
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
    </Tabs>
  );
}
