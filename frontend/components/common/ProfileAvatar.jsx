// components/common/ProfileAvatar.jsx

import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { SHADOWS } from "../../app/utils/group-purchasing/shadows";
import { LogOut, Users } from "lucide-react-native";

export const ProfileAvatar = ({
  size = 44,
  showLogout = true,
  onPress,
  containerStyle,
}) => {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const { signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  // Get user initial
  const userInitial = currentUser?.name?.charAt(0) || "?";

  // Handle logout - ACTUALLY logs the user out
  const handleLogout = async () => {
    console.log("🔄 Logout clicked!");
    setShowMenu(false);

    try {
      console.log("🔄 Calling signOut function...");
      await signOut();
      console.log("✅ SignOut successful!");

      if (Platform.OS === "web") {
        window.location.href = "/auth/login";
      } else {
        router.replace("/auth/login");
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      if (Platform.OS === "web") {
        alert("Failed to logout. Please try again.");
      } else {
        Alert.alert("Error", "Failed to logout. Please try again.");
      }
    }
  };

  // Handle navigation to My Campaigns
  const handleMyCampaigns = () => {
    console.log("🔄 Navigating to My Campaigns");
    setShowMenu(false);
    router.push("/(tabs)/CampaignProfile");
  };

  // Handle press - show menu
  const handlePress = () => {
    console.log("🔄 Avatar pressed!");
    if (onPress) {
      onPress();
    } else if (showLogout) {
      setShowMenu(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.avatarButton, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.avatarText, { fontSize: size / 2.4 }]}>
            {userInitial}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {showMenu && (
        <Modal
          transparent={true}
          visible={showMenu}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <View style={styles.menuAvatar}>
                    <Text style={styles.menuAvatarText}>{userInitial}</Text>
                  </View>
                  <View>
                    <Text style={styles.menuName}>
                      {currentUser?.name || "User"}
                    </Text>
                    <Text style={styles.menuEmail}>
                      {currentUser?.email || ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.menuDivider} />

                {/* ✅ NEW: My Campaigns Option */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleMyCampaigns}
                >
                  <Users size={20} color="#1A5C4A" strokeWidth={2} />
                  <Text style={styles.menuItemText}>My Campaigns</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, styles.menuItemLogout]}
                  onPress={handleLogout}
                >
                  <LogOut size={20} color="#EF4444" strokeWidth={2} />
                  <Text style={styles.menuItemLogoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatarButton: {
    padding: 4,
  },
  avatar: {
    backgroundColor: "#1A5C4A",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  avatarText: {
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "web" ? 60 : 100,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: Platform.OS === "web" ? 260 : 260,
    ...SHADOWS.light,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A5C4A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuAvatarText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
  },
  menuEmail: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#1E293B",
  },
  menuItemLogout: {
    backgroundColor: "#FEF2F2",
  },
  menuItemLogoutText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#EF4444",
  },
});
