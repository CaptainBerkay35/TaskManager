function TaskFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Mobile: Başlık */}
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:hidden">
        Filtreler
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Arama */}
        <div className="w-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Ara
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Görev ara..."
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition"
          />
        </div>

        {/* Durum Filtresi */}
        <div className="w-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Durum
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition appearance-none cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="Bekliyor">Bekliyor</option>
            <option value="Devam Ediyor">Devam Ediyor</option>
            <option value="Tamamlandı">Tamamlandı</option>
          </select>
        </div>

        {/* Öncelik Filtresi */}
        <div className="w-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Öncelik
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition appearance-none cursor-pointer"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="1">Düşük</option>
            <option value="2">Orta</option>
            <option value="3">Yüksek</option>
            <option value="4">Acil</option>
          </select>
        </div>

        {/* Sıralama */}
        <div className="w-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Sıralama
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition appearance-none cursor-pointer"
          >
            <option value="createdDate">Eklenme Tarihi (Yeni → Eski)</option>
            <option value="createdDateOld">Eklenme Tarihi (Eski → Yeni)</option>
            <option value="dueDate">Son Tarih (Yakın → Uzak)</option>
            <option value="dueDateFar">Son Tarih (Uzak → Yakın)</option>
            <option value="priority">Öncelik (Yüksek → Düşük)</option>
            <option value="priorityLow">Öncelik (Düşük → Yüksek)</option>
            <option value="title">Başlık (A → Z)</option>
            <option value="titleDesc">Başlık (Z → A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TaskFilters;