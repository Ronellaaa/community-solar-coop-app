// app/utils/features/group-purchasing/time.js

/**
 * Calculate how many days are left until a deadline
 * Example: deadline is 3 days from now -> "3 days left"
 */
export const formatTimeLeft = (deadlineString) => {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffInDays = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) return "Expired";
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day left";
  return `${diffInDays} days left`;
};

/**
 * Get the time left in a more detailed format
 * Example: "3 days, 4 hours left"
 */
export const formatTimeLeftDetailed = (deadlineString) => {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffInMs = deadline.getTime() - now.getTime();

  if (diffInMs < 0) return "Expired";

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  if (diffInDays === 0) {
    return `${diffInHours} hours left`;
  }

  if (diffInDays === 1) {
    return `1 day, ${diffInHours} hours left`;
  }

  return `${diffInDays} days, ${diffInHours} hours left`;
};

/**
 * Check if a campaign is expiring soon (within 3 days)
 */
export const isExpiringSoon = (deadlineString) => {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffInDays = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffInDays > 0 && diffInDays <= 3;
};

/**
 * Check if a campaign has expired
 */
export const isExpired = (deadlineString) => {
  const now = new Date();
  const deadline = new Date(deadlineString);
  return now > deadline;
};
