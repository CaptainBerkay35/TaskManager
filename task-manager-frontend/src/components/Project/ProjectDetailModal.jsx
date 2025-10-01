import { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../../services/api';
import TaskCard from '../Task/TaskCard';

function ProjectDetailModal({ project, onClose, onTaskUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    categoryId: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchProjectTasks();
    fetchCategories();
  }, [project.id]);

  const fetchProjectTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      const projectTasks = response.data.filter(task => task.projectId === project.id);
      setTasks(projectTasks);
    } catch (err) {
      console.error('Görevler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Kategoriler yüklenemedi:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Lütfen kategori seçin!');
      return;
    }

    try {
      const taskData = {
        ...formData,
        projectId: project.id,
        status: 'Devam Ediyor',
        categoryId: parseInt(formData.categoryId),
        dueDate: formData.dueDate || null,
      };

      await tasksAPI.create(taskData);
      setFormData({ title: '', description: '', priority: 2, categoryId: '', dueDate: '' });
      setShowTaskForm(false);
      fetchProjectTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`"${task.title}" görevini silmek istediğinizden emin misiniz?`)) {
      try {
        await tasksAPI.delete(task.id);
        fetchProjectTasks();
        if (onTaskUpdate) onTaskUpdate();
      } catch (err) {
        alert('Silme hatası: ' + err.message);
      }
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        isCompleted: !task.isCompleted,
        status: !task.isCompleted ? "Tamamlandı" : "Devam Ediyor",
        completedDate: !task.isCompleted ? new Date().toISOString() : null,
      };
      await tasksAPI.update(task.id, updatedTask);
      fetchProjectTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err) {
      alert("Güncelleme hatası: " + err.message);
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      const updatedTask = {
        ...task,
        status: newStatus,
        isCompleted: newStatus === "Tamamlandı",
        completedDate: newStatus === "Tamamlandı" ? new Date().toISOString() : null,
      };
      await tasksAPI.update(task.id, updatedTask);
      fetchProjectTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err) {
      alert("Durum güncelleme hatası: " + err.message);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'Tamamlandı').length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700" style={{ borderLeftWidth: '4px', borderLeftColor: project.color }}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{project.name}</h2>
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                İlerleme: {completedTasks}/{tasks.length} görev
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                %{progressPercentage}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%`, backgroundColor: project.color }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Görevler</h3>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="text-sm px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              {showTaskForm ? 'İptal' : '+ Görev Ekle'}
            </button>
          </div>

          {showTaskForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    placeholder="Görev başlığı"
                  />
                </div>
                <div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    placeholder="Açıklama (opsiyonel)"
                    rows="2"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    <option value={1}>Düşük</option>
                    <option value={2}>Orta</option>
                    <option value={3}>Yüksek</option>
                    <option value={4}>Acil</option>
                  </select>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    <option value="">Kategori Seç</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                >
                  Görevi Ekle
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                Bu projede henüz görev yok. Yukarıdan görev ekleyin!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => {}}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailModal;