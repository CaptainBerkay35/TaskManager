import { useState } from 'react';

function MultiSelectCategories({ categories, selectedIds, onChange, required = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (categoryId) => {
    if (selectedIds.includes(categoryId)) {
      // ✅ FIX: Sadece submit sırasında kontrol et, seçim sırasında değil
      onChange(selectedIds.filter(id => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  const removeCategory = (categoryId, e) => {
    e.stopPropagation();
    // ✅ FIX: Uyarı kaldırıldı - kullanıcı istediği gibi değiştirebilir
    onChange(selectedIds.filter(id => id !== categoryId));
  };

  const selectedCategories = categories.filter(cat => selectedIds.includes(cat.id));

  return (
    <div className="relative">
      {/* Selected Categories Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition"
      >
        {selectedCategories.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500">
            Kategori seçin {required && <span className="text-red-500">*</span>}
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: cat.color + '20',
                  color: cat.color,
                }}
              >
                {cat.name}
                <button
                  onClick={(e) => removeCategory(cat.id, e)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Options */}
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                Henüz kategori yok
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition ${
                    selectedIds.includes(cat.id) ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(cat.id)}
                    onChange={() => {}} // Handled by parent onClick
                    className="w-4 h-4 text-indigo-600 dark:text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {cat.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MultiSelectCategories;