import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';

export function useTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
    } catch (err) {
      console.error("Görevler yüklenemedi:", err);
      setError("Görevler yüklenirken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.delete(id);
      await fetchTasks();
      return { success: true };
    } catch (err) {
      console.error("Görev silinemedi:", err);
      return { success: false, error: err.message };
    }
  }, [fetchTasks]);

  const toggleComplete = useCallback(async (task) => {
    try {
      const updatedTask = {
        ...task,
        isCompleted: !task.isCompleted,
        status: !task.isCompleted ? "Tamamlandı" : "Devam Ediyor",
        completedDate: !task.isCompleted ? new Date().toISOString() : null,
      };
      await tasksAPI.update(task.id, updatedTask);
      await fetchTasks();
      return { success: true };
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      return { success: false, error: err.message };
    }
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (task, newStatus) => {
    try {
      const updatedTask = {
        ...task,
        status: newStatus,
        isCompleted: newStatus === "Tamamlandı",
        completedDate: newStatus === "Tamamlandı" ? new Date().toISOString() : null,
      };
      await tasksAPI.update(task.id, updatedTask);
      await fetchTasks();
      return { success: true };
    } catch (err) {
      console.error("Durum güncelleme hatası:", err);
      return { success: false, error: err.message };
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    deleteTask,
    toggleComplete,
    updateTaskStatus,
    refetch: fetchTasks,
  };
}