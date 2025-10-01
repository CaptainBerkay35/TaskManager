import { useState, useEffect } from "react";
import { tasksAPI } from "../../services/api";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import ConfirmDialog from "../ConfirmDialog";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, taskId: null, taskTitle: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Görevler yüklenirken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteClick = (task) => {
    console.log("task",task.title);
    setDeleteConfirm({
      show: true,
      taskId: task.id,
      taskTitle: task.title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await tasksAPI.delete(deleteConfirm.taskId);
      setDeleteConfirm({ show: false, taskId: null, taskTitle: "" });
      fetchTasks();
    } catch (err) {
      alert("Silme hatası: " + err.message);
      setDeleteConfirm({ show: false, taskId: null, taskTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, taskId: null, taskTitle: "" });
  };

  const toggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        isCompleted: !task.isCompleted,
        status: !task.isCompleted ? "Tamamlandı" : "Bekliyor",
        completedDate: !task.isCompleted ? new Date().toISOString() : null,
      };
      await tasksAPI.update(task.id, updatedTask);
      fetchTasks();
    } catch (err) {
      alert("Güncelleme hatası: " + err.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === parseInt(filterPriority);
    const matchesCategory =
      filterCategory === "all" || task.categoryId === parseInt(filterCategory);

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

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
    <div className="space-y-4">
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

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Henüz görev yok. Yeni görev ekleyin!
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Filtrelere uygun görev bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleComplete={toggleComplete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSuccess={fetchTasks}
          editTask={editingTask}
        />
      )}

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