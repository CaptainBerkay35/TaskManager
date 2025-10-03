function CalendarLegend() {
  const taskPriorities = [
    { color: 'bg-red-500', label: 'Acil' },
    { color: 'bg-orange-500', label: 'Yüksek' },
    { color: 'bg-blue-500', label: 'Orta' },
    { color: 'bg-green-500', label: 'Düşük' },
    { color: 'bg-gray-500', label: 'Tamamlandı' },
  ];

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        📋 Görev Öncelikleri:
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {taskPriorities.map((priority) => (
          <div key={priority.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${priority.color}`}></div>
            <span className="text-gray-700 dark:text-gray-300">{priority.label}</span>
          </div>
        ))}
      </div>
      
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">
        📁 Proje Deadline'ları:
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded border-2 border-purple-600 bg-purple-100 dark:bg-purple-900/20"></div>
          <span className="text-gray-700 dark:text-gray-300">Projeler (Kalın çerçeve ile gösterilir)</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarLegend;