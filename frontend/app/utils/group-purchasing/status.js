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
    payment_confirmed: "#3498DB", // Blue
    awaiting_approval: "#F97316", // Orange-ish (NEW)
    completed: "#9B59B6", // Purple
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
    locked: "Awaiting Payment",
    payment_confirmed: "Payment Confirmed",
    awaiting_approval: "Awaiting Approval", // NEW
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
    payment_confirmed: "💳",
    awaiting_approval: "⏳", // NEW
    completed: "✅",
    cancelled: "❌",
    pending: "⏳",
    paid: "💰",
  };
  return emojiMap[status] || "📌";
};
