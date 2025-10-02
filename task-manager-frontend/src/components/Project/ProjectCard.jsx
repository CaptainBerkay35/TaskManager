function ProjectCard({ project, onEdit, onDelete, onClick }) {
  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition border-l-4 cursor-pointer"
      style={{ borderLeftColor: project.color }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {project.name}
            </h3>
          </div>
          
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: cat.color + "20",
                    color: cat.color,
                  }}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
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

      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {project.tasks?.length || 0} görev
        </span>
        {project.deadline && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(project.deadline).toLocaleDateString("tr-TR")}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;