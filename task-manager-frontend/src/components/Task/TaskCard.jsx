import { useState } from "react";
import TaskDetailModal from "./TaskDetailModal";

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const [showModal, setShowModal] = useState(false);

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

  const isCompleted = task.status === "Tamamlandı" || task.isCompleted;

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition border-2 cursor-pointer ${
          isCompleted
            ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 opacity-75"
            : "border-gray-200 dark:border-gray-700"
        }`}
        onClick={() => setShowModal(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              {isCompleted && (
                <span className="text-green-600 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              <h3
               className={`text-lg font-semibold ${isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}
              >
                {task.title}
              </h3>
            </div>

            {task.dueDate && (
              <p
                className={`text-xs mb-2 ${
                  new Date(task.dueDate) < new Date() && !isCompleted
                    ? "text-red-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {new Date(task.dueDate) < new Date() &&
                  !isCompleted &&
                  "⚠ Gecikmiş: "}
                Son Teslim Tarihi:{" "}
                {new Date(task.dueDate).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            {task.description && (
              <p
                className={`text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {task.description}
              </p>
            )}

            <div className="flex gap-2 flex-wrap items-center">
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

              {/* SubTask Sayısı - Modal'a yönlendir */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Alt Görevler
              </button>
            </div>
          </div>

          <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleComplete(task)}
              className={`transition p-2 rounded-lg ${
                isCompleted
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-gray-100 text-gray-400 hover:text-green-600 hover:bg-green-50"
              }`}
              title={
                isCompleted
                  ? "Tamamlanmadı Olarak İşaretle"
                  : "Tamamlandı Olarak İşaretle"
              }
            >
              <svg
                className="w-5 h-5"
                fill={isCompleted ? "currentColor" : "none"}
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
              className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition p-2 rounded-lg"
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
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition p-2 rounded-lg"
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
      </div>

      {showModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowModal(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default TaskCard;
