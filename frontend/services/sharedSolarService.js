import { supabase } from "../lib/supabase";

// =====================================================
// GET CURRENT USER
// =====================================================

const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
};

// =====================================================
// USER - GET ALL PROJECTS
// =====================================================

export const getSharedSolarProjects = async () => {
  const { data, error } = await supabase
    .from("shared_solar_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading shared solar projects:", error);
    throw error;
  }

  return data || [];
};

// =====================================================
// USER - GET SINGLE PROJECT
// =====================================================

export const getSharedSolarProject = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  const { data, error } = await supabase
    .from("shared_solar_projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error loading shared solar project:", error);
    throw error;
  }

  return data;
};

// =====================================================
// USER - GET MY MEMBERSHIP
// =====================================================

export const getMyMembership = async (projectId) => {
  const user = await getCurrentUser();

  if (!user || !projectId) {
    return null;
  }

  const { data, error } = await supabase
    .from("shared_solar_members")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error loading membership:", error);
    throw error;
  }

  return data;
};

// =====================================================
// USER - GET ENERGY RECORDS
// =====================================================

export const getEnergyRecords = async (projectId) => {
  if (!projectId) {
    return [];
  }

  const { data, error } = await supabase
    .from("shared_solar_energy_records")
    .select("*")
    .eq("project_id", projectId)
    .order("record_date", { ascending: false });

  if (error) {
    console.error("Error loading energy records:", error);
    throw error;
  }

  return data || [];
};

// =====================================================
// GET MY SAVINGS HISTORY
// =====================================================

export const getMySavingsHistory = async (projectId) => {
  const user = await getCurrentUser();

  if (!user || !projectId) {
    return [];
  }

  // Get the current user's membership
  const { data: membership, error: membershipError } =
    await supabase
      .from("shared_solar_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

  if (membershipError) {
    console.error(
      "Error loading membership for savings:",
      membershipError
    );

    throw membershipError;
  }

  if (!membership) {
    return [];
  }

  // Get savings belonging to this membership
  const { data, error } = await supabase
    .from("shared_solar_savings")
    .select("*")
    .eq("member_id", membership.id)
    .order("record_date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Error loading savings records:",
      error
    );

    throw error;
  }

  return data || [];
};
// =====================================================
// USER - GET MY JOIN REQUEST
// =====================================================

export const getMyJoinRequest = async (projectId) => {
  const user = await getCurrentUser();

  if (!user || !projectId) {
    return null;
  }

  const { data, error } = await supabase
    .from("shared_solar_join_requests")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

// =====================================================
// USER - CREATE JOIN REQUEST
// =====================================================

export const createJoinRequest = async ({
  projectId,
  contributionCommitment,
  estimatedEnergyAllocation,
  message,
}) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be logged in to join a solar project.");
  }

  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  const contribution = Number(contributionCommitment);
  const energyAllocation = Number(estimatedEnergyAllocation);

  if (!Number.isFinite(contribution) || contribution <= 0) {
    throw new Error("Please enter a valid contribution commitment.");
  }

  if (!Number.isFinite(energyAllocation) || energyAllocation <= 0) {
    throw new Error("Please enter a valid energy allocation.");
  }

  const {
    data: existingRequest,
    error: requestCheckError,
  } = await supabase
    .from("shared_solar_join_requests")
    .select("id, status")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (requestCheckError) {
    throw requestCheckError;
  }

  if (existingRequest) {
    throw new Error(
      "You have already submitted a joining request for this project."
    );
  }

  const {
    data: existingMember,
    error: memberCheckError,
  } = await supabase
    .from("shared_solar_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (memberCheckError) {
    throw memberCheckError;
  }

  if (existingMember) {
    throw new Error("You are already a member of this project.");
  }

  const { data: project, error: projectError } = await supabase
    .from("shared_solar_projects")
    .select(
      "id, status, target_members, current_members, required_fund, committed_fund"
    )
    .eq("id", projectId)
    .single();

  if (projectError) {
    throw projectError;
  }

  if (!project) {
    throw new Error("Solar project not found.");
  }

  if (
    project.status === "completed" ||
    project.status === "cancelled"
  ) {
    throw new Error(
      "This solar project is no longer accepting members."
    );
  }

  const { data, error } = await supabase
    .from("shared_solar_join_requests")
    .insert({
      project_id: projectId,
      user_id: user.id,
      contribution_commitment: contribution,
      estimated_energy_allocation: energyAllocation,
      message: message?.trim() || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating join request:", error);

    if (error.code === "23505") {
      throw new Error(
        "You have already submitted a joining request for this project."
      );
    }

    throw error;
  }

  return data;
};

