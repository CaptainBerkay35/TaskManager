function CalendarHeader({ onNewTask }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          📅 Takvim Görünümü
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Görevlerinizi ve proje deadline'larınızı takvimde görüntüleyin
        </p>
      </div>
      <button
        onClick={onNewTask}
        className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
      >
        + Yeni Görev
      </button>
    </div>
  );
}

export default CalendarHeader;