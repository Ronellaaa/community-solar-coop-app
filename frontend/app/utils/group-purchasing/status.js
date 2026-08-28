// app/utils/features/group-purchasing/status.js

/**
 * Get color for a status
 * Used for status badges and indicators
 */
export const getStatusColor = (status) => {
  const colorMap = {
    // Campaign statuses
    active: "#2ECC71", // Green
    locked: "#F39C12", // Orange
    completed: "#3498DB", // Blue
    cancelled: "#E74C3C", // Red

    // Member payment statuses
    pending: "#F39C12", // Orange
    paid: "#2ECC71", // Green

    // Fallback
    default: "#95A5A6", // Gray
  };
  return colorMap[status] || colorMap.default;
};

/**
 * Get label for a status
 * Used for displaying status text
 */
export const getStatusLabel = (status) => {
  const labelMap = {
    // Campaign statuses
    active: "Active",
    locked: "Locked",
    completed: "Completed",
    cancelled: "Cancelled",

    // Member payment statuses
    pending: "Payment Pending",
    paid: "Paid",
  };
  return labelMap[status] || status;
};

/**
 * Get emoji for a status
 * Used for quick visual indicators
 */
export const getStatusEmoji = (status) => {
  const emojiMap = {
    active: "🟢",
    locked: "🔒",
    completed: "✅",
    cancelled: "❌",
    pending: "⏳",
    paid: "💰",
  };
  return emojiMap[status] || "📌";
};
