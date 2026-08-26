// hooks/features/group-purchasing/useDealsFeed.js

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useDeals } from "./useDeals";

export const useDealsFeed = () => {
  const router = useRouter();
  const { deals, installers, getAllDealsWithInstallers } = useDeals(); // ✅ Get deals and installers

  const [dealsWithInstallers, setDealsWithInstallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeDeals: 0,
    neighborsJoined: 0,
    totalSaved: 0,
  });

  // ✅ FIX: Add deals and installers as dependencies
  useEffect(() => {
    console.log("🔄 useDealsFeed: Loading deals...");
    console.log("📦 deals from context:", deals);
    console.log("📦 installers from context:", installers);

    const loadDeals = () => {
      try {
        setLoading(true);

        // ✅ Now this will work because deals and installers are available
        const result = getAllDealsWithInstallers();
        console.log("📦 Deals with installers:", result);

        setDealsWithInstallers(result || []);

        const activeDeals = result?.length || 0;
        setStats({
          activeDeals,
          neighborsJoined: 12,
          totalSaved: 24000,
        });
      } catch (error) {
        console.error("❌ Error loading deals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, [deals, installers, getAllDealsWithInstallers]); // ✅ Added dependencies

  const handleViewCampaigns = (dealId) => {
    router.push({
      pathname: "/features/group-purchasing/CampaignList",
      params: { dealId },
    });
  };

  return {
    deals: dealsWithInstallers,
    loading,
    stats,
    handleViewCampaigns,
  };
};
