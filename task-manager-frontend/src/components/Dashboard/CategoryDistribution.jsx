function CategoryDistribution({ categories, totalProjects }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Proje Kategori Dağılımı
      </h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {category.projectCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${totalProjects > 0 ? (category.projectCount / totalProjects) * 100 : 0}%`,
                  backgroundColor: category.color
                }}
              />
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Kategorili proje yok
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryDistribution;