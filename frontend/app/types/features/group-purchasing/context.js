// app/types/features/group-purchasing/context.ts

/*import {
  Campaign,
  CampaignMember,
  CampaignWithDetails,
  DealType,
  Installer,
  User,
} from "./index";

export interface AppContextType {
  // ============================================================
  // DATA
  // ============================================================
  installers: Installer[];
  deals: DealType[];
  users: User[];
  campaigns: Campaign[];
  campaignMembers: CampaignMember[];

  // ============================================================
  // STATE
  // ============================================================
  loading: boolean;
  error: string | null;

  // ============================================================
  // CURRENT USER
  // ============================================================
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  getCampaignWithDetails: (
    campaignId: string,
  ) => Promise<CampaignWithDetails | null>;
  getCampaignsForDeal: (dealTypeId: string) => Promise<CampaignWithDetails[]>;
  getCampaignsLedByUser: (userId: string) => Promise<CampaignWithDetails[]>;
  getCampaignsJoinedByUser: (userId: string) => Promise<CampaignWithDetails[]>;

  // ============================================================
  // ACTIONS
  // ============================================================
  joinCampaign: (campaignId: string, userId: string) => Promise<void>;
  leaveCampaign: (campaignId: string, userId: string) => Promise<void>;
  confirmGroup: (campaignId: string) => Promise<void>;
  markPaymentStatus: (
    campaignId: string,
    memberId: string,
    status: "paid" | "pending",
  ) => Promise<void>;

  // ============================================================
  // ✅ ADDED: CREATE CAMPAIGN
  // ============================================================
  createCampaign: (data: {
    dealTypeId: string;
    organizerId: string;
    deadline: string;
  }) => Promise<{ id: string; success: boolean; error?: string }>;
}*/
