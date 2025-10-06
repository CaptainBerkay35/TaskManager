import { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import TaskCard from '../Task/TaskCard';
import RichTextEditor from "../RichTextEditor";
import TaskForm from '../Task/TaskForm';
import ConfirmDialog from '../ConfirmDialog';

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
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    taskId: null,
    taskTitle: '',
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
        projectId: project.id,
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

  const handleDeleteClick = (task) => {
    setDeleteConfirm({
      show: true,
      taskId: task.id,
      taskTitle: task.title,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await tasksAPI.delete(deleteConfirm.taskId);
      fetchProjectTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err) {
      alert('Silme hatası: ' + err.message);
    } finally {
      setDeleteConfirm({ show: false, taskId: null, taskTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, taskId: null, taskTitle: '' });
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

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskFormSuccess = () => {
    fetchProjectTasks();
    setShowTaskForm(false);
    setEditingTask(null);
    if (onTaskUpdate) onTaskUpdate();
  };

  const completedTasks = tasks.filter(t => t.status === 'Tamamlandı').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/50 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div 
            className="p-6 border-b border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: project.color + '15' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {project.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {project.description && (
              <div className="text-gray-600 dark:text-gray-300 mb-4 prose dark:prose-invert max-w-none">
                <RichTextEditor
                  value={project.description}
                  readOnly={true}
                  showToolbar={false}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {project.deadline && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    Deadline: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  {tasks.length} Görev ({completedTasks} Tamamlandı)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {tasks.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>İlerleme</span>
                  <span>{progress}%</span>
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
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Görevler</h3>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition text-sm"
              >
                {showTaskForm ? 'İptal' : '+ Görev Ekle'}
              </button>
            </div>

            {/* Quick Add Task Form */}
            {showTaskForm && !editingTask && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Görev Başlığı
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Görev başlığı..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                      required
                    />
                  </div>
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
                        max={project.deadline ? project.deadline.split('T')[0] : ''}
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
                    onDelete={handleDeleteClick}
                    onToggleComplete={handleToggleComplete}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && editingTask && (
        <TaskForm
          onClose={handleTaskFormClose}
          onSuccess={handleTaskFormSuccess}
          editTask={editingTask}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Görevi Sil"
        message={`"${deleteConfirm.taskTitle}" görevini silmek istediğinizden emin misiniz? Bu görevin tüm alt görevleri de silinecek. Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default ProjectDetailModal;