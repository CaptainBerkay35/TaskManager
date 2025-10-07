import { useState } from "react";
import { useTaskManager } from "../../hooks/useTaskManager";
import { useTaskFilters } from "../../hooks/useTaskFilters";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import ConfirmDialog from "../ConfirmDialog";
import { 
  EmptyTasksState, 
  NoFilterResultsState, 
  LoadingState, 
  ErrorState 
} from "./TaskEmptyStates";

function TaskList() {
  // Custom hooks
  const {
    tasks,
    loading,
    error,
    deleteTask,
    toggleComplete,
    updateTaskStatus,
    refetch,
  } = useTaskManager();

  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    filteredTasks,
  } = useTaskFilters(tasks);

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ 
    show: false, 
    taskId: null, 
    taskTitle: "" 
  });

  // Handlers
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteClick = (task) => {
    setDeleteConfirm({
      show: true,
      taskId: task.id,
      taskTitle: task.title
    });
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteTask(deleteConfirm.taskId);
    
    if (!result.success) {
      alert("Silme hatası: " + result.error);
    }
    
    setDeleteConfirm({ show: false, taskId: null, taskTitle: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, taskId: null, taskTitle: "" });
  };

  const handleToggleComplete = async (task) => {
    const result = await toggleComplete(task);
    if (!result.success) {
      alert("Güncelleme hatası: " + result.error);
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    const result = await updateTaskStatus(task, newStatus);
    if (!result.success) {
      alert("Durum güncelleme hatası: " + result.error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Loading & Error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Görevlerim
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Toplam {filteredTasks.length} görev
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition font-medium text-sm sm:text-base shadow-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Görev
          </span>
        </button>
      </div>

      {/* Filters - Already responsive from TaskFilters component */}
      <TaskFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      {/* Task List / Empty States */}
      {tasks.length === 0 ? (
        <EmptyTasksState />
      ) : filteredTasks.length === 0 ? (
        <NoFilterResultsState />
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleComplete={handleToggleComplete}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal - Already responsive */}
      {showForm && (
        <TaskForm
          onClose={handleFormClose}
          onSuccess={refetch}
          editTask={editingTask}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Görevi Sil"
        message={`"${deleteConfirm.taskTitle}" görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default TaskList;