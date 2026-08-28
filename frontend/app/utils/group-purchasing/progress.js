// app/utils/features/group-purchasing/progress.js

/**
 * Calculate percentage of progress
 * Example: current=3, target=5 -> 60
 */
export const calculateProgress = (current, target) => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

/**
 * Check if a campaign is full (reached its target)
 */
export const isCampaignFull = (currentMembers, neededNeighbors) => {
  return currentMembers >= neededNeighbors;
};

/**
 * Check how many more members are needed to trigger the deal
 */
export const getMembersNeeded = (currentMembers, neededNeighbors) => {
  const needed = neededNeighbors - currentMembers;
  return Math.max(0, needed);
};
