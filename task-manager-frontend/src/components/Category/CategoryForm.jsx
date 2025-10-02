import { useState } from 'react';

function CategoryForm({ editingCategory, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: editingCategory?.name || "",
    color: editingCategory?.color || "#3B82F6"
  });

  const colorPresets = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kategori Adı
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Örn: İş, Kişisel, Spor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    ? "border-gray-800 dark:border-gray-200 scale-110"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer bg-white dark:bg-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            {editingCategory ? "Güncelle" : "Oluştur"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;