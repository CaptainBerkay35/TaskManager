import { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI, projectsAPI } from '../../services/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes, categoriesRes] = await Promise.all([
        tasksAPI.getAll(),
        projectsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Veri yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Genel görev istatistikleri
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
  const projectsWithTaskCount = projects.map(p => ({
    ...p,
    taskCount: tasks.filter(t => t.projectId === p.id).length,
    completedCount: tasks.filter(t => t.projectId === p.id && t.status === 'Tamamlandı').length
  })).filter(p => p.taskCount > 0).sort((a, b) => b.taskCount - a.taskCount).slice(0, 5);

  // Proje kategorileri dağılımı
  const projectsByCategory = categories.map(cat => ({
    ...cat,
    projectCount: projects.filter(p => p.categoryId === cat.id).length
  })).filter(c => c.projectCount > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Proje Dashboard</h2>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Proje</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Proje</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Görev Tamamlanma</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* En Çok Görevli Projeler */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">En Çok Görevli Projeler</h3>
          <div className="space-y-3">
            {projectsWithTaskCount.map((project) => {
              const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;
              return (
                <div key={project.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{project.name}</span>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {project.completedCount}/{project.taskCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {projectsWithTaskCount.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Henüz görevli proje yok</p>
            )}
          </div>
        </div>

        {/* Kategori Dağılımı */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Proje Kategori Dağılımı</h3>
          <div className="space-y-3">
            {projectsByCategory.map((category) => (
              <div key={category.id}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{category.projectCount}</span>
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
            {projectsByCategory.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Kategorili proje yok</p>
            )}
          </div>
        </div>
      </div>

      {/* Gecikmiş ve Yaklaşan Deadline'lar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gecikmiş Projeler */}
        {overdueProjects.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
              Gecikmiş Projeler ({overdueProjects.length})
            </h3>
            <div className="space-y-2">
              {overdueProjects.slice(0, 5).map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const completedCount = projectTasks.filter(t => t.status === 'Tamamlandı').length;
                return (
                  <div key={project.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-red-200 dark:border-red-700">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <p className="font-medium text-gray-800 dark:text-gray-200">{project.name}</p>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Deadline: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {completedCount}/{projectTasks.length} görev tamamlandı
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Yaklaşan Deadline'lar */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
              Yaklaşan Deadline'lar ({upcomingDeadlines.length})
            </h3>
            <div className="space-y-2">
              {upcomingDeadlines.slice(0, 5).map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const completedCount = projectTasks.filter(t => t.status === 'Tamamlandı').length;
                const daysLeft = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={project.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <p className="font-medium text-gray-800 dark:text-gray-200">{project.name}</p>
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {daysLeft === 0 ? 'Bugün' : daysLeft === 1 ? 'Yarın' : `${daysLeft} gün kaldı`}
                      {' - '}
                      {new Date(project.deadline).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {completedCount}/{projectTasks.length} görev tamamlandı
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;