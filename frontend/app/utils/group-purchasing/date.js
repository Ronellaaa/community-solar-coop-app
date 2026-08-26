// app/utils/features/group-purchasing/date.js

/**
 * Format a date string to a readable format
 * Example: "2024-01-15T10:00:00Z" -> "Jan 15, 2024"
 */
export const formatDate = (dateString) => {
  // ✅ Check if dateString is valid
  if (!dateString) {
    console.warn("⚠️ formatDate: No date string provided");
    return "Date not available";
  }

  const date = new Date(dateString);

  // ✅ Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn("⚠️ formatDate: Invalid date:", dateString);
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Format a date string to a short format
 * Example: "2024-01-15T10:00:00Z" -> "01/15/2024"
 */
export const formatDateShort = (dateString) => {
  // ✅ Check if dateString is valid
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  // ✅ Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};
