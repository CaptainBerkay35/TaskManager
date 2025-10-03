import { useState } from "react";
import TaskDetailModal from "./TaskDetailModal";
import DescriptionRenderer from "../DescriptionRenderer";

function TaskCard({ task, onEdit, onDelete, onToggleComplete, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 4:
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case 3:
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case 2:
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
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
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "Devam Ediyor":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "Bekliyor":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const handleTogglePause = (e) => {
    e.stopPropagation();
    if (!onUpdateStatus) return;

    const newStatus = task.status === "Devam Ediyor" ? "Bekliyor" : "Devam Ediyor";
    onUpdateStatus(task, newStatus);
  };

  const isCompleted = task.status === "Tamamlandı" || task.isCompleted;
  const isPaused = task.status === "Bekliyor";

  return (
    <>
      <div
        className={`p-4 rounded-lg shadow hover:shadow-lg transition border-2 cursor-pointer ${
          isCompleted
            ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 opacity-75"
            : isPaused
            ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }`}
        onClick={() => setShowModal(true)}
      >
        {/* Header: Title ve Action Buttons */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {isCompleted && (
              <span className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0">
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
            {isPaused && (
              <span className="text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            <h3
              className={`text-lg font-semibold ${
                isCompleted
                  ? "text-gray-500 dark:text-gray-400 line-through"
                  : "text-gray-800 dark:text-white"
              }`}
            >
              {task.title}
            </h3>
          </div>
          
          {/* Action Buttons - Title'ın Yanında */}
          <div className="flex gap-1.5 flex-shrink-0">
            {/* Başlat/Durdur Butonu - Sadece tamamlanmamış görevlerde */}
            {!isCompleted && (
              <button
                onClick={handleTogglePause}
                className={`p-2 rounded-lg transition ${
                  isPaused
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    : "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50"
                }`}
                title={isPaused ? "Görevi Başlat" : "Görevi Durdur"}
              >
                {isPaused ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
              title="Görevi Düzenle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task);
              }}
              className={`p-2 rounded-lg transition ${
                isCompleted
                  ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
                  : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50"
              }`}
              title={isCompleted ? "Görevi Geri Al" : "Görevi Tamamla"}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
              title="Görevi Sil"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
            {task.dueDate && (
              <p
                className={`text-xs mb-2 ${
                  new Date(task.dueDate) < new Date() && !isCompleted
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {new Date(task.dueDate) < new Date() &&
                  !isCompleted &&
                  "⚠️ Gecikmiş: "}
                📅 Son Teslim Tarihi:{" "}
                {new Date(task.dueDate).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            {task.description && (
              <DescriptionRenderer 
              text={task.description}
              maxLines={2}
              className={isCompleted 
                ? "text-gray-400 dark:text-gray-500 mb-3" 
                : "text-gray-600 dark:text-gray-300 mb-3"
              }
            />
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
                {task.status === "Bekliyor" && "⏸️ "}
                {task.status === "Devam Ediyor" && "▶️ "}
                {task.status === "Tamamlandı" && "✅ "}
                {task.status}
              </span>
              
              {task.project && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: task.project.color + "20",
                    color: task.project.color,
                  }}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {task.project.name}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-1"
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Detay
              </button>
            </div>
          </div>
      </div>

      {showModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default TaskCard;