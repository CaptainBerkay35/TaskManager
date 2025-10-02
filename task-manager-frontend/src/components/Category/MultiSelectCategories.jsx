import { useState } from 'react';

function MultiSelectCategories({ categories, selectedIds, onChange, required = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (categoryId) => {
    if (selectedIds.includes(categoryId)) {
      // Son kategoriyi silmeye çalışıyorsa ve required ise engelle
      if (required && selectedIds.length === 1) {
        alert('En az 1 kategori seçili olmalıdır!');
        return;
      }
      onChange(selectedIds.filter(id => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  const removeCategory = (categoryId, e) => {
    e.stopPropagation();
    if (required && selectedIds.length === 1) {
      alert('En az 1 kategori seçili olmalıdır!');
      return;
    }
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
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Henüz kategori yok
              </div>
            ) : (
              categories.map((cat) => {
                const isSelected = selectedIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-4 py-2 cursor-pointer transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Category Color & Name */}
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-gray-800 dark:text-white">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MultiSelectCategories;