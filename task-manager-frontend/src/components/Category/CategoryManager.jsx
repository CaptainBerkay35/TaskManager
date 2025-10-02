import { useState } from "react";
import { useCategoryManager } from "../../hooks/useCategoryManager";
import CategoryForm from "./CategoryForm";
import CategoryCard from "./CategoryCard";
import CategoryTasksModal from "./CategoryTasksModal";
import { EmptyCategoriesState, LoadingState } from "./CategoryEmptyState";

function CategoryManager() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryManager();

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTasks, setCategoryTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Handlers
  const handleFormSubmit = async (formData) => {
    const result = editingCategory
      ? await updateCategory(editingCategory.id, formData)
      : await createCategory(formData);

    if (result.success) {
      handleFormCancel();
    } else {
      alert("Hata: " + result.error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleViewTasks = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    setCategoryTasks(category.tasks || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    const result = await deleteCategory(id);
    
    if (!result.success) {
      alert("Silme hatası: Kategoriye ait herhangi bir görev bulunmamalı!");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Kategoriler
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
        >
          {showForm ? "İptal" : "+ Yeni Kategori"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <CategoryForm
          editingCategory={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Category Grid / Empty State */}
      {categories.length === 0 ? (
        <EmptyCategoriesState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewTasks={handleViewTasks}
            />
          ))}
        </div>
      )}

      {/* Tasks Modal */}
      {showModal && selectedCategory && (
        <CategoryTasksModal
          category={selectedCategory}
          tasks={categoryTasks}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default CategoryManager;