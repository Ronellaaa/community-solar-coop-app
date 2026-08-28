import { useCallback, useEffect, useState } from "react";

import {
  getSharedSolarProjects,
  getSharedSolarProject,
  getMyMembership,
  getEnergyRecords,
  getMySavingsHistory,
  getMyJoinRequest,
} from "../../services/sharedSolarService";

export const useSharedSolar = (projectId = null) => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);

  // Approved membership
  const [membership, setMembership] = useState(null);

  // Joining request
  const [joinRequest, setJoinRequest] = useState(null);

  const [energyRecords, setEnergyRecords] = useState([]);
  const [savingsHistory, setSavingsHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================
  // LOAD ALL SHARED SOLAR PROJECTS
  // =====================================================

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSharedSolarProjects();

      setProjects(data || []);
    } catch (err) {
      console.error(
        "Error loading shared solar projects:",
        err
      );

      setError(
        err?.message ||
          "Unable to load shared solar projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // LOAD ONE PROJECT
  // =====================================================

  const loadProjectData = useCallback(async () => {
    if (!projectId) {
      setProject(null);
      setMembership(null);
      setJoinRequest(null);
      setEnergyRecords([]);
      setSavingsHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First load the project.
      // This is important because if the project does not
      // exist, we do not need to continue loading everything.
      const projectData =
        await getSharedSolarProject(projectId);

      setProject(projectData);

      // Load user-specific data separately.
      // Promise.all is still used, but each function is
      // responsible for returning null/[] when appropriate.
      const [
        membershipData,
        joinRequestData,
        energyData,
        savingsData,
      ] = await Promise.all([
        getMyMembership(projectId),
        getMyJoinRequest(projectId),
        getEnergyRecords(projectId),
        getMySavingsHistory(projectId),
      ]);

      // IMPORTANT:
      // Do not use membershipData.id directly.
      // It can be null when the user is not an approved member.
      setMembership(membershipData || null);

      setJoinRequest(joinRequestData || null);

      setEnergyRecords(energyData || []);

      setSavingsHistory(savingsData || []);
    } catch (err) {
      console.error(
        "Error loading shared solar project data:",
        err
      );

      setProject(null);
      setMembership(null);
      setJoinRequest(null);
      setEnergyRecords([]);
      setSavingsHistory([]);

      setError(
        err?.message ||
          "Unable to load project details."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // =====================================================
  // REFRESH PROJECT
  // =====================================================

  const refreshProject = useCallback(async () => {
    await loadProjectData();
  }, [loadProjectData]);

  // =====================================================
  // LOAD DATA WHEN PROJECT ID CHANGES
  // =====================================================

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    } else {
      loadProjects();
    }
  }, [
    projectId,
    loadProjectData,
    loadProjects,
  ]);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    // All projects
    projects,

    // Current project
    project,

    // Approved membership
    membership,

    // User's join request
    joinRequest,

    // Energy information
    energyRecords,

    // Savings information
    savingsHistory,

    // State
    loading,
    error,

    // Refresh functions
    refreshProjects: loadProjects,
    refreshProject,
  };
};