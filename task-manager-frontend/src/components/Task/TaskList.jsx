import { useState, useEffect } from "react";
import { tasksAPI } from "../../services/api";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";

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

  const handleDelete = async (id) => {
    if (!window.confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      await tasksAPI.delete(id);
      fetchTasks();
    } catch (err) {
      alert("Silme hatası: " + err.message);
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Görevlerim</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Henüz görev yok. Yeni görev ekleyin!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
    </div>
  );
}

export default TaskList;
