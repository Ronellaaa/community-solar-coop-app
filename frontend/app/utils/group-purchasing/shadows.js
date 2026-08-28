// utils/shadows.js
import { Platform } from "react-native";

// A helper to create consistent shadows across Web & Mobile
export const createShadow = (webShadow, mobileShadow) => {
  return Platform.select({
    web: {
      boxShadow: webShadow,
    },
    default: mobileShadow,
  });
};

// Pre-made shadows for your app (so you don't have to type them out every time)
export const SHADOWS = {
  // Soft, floating card shadow
  card: createShadow(
    "0px 8px 24px rgba(0, 0, 0, 0.06)", // Web
    {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4,
    },
  ),

  // Small, subtle shadow for badges
  badge: createShadow(
    "0px 4px 12px rgba(45, 212, 191, 0.4)", // Web
    {
      shadowColor: "#2DD4BF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
  ),

  // Strong button shadow
  button: createShadow(
    "0px 4px 14px rgba(26, 92, 74, 0.3)", // Web
    {
      shadowColor: "#1A5C4A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  ),

  // Light shadow for headers and banners
  light: createShadow(
    "0px 6px 16px rgba(0, 0, 0, 0.04)", // Web
    {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 3,
    },
  ),
};
