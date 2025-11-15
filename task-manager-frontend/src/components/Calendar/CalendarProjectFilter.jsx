function CalendarProjectFilter({ projects, selectedProjectId, onProjectChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        Proje Filtresi:
      </label>
      <div className="flex items-center gap-2 flex-1">
        <select
          value={selectedProjectId || ''}
          onChange={(e) => onProjectChange(e.target.value ? parseInt(e.target.value) : null)}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white sm:min-w-[200px] cursor-pointer transition"
        >
          <option value="">Tüm Projeler</option>
          {projects
            .filter(p => p.isActive)
            .map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
        </select>
        
        {selectedProjectId && (
          <button
            onClick={() => onProjectChange(null)}
            className="flex-shrink-0 p-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            title="Filtreyi temizle"
            aria-label="Filtreyi temizle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default CalendarProjectFilter;