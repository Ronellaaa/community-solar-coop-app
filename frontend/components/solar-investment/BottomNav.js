import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BottomNav({ active = "projects" }) {
  const router = useRouter();

  const items = [
    {
      key: "home",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
      route: "/",
    },
    {
      key: "projects",
      label: "Projects",
      icon: "grid-outline",
      activeIcon: "grid",
      route: "/community-investment",
    },
    {
      key: "investments",
      label: "Investments",
      icon: "wallet-outline",
      activeIcon: "wallet",
      route: "/community-investment/my-investments",
    },
    {
      key: "earnings",
      label: "Earnings",
      icon: "cash-outline",
      activeIcon: "cash",
      route: "/community-investment/earnings-history",
    },
    {
      key: "profile",
      label: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      route: "/profile",
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = active === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => router.push(item.route)}
          >
            <Ionicons
              name={isActive ? item.activeIcon : item.icon}
              size={21}
              color={isActive ? "#238636" : "#777"}
            />

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
    paddingBottom: 8,
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  label: {
    fontSize: 10,
    marginTop: 3,
    color: "#777",
  },

  activeLabel: {
    color: "#238636",
    fontWeight: "700",
  },
});