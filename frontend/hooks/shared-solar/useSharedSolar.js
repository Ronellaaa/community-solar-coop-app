import { useCallback, useEffect, useState } from "react";

import {
  getSharedSolarProjects,
  getSharedSolarProject,
  getMyMembership,
  getEnergyRecords,
  getMySavingsHistory,
} from "../../services/sharedSolarService";


export const useSharedSolar = (projectId = null) => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [membership, setMembership] = useState(null);
  const [energyRecords, setEnergyRecords] = useState([]);
  const [savingsHistory, setSavingsHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Load all solar projects
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSharedSolarProjects();

      setProjects(data || []);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  // Load one project's complete information
  const loadProjectData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        projectData,
        membershipData,
        energyData,
        savingsData,
      ] = await Promise.all([
        getSharedSolarProject(projectId),
        getMyMembership(projectId),
        getEnergyRecords(projectId),
        getMySavingsHistory(projectId),
      ]);

      setProject(projectData);
      setMembership(membershipData);
      setEnergyRecords(energyData || []);
      setSavingsHistory(savingsData || []);

    } catch (err) {
      console.error("Error loading project data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);


  // Decide what data to load
  useEffect(() => {
    if (projectId) {
      loadProjectData();
    } else {
      loadProjects();
    }
  }, [projectId, loadProjectData, loadProjects]);


  return {
    projects,
    project,
    membership,
    energyRecords,
    savingsHistory,

    loading,
    error,

    refreshProjects: loadProjects,
    refreshProject: loadProjectData,
  };
};