// =====================================================
// ADMIN - GET ALL PROJECTS
// =====================================================

export const getAdminSharedSolarProjects = async () => {
  const { data, error } = await supabase
    .from("shared_solar_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading admin projects:", error);
    throw error;
  }

  return data || [];
};

// =====================================================
// ADMIN - CREATE PROJECT
// =====================================================

export const createSharedSolarProject = async ({
  name,
  location,
  totalCapacityKw,
  targetMembers,
  requiredFund,
  description,
  status = "planning",
}) => {
  if (!name?.trim()) {
    throw new Error("Project name is required.");
  }

  const capacity = Number(totalCapacityKw);
  const members = Number(targetMembers);
  const fund = Number(requiredFund || 0);

  if (!Number.isFinite(capacity) || capacity <= 0) {
    throw new Error("Please enter a valid solar capacity.");
  }

  if (!Number.isFinite(members) || members <= 0) {
    throw new Error("Please enter a valid target member count.");
  }

  if (!Number.isFinite(fund) || fund < 0) {
    throw new Error("Please enter a valid required fund.");
  }

  const { data, error } = await supabase
    .from("shared_solar_projects")
    .insert({
      name: name.trim(),
      location: location?.trim() || null,
      total_capacity_kw: capacity,
      target_members: members,
      current_members: 0,
      required_fund: fund,
      committed_fund: 0,
      description: description?.trim() || null,
      status,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating solar project:", error);
    throw error;
  }

  return data;
};

// =====================================================
// ADMIN - UPDATE PROJECT
// =====================================================

export const updateSharedSolarProject = async (
  projectId,
  {
    name,
    location,
    totalCapacityKw,
    targetMembers,
    requiredFund,
    description,
    status,
  }
) => {
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  if (!name?.trim()) {
    throw new Error("Project name is required.");
  }

  const capacity = Number(totalCapacityKw);
  const members = Number(targetMembers);
  const fund = Number(requiredFund || 0);

  if (!Number.isFinite(capacity) || capacity <= 0) {
    throw new Error("Please enter a valid solar capacity.");
  }

  if (!Number.isFinite(members) || members <= 0) {
    throw new Error("Please enter a valid target member count.");
  }

  if (!Number.isFinite(fund) || fund < 0) {
    throw new Error("Please enter a valid required fund.");
  }

  const { data, error } = await supabase
    .from("shared_solar_projects")
    .update({
      name: name.trim(),
      location: location?.trim() || null,
      total_capacity_kw: capacity,
      target_members: members,
      required_fund: fund,
      description: description?.trim() || null,
      status,
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating solar project:", error);
    throw error;
  }

  return data;
};

// =====================================================
// ADMIN - GET ALL JOIN REQUESTS
// =====================================================

export const getAllJoinRequests = async (projectId = null) => {
  let query = supabase
    .from("shared_solar_join_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading join requests:", error);
    throw error;
  }

  return data || [];
};

// =====================================================
// ADMIN - APPROVE JOIN REQUEST
// =====================================================

export const approveJoinRequest = async (requestId) => {
  if (!requestId) {
    throw new Error("Request ID is required.");
  }

  const { data: request, error: requestError } = await supabase
    .from("shared_solar_join_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError) {
    throw requestError;
  }

  if (!request) {
    throw new Error("Joining request not found.");
  }

  if (request.status !== "pending") {
    throw new Error(
      "This joining request has already been processed."
    );
  }

  const {
    data: existingMember,
    error: memberCheckError,
  } = await supabase
    .from("shared_solar_members")
    .select("id")
    .eq("project_id", request.project_id)
    .eq("user_id", request.user_id)
    .maybeSingle();

  if (memberCheckError) {
    throw memberCheckError;
  }

  if (existingMember) {
    throw new Error(
      "This user is already a member of this project."
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("shared_solar_projects")
    .select(
      "id, target_members, current_members, total_capacity_kw, status"
    )
    .eq("id", request.project_id)
    .single();

  if (projectError) {
    throw projectError;
  }

  if (!project) {
    throw new Error("Project not found.");
  }

  const currentMembers = Number(project.current_members || 0);
  const targetMembers = Number(project.target_members || 0);

  if (
    targetMembers > 0 &&
    currentMembers >= targetMembers
  ) {
    throw new Error(
      "This project has already reached its target number of members."
    );
  }

  const energyAllocation = Number(
    request.estimated_energy_allocation || 0
  );

  if (energyAllocation <= 0) {
    throw new Error(
      "The joining request does not contain a valid energy allocation."
    );
  }

  // Calculate ownership based on the project's total capacity.
  // This avoids assigning 100% ownership to every member.
  const projectCapacityKwh =
    Number(project.total_capacity_kw || 0) * 30;

  let ownershipPercentage = 0;

  if (projectCapacityKwh > 0) {
    ownershipPercentage =
      (energyAllocation / projectCapacityKwh) * 100;
  }

  ownershipPercentage = Math.min(
    Math.max(ownershipPercentage, 0),
    100
  );

  const { data: member, error: memberError } = await supabase
    .from("shared_solar_members")
    .insert({
      project_id: request.project_id,
      user_id: request.user_id,
      ownership_percentage: Number(
        ownershipPercentage.toFixed(2)
      ),
      allocated_energy_kwh: energyAllocation,
      estimated_bill_saving: 0,
      lifetime_saving: 0,
    })
    .select()
    .single();

  if (memberError) {
    throw memberError;
  }

  const { error: updateError } = await supabase
    .from("shared_solar_join_requests")
    .update({
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    throw updateError;
  }

  await updateProjectAfterApproval(request.project_id);

  return member;
};

// =====================================================
// ADMIN - REJECT JOIN REQUEST
// =====================================================

export const rejectJoinRequest = async (requestId) => {
  if (!requestId) {
    throw new Error("Request ID is required.");
  }

  const { data, error } = await supabase
    .from("shared_solar_join_requests")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    console.error("Error rejecting join request:", error);
    throw error;
  }

  return data;
};

// =====================================================
// ADMIN - UPDATE PROJECT AFTER APPROVAL
// =====================================================

const updateProjectAfterApproval = async (projectId) => {
  const {
    data: approvedRequests,
    error: requestError,
  } = await supabase
    .from("shared_solar_join_requests")
    .select("contribution_commitment")
    .eq("project_id", projectId)
    .eq("status", "approved");

  if (requestError) {
    throw requestError;
  }

  const committedFund = (approvedRequests || []).reduce(
    (total, request) =>
      total +
      Number(request.contribution_commitment || 0),
    0
  );

  const currentMembers = approvedRequests?.length || 0;

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("shared_solar_projects")
    .select(
      "required_fund, target_members, status"
    )
    .eq("id", projectId)
    .single();

  if (projectError) {
    throw projectError;
  }

  const requiredFund = Number(
    project.required_fund || 0
  );

  let status = project.status;

  if (
    requiredFund > 0 &&
    committedFund >= requiredFund
  ) {
    status = "active";
  } else {
    status = "planning";
  }

  const { error: updateError } = await supabase
    .from("shared_solar_projects")
    .update({
      current_members: currentMembers,
      committed_fund: committedFund,
      status,
    })
    .eq("id", projectId);

  if (updateError) {
    throw updateError;
  }
};

// =====================================================
// ADMIN - GET PROJECT MEMBERS
// =====================================================

export const getProjectMembers = async (projectId) => {
  if (!projectId) {
    return [];
  }

  const { data, error } = await supabase
    .from("shared_solar_members")
    .select("*")
    .eq("project_id", projectId)
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("Error loading project members:", error);
    throw error;
  }

  return data || [];
};

// =====================================================
// ADMIN - UPDATE MEMBER ALLOCATION
// =====================================================

export const updateProjectMember = async (
  memberId,
  {
    ownershipPercentage,
    allocatedEnergyKwh,
    estimatedBillSaving,
    lifetimeSaving,
  }
) => {
  if (!memberId) {
    throw new Error("Member ID is required.");
  }

  const ownership = Number(ownershipPercentage);
  const energy = Number(allocatedEnergyKwh);
  const currentSaving = Number(estimatedBillSaving || 0);
  const lifetime = Number(lifetimeSaving || 0);

  if (!Number.isFinite(ownership) || ownership < 0 || ownership > 100) {
    throw new Error(
      "Ownership percentage must be between 0 and 100."
    );
  }

  if (!Number.isFinite(energy) || energy < 0) {
    throw new Error("Please enter valid allocated energy.");
  }

  if (!Number.isFinite(currentSaving) || currentSaving < 0) {
    throw new Error("Please enter a valid estimated saving.");
  }

  if (!Number.isFinite(lifetime) || lifetime < 0) {
    throw new Error("Please enter a valid lifetime saving.");
  }

  const { data, error } = await supabase
    .from("shared_solar_members")
    .update({
      ownership_percentage: ownership,
      allocated_energy_kwh: energy,
      estimated_bill_saving: currentSaving,
      lifetime_saving: lifetime,
    })
    .eq("id", memberId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project member:", error);
    throw error;
  }

  return data;
};

// =====================================================
// GET ALL SAVINGS RECORDS
// ADMIN
// =====================================================

export const getAllSavingsRecords = async (projectId = null) => {
  let query = supabase
    .from("shared_solar_savings")
    .select("*")
    .order("record_date", {
      ascending: false,
    });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Error loading all savings records:",
      error
    );

    throw error;
  }

  return data || [];
};
// =====================================================
// ADMIN - ADD SAVINGS RECORD
// =====================================================

