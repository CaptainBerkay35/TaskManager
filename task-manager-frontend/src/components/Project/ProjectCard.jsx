import DescriptionRenderer from "../DescriptionRenderer";

// components/Project/ProjectCard.jsx
function ProjectCard({ project, onEdit, onDelete, onClick }) {
  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg transition border-l-4 cursor-pointer touch-manipulation"
      style={{ borderLeftColor: project.color }}
    >
      {/* ✅ Header - Mobilde dikey stack, desktop'ta yatay */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            {/* ✅ Responsive text boyutu */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">
              {project.name}
            </h3>
          </div>

          {/* ✅ Categories - Mobilde wrap */}
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

        {/* ✅ Action Buttons - Mobilde daha büyük */}
        <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition touch-manipulation"
            title="Düzenle"
            aria-label="Düzenle"
          >
            <svg
              className="w-6 h-6 sm:w-5 sm:h-5"
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition touch-manipulation"
            title="Sil"
            aria-label="Sil"
          >
            <svg
              className="w-6 h-6 sm:w-5 sm:h-5"
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

      {project.description && (
        <div className="mb-3">
          <DescriptionRenderer
            text={project.description}
            maxLines={3} 
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      )}

      {/* ✅ Footer - Mobilde dikey stack, desktop'ta yatay */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          {project.tasks?.length || 0} görev
        </span>
        {project.deadline && (
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(project.deadline).toLocaleDateString("tr-TR")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
