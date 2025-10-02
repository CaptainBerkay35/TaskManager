import { useState, useEffect, useCallback } from 'react';
import { tasksAPI, categoriesAPI, projectsAPI } from '../services/api';

export function useDashboardData() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksRes, projectsRes, categoriesRes] = await Promise.all([
        tasksAPI.getAll(),
        projectsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Veri yüklenemedi:', err);
      setError('Dashboard verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    tasks,
    projects,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
}