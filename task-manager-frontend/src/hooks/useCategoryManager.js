import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../services/api';

export function useCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
      setError("Kategoriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData) => {
    try {
      await categoriesAPI.create(categoryData);
      await fetchCategories();
      return { success: true };
    } catch (err) {
      console.error("Kategori oluşturulamadı:", err);
      return { success: false, error: err.message };
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      await categoriesAPI.update(id, { ...categoryData, id });
      await fetchCategories();
      return { success: true };
    } catch (err) {
      console.error("Kategori güncellenemedi:", err);
      return { success: false, error: err.message };
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoriesAPI.delete(id);
      await fetchCategories();
      return { success: true };
    } catch (err) {
      console.error("Kategori silinemedi:", err);
      return { success: false, error: err.message };
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}