import { useState, useEffect } from "react";
import { tasksAPI, projectsAPI } from "../../services/api";
import TaskCard from "../Task/TaskCard";
import TaskForm from "../Task/TaskForm";
import TaskFilters from "../Task/TaskFilters";
import ConfirmDialog from "../ConfirmDialog";

function ProjectTaskView({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    taskId: null,
    taskTitle: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    if (projectId) {
      fetchProjectAndTasks();
    } else {
      fetchAllTasks();
    }
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectsAPI.getById(projectId),
        tasksAPI.getAll(),
      ]);
      setProject(projectRes.data);
      const projectTasks = tasksRes.data.filter(
        (t) => t.projectId === projectId
      );
      setTasks(projectTasks);
    } catch (err) {
      console.error("Hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
      setProject(null);
    } catch (err) {
      console.error("Görevler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
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
      setDeleteConfirm({ show: false, taskId: null, taskTitle: "" });
      projectId ? fetchProjectAndTasks() : fetchAllTasks();
    } catch (err) {
      alert("Silme hatası: " + err.message);
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
      projectId ? fetchProjectAndTasks() : fetchAllTasks();
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
        completedDate:
          newStatus === "Tamamlandı" ? new Date().toISOString() : null,
      };
      await tasksAPI.update(task.id, updatedTask);
      projectId ? fetchProjectAndTasks() : fetchAllTasks();
    } catch (err) {
      alert("Durum güncelleme hatası: " + err.message);
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

  const completedTasks = tasks.filter((t) => t.status === "Tamamlandı").length;
  const progressPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project Header */}
      {project && (
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4"
          style={{ borderLeftColor: project.color }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {completedTasks}/{tasks.length} görev tamamlandı
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                %{progressPercentage}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Task Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {project ? `${project.name} Görevleri` : "Tüm Görevler"}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
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

      {/* Tasks List */}
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
            {project ? "Bu projede henüz görev yok." : "Henüz görev yok."} Yeni
            görev ekleyin!
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
              onToggleComplete={handleToggleComplete}
              onUpdateStatus={handleUpdateStatus}
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
          onRefresh={() => {
            projectId ? fetchProjectAndTasks() : fetchAllTasks();
            if (window.refreshProjectSidebar) window.refreshProjectSidebar();
          }}
          editTask={editingTask}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Görevi Sil"
        message={`"${deleteConfirm.taskTitle}" görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteConfirm({ show: false, taskId: null, taskTitle: "" })
        }
      />
    </div>
  );
}

export default ProjectTaskView;