export const addSavingsRecord = async ({
  memberId,
  recordDate,
  energyAllocatedKwh,
  estimatedSaving,
}) => {
  if (!memberId) {
    throw new Error("Member is required.");
  }

  const energy = Number(energyAllocatedKwh);
  const saving = Number(estimatedSaving);

  if (!recordDate) {
    throw new Error("Record date is required.");
  }

  if (!Number.isFinite(energy) || energy < 0) {
    throw new Error("Please enter valid allocated energy.");
  }

  if (!Number.isFinite(saving) || saving < 0) {
    throw new Error("Please enter a valid estimated saving.");
  }

  const { data, error } = await supabase
    .from("shared_solar_savings")
    .insert({
      member_id: memberId,
      record_date: recordDate,
      energy_allocated_kwh: energy,
      estimated_saving: saving,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding savings record:", error);
    throw error;
  }

  // Update member summary values
  const { data: member, error: memberError } = await supabase
    .from("shared_solar_members")
    .select("estimated_bill_saving, lifetime_saving")
    .eq("id", memberId)
    .single();

  if (memberError) {
    throw memberError;
  }

  const newCurrentSaving = saving;

  const newLifetimeSaving =
    Number(member.lifetime_saving || 0) + saving;

  await supabase
    .from("shared_solar_members")
    .update({
      estimated_bill_saving: newCurrentSaving,
      lifetime_saving: newLifetimeSaving,
    })
    .eq("id", memberId);

  return data;
};

// =====================================================
// ADMIN - UPDATE SAVINGS RECORD
// =====================================================

export const updateSavingsRecord = async (
  recordId,
  {
    recordDate,
    energyAllocatedKwh,
    estimatedSaving,
  }
) => {
  if (!recordId) {
    throw new Error("Savings record ID is required.");
  }

  const energy = Number(energyAllocatedKwh);
  const saving = Number(estimatedSaving);

  if (!recordDate) {
    throw new Error("Record date is required.");
  }

  if (!Number.isFinite(energy) || energy < 0) {
    throw new Error("Please enter valid allocated energy.");
  }

  if (!Number.isFinite(saving) || saving < 0) {
    throw new Error("Please enter a valid estimated saving.");
  }

  const { data, error } = await supabase
    .from("shared_solar_savings")
    .update({
      record_date: recordDate,
      energy_allocated_kwh: energy,
      estimated_saving: saving,
    })
    .eq("id", recordId)
    .select()
    .single();

  if (error) {
    console.error("Error updating savings record:", error);
    throw error;
  }

  return data;
};

// =====================================================
// ADMIN - DELETE SAVINGS RECORD
// =====================================================

export const deleteSavingsRecord = async (recordId) => {
  if (!recordId) {
    throw new Error("Savings record ID is required.");
  }

  const { error } = await supabase
    .from("shared_solar_savings")
    .delete()
    .eq("id", recordId);

  if (error) {
    console.error("Error deleting savings record:", error);
    throw error;
  }

  return true;
};