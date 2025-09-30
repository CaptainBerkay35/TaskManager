import { useState, useEffect } from "react";
import { categoriesAPI } from "../../services/api";
import CategoryTasksModal from "./CategoryTasksModal";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", color: "#3B82F6" });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTasks, setCategoryTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleViewTasks = async (category) => {
    setSelectedCategory(category);
    setShowModal(true);

    // Kategori görevlerini çek
    const tasksInCategory = category.tasks || [];
    setCategoryTasks(tasksInCategory);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, {
          ...formData,
          id: editingCategory.id,
        });
      } else {
        await categoriesAPI.create(formData);
      }
      fetchCategories();
      resetForm();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color || "#3B82F6" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      await categoriesAPI.delete(id);
      fetchCategories();
    } catch (err) {
      alert("Silme hatası: Kategoriye ait herhangi bir görev bulunmamalı!");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", color: "#3B82F6" });
    setEditingCategory(null);
    setShowForm(false);
  };

  const colorPresets = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Kategoriler</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {showForm ? "İptal" : "+ Yeni Kategori"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Adı
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Örn: İş, Kişisel, Spor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renk Seç
              </label>
              <div className="flex gap-2 flex-wrap mb-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg border-2 transition ${
                      formData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {editingCategory ? "Güncelle" : "Oluştur"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-lg shadow border-l-4 hover:shadow-md transition"
            style={{ borderLeftColor: category.color }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <button
                    onClick={() => handleViewTasks(category)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {category.tasks?.length || 0} görev
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-gray-400 hover:text-indigo-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Henüz kategori yok. Yeni kategori ekleyin!
          </p>
        </div>
      )}
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
