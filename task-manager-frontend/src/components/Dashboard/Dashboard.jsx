import { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../../services/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, categoriesRes] = await Promise.all([
        tasksAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setTasks(tasksRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Veri yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  // İstatistik hesaplamaları
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Tamamlandı').length;
  const inProgressTasks = tasks.filter(t => t.status === 'Devam Ediyor').length;
  const pendingTasks = tasks.filter(t => t.status === 'Bekliyor').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Öncelik dağılımı
  const priorityStats = {
    acil: tasks.filter(t => t.priority === 4).length,
    yuksek: tasks.filter(t => t.priority === 3).length,
    orta: tasks.filter(t => t.priority === 2).length,
    dusuk: tasks.filter(t => t.priority === 1).length,
  };

  // Vadesi yaklaşan görevler (7 gün içinde)
  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Tamamlandı') return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Geciken görevler
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Tamamlandı') return false;
    return new Date(t.dueDate) < new Date();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Görev</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Devam Eden</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{inProgressTasks}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanma</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Öncelik Dağılımı */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Öncelik Dağılımı</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Acil</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{priorityStats.acil}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 dark:bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (priorityStats.acil / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Yüksek</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{priorityStats.yuksek}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-500 dark:bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (priorityStats.yuksek / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Orta</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{priorityStats.orta}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 dark:bg-yellow-600 h-2 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (priorityStats.orta / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Düşük</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{priorityStats.dusuk}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 dark:bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${totalTasks > 0 ? (priorityStats.dusuk / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kategorilere Göre Dağılım */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50 border border-transparent dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Kategori Dağılımı</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{category.tasks?.length || 0}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${totalTasks > 0 ? ((category.tasks?.length || 0) / totalTasks) * 100 : 0}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geciken ve Yaklaşan Görevler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geciken Görevler */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
              Geciken Görevler ({overdueTasks.length})
            </h3>
            <div className="space-y-2">
              {overdueTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-red-200 dark:border-red-700">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Bitiş Tarihi: {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vadesi Yaklaşan Görevler */}
        {upcomingTasks.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
              Yaklaşan Görevler ({upcomingTasks.length})
            </h3>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-yellow-200 dark:border-yellow-700">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Bitiş Tarihi: {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;