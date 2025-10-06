import { useDashboardData } from '../../hooks/useDashboardData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import StatCard from './StatCard';
import ProjectProgressList from './ProjectProgressList';
import CategoryDistribution from './CategoryDistribution';
import DeadlineAlerts from './DeadlineAlerts';
import MiniCalendar from '../Calendar/MiniCalendar';
import { useEffect } from 'react';

function Dashboard() {
  const { tasks, projects, categories, loading, error } = useDashboardData();
  const stats = useDashboardStats(tasks, projects, categories);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Proje Dashboard</h2>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Proje"
          value={stats.totalProjects}
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatCard
          title="Aktif Proje"
          value={stats.activeProjects}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        <StatCard
          title="Tamamlanan"
          value={stats.completedProjects}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />

        <StatCard
          title="Görev Tamamlanma"
          value={`${stats.completionRate}%`}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Proje İlerleme, Kategori Dağılımı ve Mini Takvim */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectProgressList 
          projects={stats.projectsWithTaskCount}
          title="En Çok Görevli Projeler"
        />
        <CategoryDistribution 
          categories={stats.projectsByCategory}
          totalProjects={stats.totalProjects}
        />
        <MiniCalendar />
      </div>

      {/* Gecikmiş ve Yaklaşan Deadline'lar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeadlineAlerts 
          projects={stats.overdueProjects}
          tasks={tasks}
          type="overdue"
        />
        <DeadlineAlerts 
          projects={stats.upcomingDeadlines}
          tasks={tasks}
          type="upcoming"
        />
      </div>
    </div>
  );
}

export default Dashboard;