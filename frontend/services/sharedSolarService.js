import { supabase } from "../lib/supabase";

// =====================================================
// GET ALL SHARED SOLAR PROJECTS
// =====================================================

export const getSharedSolarProjects = async () => {
  const { data, error } = await supabase
    .from("shared_solar_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shared solar projects:", error);
    throw error;
  }

  return data || [];
};


// =====================================================
// GET ONE SHARED SOLAR PROJECT
// =====================================================

export const getSharedSolarProject = async (projectId) => {
  const { data, error } = await supabase
    .from("shared_solar_projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching shared solar project:", error);
    throw error;
  }

  return data;
};


// =====================================================
// CREATE SHARED SOLAR PROJECT
// =====================================================

export const createSharedSolarProject = async ({
  name,
  description,
  location,
  totalCapacityKw,
  targetMembers,
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in to create a solar project.");
  }

  const { data, error } = await supabase
    .from("shared_solar_projects")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      location: location?.trim() || null,
      total_capacity_kw: Number(totalCapacityKw) || 0,
      target_members: Number(targetMembers) || 0,
      current_members: 0,
      total_energy_generated_kwh: 0,
      total_estimated_savings: 0,
      status: "planning",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating shared solar project:", error);
    throw error;
  }

  return data;
};


// =====================================================
// JOIN A SHARED SOLAR PROJECT
// =====================================================

export const joinSharedSolarProject = async (projectId) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in to join a solar project.");
  }

  // Check whether the user is already a member
  const { data: existingMember, error: existingError } =
    await supabase
      .from("shared_solar_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingMember) {
    throw new Error("You are already a member of this project.");
  }

  const { data, error } = await supabase
    .from("shared_solar_members")
    .insert({
      project_id: projectId,
      user_id: user.id,
      ownership_percentage: 0,
      allocated_energy_kwh: 0,
      estimated_bill_saving: 0,
      lifetime_saving: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error joining shared solar project:", error);
    throw error;
  }

  return data;
};


// =====================================================
// GET CURRENT USER'S MEMBERSHIP
// =====================================================

export const getMyMembership = async (projectId) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // No logged-in user = no membership
  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("shared_solar_members")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching membership:", error);
    throw error;
  }

  return data;
};


// =====================================================
// GET ENERGY RECORDS
// =====================================================

export const getEnergyRecords = async (projectId) => {
  const { data, error } = await supabase
    .from("shared_solar_energy_records")
    .select("*")
    .eq("project_id", projectId)
    .order("record_date", { ascending: false });

  if (error) {
    console.error("Error fetching energy records:", error);
    throw error;
  }

  return data || [];
};


// =====================================================
// ADD ENERGY RECORD
// =====================================================

export const addEnergyRecord = async ({
  projectId,
  recordDate,
  energyGenerated,
  energyShared,
}) => {
  const { data, error } = await supabase
    .from("shared_solar_energy_records")
    .insert({
      project_id: projectId,
      record_date: recordDate,
      energy_generated_kwh: Number(energyGenerated) || 0,
      total_energy_shared_kwh: Number(energyShared) || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding energy record:", error);
    throw error;
  }

  return data;
};


// =====================================================
// GET MY SAVINGS HISTORY
// =====================================================

export const getMySavingsHistory = async (projectId) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // No logged-in user = no savings history
  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("shared_solar_savings")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .order("record_date", { ascending: false });

  if (error) {
    console.error("Error fetching savings history:", error);
    throw error;
  }

  return data || [];
};


// =====================================================
// ADD SAVINGS RECORD
// =====================================================

export const addSavingRecord = async ({
  projectId,
  userId,
  recordDate,
  energyAllocated,
  estimatedSaving,
}) => {
  const { data, error } = await supabase
    .from("shared_solar_savings")
    .insert({
      project_id: projectId,
      user_id: userId,
      record_date: recordDate,
      energy_allocated_kwh: Number(energyAllocated) || 0,
      estimated_saving: Number(estimatedSaving) || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding savings record:", error);
    throw error;
  }

  return data;
};