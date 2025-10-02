export function EmptyCategoriesState() {
  return (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-transparent dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-400">
        Henüz kategori yok. Yeni kategori ekleyin!
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
      Yükleniyor...
    </div>
  );
}