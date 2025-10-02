function DeadlineAlerts({ projects, tasks, type = "upcoming" }) {
  const isOverdue = type === "overdue";
  const bgColor = isOverdue 
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
  
  const titleColor = isOverdue
    ? "text-red-800 dark:text-red-400"
    : "text-yellow-800 dark:text-yellow-400";
  
  const borderColor = isOverdue
    ? "border-red-200 dark:border-red-700"
    : "border-yellow-200 dark:border-yellow-700";
  
  const textColor = isOverdue
    ? "text-red-600 dark:text-red-400"
    : "text-yellow-600 dark:text-yellow-400";

  const title = isOverdue 
    ? `Gecikmiş Projeler (${projects.length})`
    : `Yaklaşan Deadline'lar (${projects.length})`;

  if (projects.length === 0) return null;

  return (
    <div className={`${bgColor} border p-6 rounded-lg`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-4`}>{title}</h3>
      <div className="space-y-2">
        {projects.slice(0, 5).map((project) => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const completedCount = projectTasks.filter(t => t.status === 'Tamamlandı').length;
          const daysLeft = isOverdue 
            ? null 
            : Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));

          return (
            <div key={project.id} className={`bg-white dark:bg-gray-800 p-3 rounded border ${borderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                <p className="font-medium text-gray-800 dark:text-gray-200">{project.name}</p>
              </div>
              <p className={`text-xs ${textColor}`}>
                {isOverdue ? (
                  `Deadline: ${new Date(project.deadline).toLocaleDateString('tr-TR')}`
                ) : (
                  <>
                    {daysLeft === 0 ? 'Bugün' : daysLeft === 1 ? 'Yarın' : `${daysLeft} gün kaldı`}
                    {' - '}
                    {new Date(project.deadline).toLocaleDateString('tr-TR')}
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completedCount}/{projectTasks.length} görev tamamlandı
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeadlineAlerts;