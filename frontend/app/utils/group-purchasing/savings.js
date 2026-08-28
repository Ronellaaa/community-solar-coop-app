// app/utils/features/group-purchasing/savings.js

/**
 * Calculate the amount saved
 * Example: regular=7000, discounted=5000 -> 2000
 */
export const calculateSavings = (regularPrice, discountedPrice) => {
  return regularPrice - discountedPrice;
};

/**
 * Calculate the savings percentage
 * Example: regular=7000, discounted=5000 -> 29%
 */
export const calculateSavingsPercentage = (regularPrice, discountedPrice) => {
  if (regularPrice === 0) return 0;
  return Math.round(((regularPrice - discountedPrice) / regularPrice) * 100);
};

/**
 * Calculate total group savings
 * Example: regular=7000, discounted=5000, members=5 -> 10000
 */
export const calculateTotalGroupSavings = (
  regularPrice,
  discountedPrice,
  numberOfMembers,
) => {
  return (regularPrice - discountedPrice) * numberOfMembers;
};
