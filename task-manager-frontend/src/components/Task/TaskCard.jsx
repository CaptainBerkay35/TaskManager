import SubTaskList from "./SubTaskList.jsx";
import { useState } from "react";

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const [showSubTasks, setShowSubTasks] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 4:
        return "bg-red-100 text-red-800";
      case 3:
        return "bg-orange-100 text-orange-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 4:
        return "Acil";
      case 3:
        return "Yüksek";
      case 2:
        return "Orta";
      default:
        return "Düşük";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-blue-100 text-blue-800";
      case "Devam Ediyor":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              {getPriorityText(task.priority)}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
            {task.category && (
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: task.category.color + "20",
                  color: task.category.color,
                }}
              >
                {task.category.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onToggleComplete(task)}
            className="text-gray-400 hover:text-green-600 transition"
            title="Tamamla/Geri Al"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-indigo-600 transition"
            title="Düzenle"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 transition"
            title="Sil"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={() => setShowSubTasks(!showSubTasks)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showSubTasks ? "▼" : "▶"} Alt Görevler
        </button>
        {showSubTasks && <SubTaskList taskId={task.id} />}
      </div>
    </div>
  );
}

export default TaskCard;
