function CategoryCard({ category, onEdit, onDelete, onViewTasks }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-900/50 border-l-4 hover:shadow-md transition"
      style={{ borderLeftColor: category.color }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {category.name}
            </h3>
            <button
              onClick={() => onViewTasks(category)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
            >
              {category.tasks?.length || 0} görev
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            title="Düzenle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
            title="Sil"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}

export default CategoryCard;