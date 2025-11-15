function ProjectFilters({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  categories,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Mobile: Başlık */}
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:hidden">
        Filtreler
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Arama */}
        <div className="w-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Proje Ara
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Proje ara..."
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition"
          />
        </div>

        {/* Kategori Filtresi */}
        <div className="w-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Kategori
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition appearance-none cursor-pointer"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sıralama */}
        <div className="w-full sm:col-span-2 md:col-span-1">
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
            <option value="deadline">Son Tarih (Yakın → Uzak)</option>
            <option value="deadlineFar">Son Tarih (Uzak → Yakın)</option>
            <option value="name">Proje Adı (A → Z)</option>
            <option value="nameDesc">Proje Adı (Z → A)</option>
            <option value="taskCount">Görev Sayısı (Çok → Az)</option>
            <option value="taskCountLow">Görev Sayısı (Az → Çok)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProjectFilters;