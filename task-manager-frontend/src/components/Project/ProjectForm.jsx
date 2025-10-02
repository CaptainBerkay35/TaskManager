import { useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import MultiSelectCategories from '../Category/MultiSelectCategories';

function ProjectForm({ 
  editingProject, 
  categories, 
  onSubmit, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: editingProject?.name || "",
    description: editingProject?.description || "",
    color: editingProject?.color || "#6366f1",
    deadline: editingProject?.deadline ? editingProject.deadline.split("T")[0] : "",
    categoryIds: editingProject?.categories ? editingProject.categories.map(c => c.id) : [],
  });

  const colorPresets = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.categoryIds || formData.categoryIds.length === 0) {
      alert('Lütfen en az 1 kategori seçin!');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {editingProject ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Proje Adı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Proje Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Mobil Uygulama Projesi"
          />
        </div>

        {/* Kategoriler */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kategoriler <span className="text-red-500">*</span> (En az 1 tane)
          </label>
          {categories.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Proje oluşturmak için önce kategori oluşturmalısınız.
              </p>
            </div>
          ) : (
            <MultiSelectCategories
              categories={categories}
              selectedIds={formData.categoryIds}
              onChange={(ids) => setFormData({ ...formData, categoryIds: ids })}
              required={true}
            />
          )}
        </div>

        {/* Açıklama - RichTextEditor */}
        <RichTextEditor
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          label="Açıklama"
          placeholder="Proje hakkında detaylı açıklama&#10;&#10;"
          rows={5}
          showCharCount={true}
          maxLength={3000}
          id="project-description-editor"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Renk Seçimi */}
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

          {/* Son Teslim Tarihi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Son Teslim Tarihi
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={categories.length === 0}
            className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {editingProject ? "Güncelle" : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;