// frontend/app/(tabs)/_layout.js

import { Tabs, Redirect, usePathname } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Wrench,
  Zap,
  Sun,
  Package,
  Plus,
} from "lucide-react-native";
import { installerService } from "../../services/group-purchasing/installerService";

export default function TabLayout() {
  const { user, role, roleLoading, loading } = useAuth();
  const pathname = usePathname();
  const userId = user?.id;
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const checkRole = async () => {
      if (!userId) {
        setUserRole(null);
        setCheckingRole(false);
        return;
      }

      if (roleLoading) {
        setCheckingRole(true);
        return;
      }

      if (role === "admin") {
        setUserRole("admin");
        setCheckingRole(false);
        return;
      }

      if (role !== "installer") {
        setUserRole("user");
        setCheckingRole(false);
        return;
      }

      setCheckingRole(true);

      try {
        const installer = await installerService.getInstallerByUserId(userId);
        if (isCurrent) {
          setUserRole(installer?.is_verified ? "installer" : "user");
        }
      } catch (error) {
        console.error("Error checking role:", error);
        if (isCurrent) {
          setUserRole("user");
        }
      } finally {
        if (isCurrent) {
          setCheckingRole(false);
        }
      }
    };

    checkRole();
    return () => {
      isCurrent = false;
    };
  }, [userId, role, roleLoading]);

  const isInstaller = userRole === "installer";
  const isUnverifiedInstaller = role === "installer" && !isInstaller;
  const isAdmin = role === "admin";

  if (loading || roleLoading || checkingRole) {
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

  if (role === "admin" && pathname.endsWith("/home")) {
    return (
      <Redirect href="/(tabs)/features/admin-shared-solar/AdminSharedSolarDashboard" />
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1A5C4A",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          display: isAdmin || isUnverifiedInstaller ? "none" : "flex",
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
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          fontFamily: "Nunito_500Medium",
        },
        tabBarIconStyle: { marginTop: 2 },
        tabBarItemStyle: { paddingVertical: 4, borderRadius: 12 },
      }}
    >
      {/* =====================================================
          INSTALLER TABS
          Shown ONLY to verified installers.
          ===================================================== */}

      <Tabs.Screen
        name="features/group-purchasing/installer/InstallerDashboard"
        options={{
          href: isInstaller
            ? "/(tabs)/features/group-purchasing/installer/InstallerDashboard"
            : null,
          title: "Dashboard",
          tabBarLabel: "Dashboard",
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

      <Tabs.Screen
        name="features/group-purchasing/installer/MyDeals"
        options={{
          href: isInstaller
            ? "/(tabs)/features/group-purchasing/installer/MyDeals"
            : null,
          title: "My Deals",
          tabBarLabel: "My Deals",
          tabBarIcon: ({ color, size, focused }) => (
            <Package
              size={size || 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="features/group-purchasing/installer/PostDeal"
        options={{
          href: isInstaller
            ? "/(tabs)/features/group-purchasing/installer/PostDeal"
            : null,
          title: "Post Deal",
          tabBarLabel: "Post",
          tabBarIcon: ({ color, size, focused }) => (
            <Plus
              size={size || 24}
              color={color}
              strokeWidth={focused ? 3 : 2}
            />
          ),
        }}
      />

      {/* =====================================================
          COMMUNITY MEMBER TABS
          Hidden for installers.
          ===================================================== */}

      <Tabs.Screen
        name="home"
        options={{
          href: isInstaller ? null : "/(tabs)/home",
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

      <Tabs.Screen
        name="deals"
        options={{
          href: isInstaller ? null : "/(tabs)/deals",
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

      <Tabs.Screen
        name="feature2"
        options={{
          href: isInstaller ? null : "/(tabs)/feature2",
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

      <Tabs.Screen
        name="feature3"
        options={{
          href: isInstaller ? null : "/(tabs)/feature3",
          title: "Solar Investment",
          tabBarLabel: "Investments",
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
          href: isInstaller ? null : "/(tabs)/Dashboard",
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
          GROUP PURCHASING FEATURE SCREENS (hidden from tabs)
          ===================================================== */}

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

      <Tabs.Screen
        name="features/group-purchasing/ManageInstallers"
        options={{ href: null, title: "Manage Installers" }}
      />

      {/* Hidden installer screens (not in bottom bar) */}
      <Tabs.Screen
        name="features/group-purchasing/installer/PendingApproval"
        options={{ href: null, title: "Pending Approval" }}
      />

      <Tabs.Screen
        name="features/group-purchasing/installer/DealCampaigns"
        options={{ href: null, title: "Deal Campaigns" }}
      />

      {/* ✅ NEW: Bank Details (hidden from tabs) */}
      <Tabs.Screen
        name="features/group-purchasing/installer/BankDetails"
        options={{ href: null, title: "Bank Details" }}
      />

      {/* =====================================================
          SHARED SOLAR FEATURE SCREENS
          ===================================================== */}

      <Tabs.Screen
        name="features/shared-solar/SharedSolarDashboard"
        options={{ href: null, title: "Shared Solar Projects" }}
      />

      <Tabs.Screen
        name="features/shared-solar/MySolarProject"
        options={{ href: null, title: "My Solar Project" }}
      />

      <Tabs.Screen
        name="features/shared-solar/MySolarSavings"
        options={{ href: null, title: "My Solar Savings" }}
      />

      <Tabs.Screen
        name="features/shared-solar/joinSharedSolar"
        options={{ href: null, title: "join shared solar" }}
      />

      <Tabs.Screen
        name="features/shared-solar/ProjectDetails"
        options={{ href: null, title: "Details" }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminProjectMembers"
        options={{ href: null, title: "Members" }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminSavingsRecords"
        options={{ href: null, title: "Savings Records" }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminSharedSolarDashboard"
        options={{ href: null, title: "Shared Solar Dashboard" }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminSharedSolarProjects"
        options={{ href: null, title: "Shared Solar Projects" }}
      />

      <Tabs.Screen
        name="features/admin-shared-solar/AdminCreateSolarProject"
        options={{ href: null, title: "Create Solar Project" }}
      />

      {/* =====================================================
          ENERGY MONITORING SCREENS
          ===================================================== */}

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
        options={{ href: null, title: "Solar Admin Dashboard" }}
      />

      {/* =====================================================
          COMMUNITY INVESTMENT SCREENS
          ===================================================== */}

      <Tabs.Screen
        name="features/community-investment/index"
        options={{ href: null, title: "Community Projects" }}
      />

      <Tabs.Screen
        name="features/community-investment/earnings-history"
        options={{ href: null, title: "Earnings History" }}
      />

      <Tabs.Screen
        name="features/community-investment/project-details"
        options={{ href: null, title: "Project Details" }}
      />

      <Tabs.Screen
        name="features/community-investment/funding-progress"
        options={{ href: null, title: "Funding Progress" }}
      />

      <Tabs.Screen
        name="features/community-investment/return-calculator"
        options={{ href: null, title: "Return Calculator" }}
      />

      <Tabs.Screen
        name="features/community-investment/purchase-shares"
        options={{ href: null, title: "Purchase Shares" }}
      />

      <Tabs.Screen
        name="features/community-investment/investment-success"
        options={{ href: null, title: "Investment Success" }}
      />

      <Tabs.Screen
        name="features/community-investment/my-investments"
        options={{ href: null, title: "My Investments" }}
      />
    </Tabs>
  );
}
