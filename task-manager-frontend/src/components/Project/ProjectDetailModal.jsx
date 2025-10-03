import { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import TaskCard from '../Task/TaskCard';
import RichTextEditor from "../RichTextEditor";
import TaskForm from '../Task/TaskForm';

function ProjectDetailModal({ project, onClose, onTaskUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    dueDate: '',
  });

  useEffect(() => {
    fetchProjectTasks();
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
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        ...formData,
        projectId: project.id, // ProjectId otomatik ekleniyor
        status: 'Devam Ediyor',
        dueDate: formData.dueDate || null,
      };

      await tasksAPI.create(taskData);
      setFormData({ title: '', description: '', priority: 2, dueDate: '' });
      setShowTaskForm(false);
      fetchProjectTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err) {
      alert('Hata: ' + (err.response?.data || err.message));
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
                {project.category && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Kategori:</span>
                    <span 
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ 
                        backgroundColor: project.category.color + '20',
                        color: project.category.color 
                      }}
                    >
                      {project.category.name}
                    </span>
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Görev Başlığı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    placeholder="Görev başlığı"
                  />
                </div>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  label="Açıklama"
                  placeholder="Görev detaylarını yazın...&#10;&#10;"
                  rows={4}
                  showCharCount={true}
                  maxLength={1000}
                  id="project-task-description"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Öncelik
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    >
                      <option value={1}>Düşük</option>
                      <option value={2}>Orta</option>
                      <option value={3}>Yüksek</option>
                      <option value={4}>Acil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Son Tarih
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    ℹ️ Bu görev otomatik olarak "<span className="font-semibold">{project.name}</span>" projesine eklenecek
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-medium"
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
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
       {/* TaskForm Modal için - Edit durumunda */}
      {showTaskForm && editingTask && (
        <TaskForm
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            fetchProjectTasks();
            if (onTaskUpdate) onTaskUpdate();
          }}
          editTask={editingTask}
        />
      )}
    </div>
  );
}

export default ProjectDetailModal;