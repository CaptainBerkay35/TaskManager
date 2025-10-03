function CalendarProjectFilter({ projects, selectedProjectId, onProjectChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Proje Filtresi:
      </label>
      <select
        value={selectedProjectId || ''}
        onChange={(e) => onProjectChange(e.target.value ? parseInt(e.target.value) : null)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-w-[200px]"
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
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
          title="Filtreyi temizle"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default CalendarProjectFilter;