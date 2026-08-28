// app/utils/features/group-purchasing/currency.js

/**
 * Format a number as LKR currency
 * Example: 5000 -> "Rs 5,000"
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
