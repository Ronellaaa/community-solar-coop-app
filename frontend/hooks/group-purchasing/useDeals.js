// app/hooks/features/group-purchasing/useDeals.js

import { useAppContext } from "../../context/AppContext";

export const useDeals = () => {
  const { deals, installers } = useAppContext();

  console.log("🔄 useDeals: deals from context:", deals);
  console.log("🔄 useDeals: installers from context:", installers);

  const getDealWithInstaller = (dealId) => {
    // ✅ Handle empty data gracefully
    if (!deals || deals.length === 0) {
      console.log("⚠️ No deals available yet");
      return { deal: null, installer: null };
    }

    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return { deal: null, installer: null };

    // ✅ FIX: Use installer_id (from your database column)
    const installer = installers?.find((i) => i.id === deal.installer_id);
    return { deal, installer };
  };

  const getAllDealsWithInstallers = () => {
    console.log("🔄 getAllDealsWithInstallers called");
    console.log("📦 deals length:", deals?.length);
    console.log("📦 installers length:", installers?.length);

    // ✅ Handle empty data gracefully
    if (!deals || deals.length === 0) {
      console.log("⚠️ No deals available yet");
      return [];
    }

    // ✅ FIX: Use installer_id (from your database column)
    const result = deals.map((deal) => ({
      ...deal,
      installer: installers?.find((i) => i.id === deal.installer_id),
    }));

    console.log("📦 result length:", result.length);
    return result;
  };

  return {
    deals,
    installers,
    getDealWithInstaller,
    getAllDealsWithInstallers,
  };
};
