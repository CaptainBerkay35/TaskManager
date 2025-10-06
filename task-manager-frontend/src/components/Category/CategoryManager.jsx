import { useState } from "react";
import { useCategoryManager } from "../../hooks/useCategoryManager";
import CategoryForm from "./CategoryForm";
import CategoryCard from "./CategoryCard";
import CategoryProjectsModal from "./CategoryProjectsModal";
import ConfirmDialog from "../ConfirmDialog";
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
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    categoryId: null,
    categoryName: '',
    projectCount: 0,
  });

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

  const handleViewProjects = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDeleteClick = (categoryIdOrObject) => {
    // ✅ FIX: Hem ID hem de obje kabul et
    let category;
    
    if (typeof categoryIdOrObject === 'number') {
      // ID gönderilmişse, categories array'inden bul
      category = categories.find(c => c.id === categoryIdOrObject);
    } else {
      // Obje gönderilmişse direkt kullan
      category = categoryIdOrObject;
    }

    if (!category) {
      console.error('Kategori bulunamadı!');
      return;
    }

    // Kategoriye bağlı proje sayısını hesapla
    const projectCount = category.projectCategories?.length || 0;

    setDeleteConfirm({
      show: true,
      categoryId: category.id,
      categoryName: category.name,
      projectCount: projectCount,
    });
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteCategory(deleteConfirm.categoryId);
    
    if (!result.success) {
      alert("Silme hatası: " + result.error);
    }

    setDeleteConfirm({
      show: false,
      categoryId: null,
      categoryName: '',
      projectCount: 0,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      show: false,
      categoryId: null,
      categoryName: '',
      projectCount: 0,
    });
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
              onDelete={handleDeleteClick}
              onViewProjects={handleViewProjects}
            />
          ))}
        </div>
      )}

      {/* Category Projects Modal */}
      {showModal && selectedCategory && (
        <CategoryProjectsModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Kategoriyi Sil"
        message={
          deleteConfirm.projectCount > 0
            ? `"${deleteConfirm.categoryName}" kategorisini silmek istediğinizden emin misiniz?\n\n⚠️ Bu kategoriye bağlı ${deleteConfirm.projectCount} proje var!\n\nKategoriyi silebilmek için önce bu projeleri silmeniz veya başka bir kategoriye taşımanız gerekir.`
            : `"${deleteConfirm.categoryName}" kategorisini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`
        }
        confirmText={deleteConfirm.projectCount > 0 ? "Anladım" : "Sil"}
        cancelText="İptal"
        onConfirm={deleteConfirm.projectCount > 0 ? handleDeleteCancel : handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default CategoryManager;