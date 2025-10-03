import { useState, useEffect, useCallback } from 'react';
import { projectsAPI, categoriesAPI } from '../services/api';

export function useProjectManager() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      return response.data; // ✅ Return the fresh data
    } catch (err) {
      console.error("Projeler yüklenemedi:", err);
      setError("Projeler yüklenirken bir hata oluştu");
      return []; // Return empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    try {
      const dataToSend = {
        ...projectData,
        deadline: projectData.deadline || null,
      };
      
      await projectsAPI.create(dataToSend);
      await fetchProjects();
      return { success: true };
    } catch (err) {
      console.error("Proje oluşturulamadı:", err);
      return { success: false, error: err.response?.data || err.message };
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (id, projectData) => {
    try {
      await projectsAPI.update(id, { ...projectData, id });
      await fetchProjects();
      return { success: true };
    } catch (err) {
      console.error("Proje güncellenemedi:", err);
      return { success: false, error: err.response?.data || err.message };
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id) => {
    try {
      const response = await projectsAPI.delete(id);
      await fetchProjects();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Proje silinemedi:", err);
      return { success: false, error: err.message };
    }
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, [fetchProjects, fetchCategories]);

  return {
    projects,
    categories,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects, // Now returns fresh data
  };
}