function TaskFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  // filterCategory ve setFilterCategory KALDIRILDI
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Arama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Görev ara..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        {/* Durum Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="all">Tümü</option>
            <option value="Bekliyor">Bekliyor</option>
            <option value="Devam Ediyor">Devam Ediyor</option>
            <option value="Tamamlandı">Tamamlandı</option>
          </select>
        </div>

        {/* Öncelik Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Öncelik
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="all">Tümü</option>
            <option value="1">Düşük</option>
            <option value="2">Orta</option>
            <option value="3">Yüksek</option>
            <option value="4">Acil</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TaskFilters;