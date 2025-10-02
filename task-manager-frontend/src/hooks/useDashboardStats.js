import { useMemo } from 'react';

export function useDashboardStats(tasks, projects, categories) {
  const stats = useMemo(() => {
    // Proje istatistikleri
    const totalProjects = projects.length;
    
    const activeProjects = projects.filter(p => {
      const hasTasks = tasks.filter(t => t.projectId === p.id).length > 0;
      return hasTasks;
    }).length;
    
    const completedProjects = projects.filter(p => {
      const projectTasks = tasks.filter(t => t.projectId === p.id);
      if (projectTasks.length === 0) return false;
      return projectTasks.every(t => t.status === 'Tamamlandı');
    }).length;

    // Görev istatistikleri
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Tamamlandı').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Deadline yaklaşan projeler (7 gün içinde)
    const upcomingDeadlines = projects.filter(p => {
      if (!p.deadline) return false;
      const deadline = new Date(p.deadline);
      const today = new Date();
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Gecikmiş projeler
    const overdueProjects = projects.filter(p => {
      if (!p.deadline) return false;
      const projectTasks = tasks.filter(t => t.projectId === p.id);
      const isCompleted = projectTasks.length > 0 && projectTasks.every(t => t.status === 'Tamamlandı');
      return new Date(p.deadline) < new Date() && !isCompleted;
    });

    // En çok görevli projeler
    const projectsWithTaskCount = projects
      .map(p => ({
        ...p,
        taskCount: tasks.filter(t => t.projectId === p.id).length,
        completedCount: tasks.filter(t => t.projectId === p.id && t.status === 'Tamamlandı').length
      }))
      .filter(p => p.taskCount > 0)
      .sort((a, b) => b.taskCount - a.taskCount)
      .slice(0, 5);

    // Kategori dağılımı
    const projectsByCategory = categories
      .map(cat => ({
        ...cat,
        projectCount: projects.filter(p => p.categoryId === cat.id).length
      }))
      .filter(c => c.projectCount > 0);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      completionRate,
      upcomingDeadlines,
      overdueProjects,
      projectsWithTaskCount,
      projectsByCategory,
    };
  }, [tasks, projects, categories]);

  return stats;
}