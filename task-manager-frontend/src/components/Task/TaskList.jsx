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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Görevlerim
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
        >
          + Yeni Görev
        </button>
      </div>

      {/* Filters */}
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
        <div className="grid gap-4">
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

      {/* Task Form Modal */}
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