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

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-4xl my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header - Responsive */}
          <div 
            className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
            style={{ backgroundColor: project.color + '15' }}
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4 gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div 
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white break-words">
                  {project.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Kapat"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {project.description && (
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                <RichTextEditor
                  value={project.description}
                  readOnly={true}
                  showToolbar={false}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              {project.deadline && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <span className="hidden sm:inline">Deadline: </span>
                    {new Date(project.deadline).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  {tasks.length} Görev ({completedTasks} Tamamlandı)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {tasks.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>İlerleme</span>
                  <span className="font-medium">{progress}%</span>
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

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                Görevler
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({tasks.length})
                </span>
              </h3>
              <button
                onClick={handleAddTask}
                className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Görev Ekle</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                  Bu projede henüz görev yok
                </p>
                <button
                  onClick={handleAddTask}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition text-sm font-medium inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  İlk Görevi Ekle
                </button>
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
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleTaskFormClose}
          onRefresh={handleTaskFormSuccess}
          defaultProjectId={project.id}  
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