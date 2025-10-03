function CalendarStats({ tasks, projects, selectedProjectId, currentMonth }) {
  // Proje seçiliyse görevleri filtrele
  let filteredTasks = selectedProjectId 
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : tasks;

  let filteredProjects = selectedProjectId
    ? projects.filter(p => p.id === selectedProjectId)
    : projects;

  // Aya göre filtrele
  if (currentMonth) {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

    // Görevleri dueDate'e göre filtrele
    filteredTasks = filteredTasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= monthStart && dueDate <= monthEnd;
    });

    // Projeleri deadline'a göre filtrele
    filteredProjects = filteredProjects.filter(p => {
      if (!p.deadline) return false;
      const deadline = new Date(p.deadline);
      return deadline >= monthStart && deadline <= monthEnd;
    });
  }

  const stats = [
    {
      label: 'Toplam Görev',
      value: filteredTasks.length,
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-700 dark:text-indigo-300',
    },
    {
      label: 'Proje Deadline',
      value: filteredProjects.filter(p => p.isActive).length,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      label: 'Tamamlanan',
      value: filteredTasks.filter(t => t.isCompleted).length,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-700 dark:text-green-300',
    },
    {
      label: 'Tamamlanmamış',
      value: filteredTasks.filter(t => !t.isCompleted).length,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      valueColor: 'text-orange-700 dark:text-orange-300',
    },
  ];

  return (
    <div className="mt-4 space-y-2">
      {currentMonth && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          İstatistikler: {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} p-3 rounded-lg`}>
            <div className={`text-xs ${stat.textColor}`}>{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.valueColor}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarStats;