// app/types/features/group-purchasing/index.ts

/*export interface Installer {
  id: string;
  name: string;
  logo: string;
  rating: number;
  yearsInBusiness: number;
  isVerified: boolean;
}

export interface DealType {
  id: string;
  installerId: string;
  title: string;
  description: string;
  imageUrl: string;
  regularPrice: number;
  discountedPrice: number;
  neededNeighbors: number; // ✅ CHANGED: minNeighbors → neededNeighbors
  deadlineDays: number;
  category: "panels" | "batteries" | "inverters" | "installation";
}

export interface Campaign {
  id: string;
  dealTypeId: string;
  organizerId: string;
  status: "active" | "locked" | "completed" | "cancelled";
  currentMembers: number;
  createdAt: string;
  deadline: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  isCommunityMember: boolean;
  joinDate: string;
  // ❌ REMOVED: isOrganizer - any user can be organizer
}

export interface CampaignMember {
  campaignId: string;
  memberId: string;
  status: "pending" | "paid" | "cancelled";
  joinedAt: string;
  paidAt?: string;
}

export interface CampaignWithDetails extends Campaign {
  dealType?: DealType;
  installer?: Installer;
  organizer?: User;
  members: (CampaignMember & { user: User })[];
}

export * from "./context";*/
