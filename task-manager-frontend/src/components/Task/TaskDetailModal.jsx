import { useState, useEffect } from "react";
import SubTaskList from "./SubTaskList";
import { subTasksAPI } from "../../services/api";
import DescriptionRenderer from "../DescriptionRenderer";

function TaskDetailModal({ task, onClose }) {
  const [activeTab, setActiveTab] = useState("details");
  const [subTasks, setSubTasks] = useState([]);
  const [subTasksLoading, setSubTasksLoading] = useState(true);

  useEffect(() => {
    fetchSubTasks();
  }, [task.id]);

  const fetchSubTasks = async () => {
    try {
      setSubTasksLoading(true);
      const response = await subTasksAPI.getByTask(task.id);
      setSubTasks(response.data);
    } catch (err) {
      console.error("Alt görevler yüklenemedi:", err);
    } finally {
      setSubTasksLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 4:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case 2:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
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
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Devam Ediyor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === "Tamamlandı") return false;
    return new Date(task.dueDate) < new Date();
  };

  // Alt görev istatistikleri
  const completedSubTasks = subTasks.filter((st) => st.isCompleted).length;
  const totalSubTasks = subTasks.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-3xl my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white p-4 sm:p-6 flex-shrink-0">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 break-words">
                {task.title}
              </h2>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPriorityColor(
                    task.priority
                  )} bg-opacity-90`}
                >
                  {getPriorityText(task.priority)}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                    task.status
                  )} bg-opacity-90`}
                >
                  {task.status}
                </span>
                {task.project && (
                  <span
                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white truncate max-w-[150px] sm:max-w-none"
                    style={{ backgroundColor: task.project.color }}
                    title={task.project.name}
                  >
                    <span className="hidden sm:inline">📁 </span>
                    {task.project.name}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 sm:p-2 transition"
              aria-label="Kapat"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs - Responsive */}
        <div className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition ${
                activeTab === "details"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Detaylar
            </button>
            <button
              onClick={() => setActiveTab("subtasks")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition relative ${
                activeTab === "subtasks"
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline">Alt Görevler</span>
                <span className="sm:hidden">Alt Görev</span>
                {!subTasksLoading && totalSubTasks > 0 && (
                  <span
                    className={`
                    px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full
                    ${
                      activeTab === "subtasks"
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }
                  `}
                  >
                    {completedSubTasks}/{totalSubTasks}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Content - Responsive & Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === "details" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama:
                  </h4>
                  <DescriptionRenderer
                    text={task.description}
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
                  />
                </div>
              )}

              {/* Dates - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Oluşturulma Tarihi
                  </h3>
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                    {new Date(task.createdDate).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {task.dueDate && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg ${
                      isOverdue()
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Son Teslim Tarihi
                    </h3>
                    <p
                      className={`text-sm sm:text-base font-medium ${
                        isOverdue()
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {isOverdue() && "⚠ "}
                      {new Date(task.dueDate).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {isOverdue() && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Gecikmiş
                      </p>
                    )}
                  </div>
                )}

                {task.completedDate && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-800 sm:col-span-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tamamlanma Tarihi
                    </h3>
                    <p className="text-sm sm:text-base text-green-800 dark:text-green-400 font-medium">
                      {new Date(task.completedDate).toLocaleDateString(
                        "tr-TR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info - Responsive */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Durum
                  </h3>
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                    {task.status}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Öncelik
                  </h3>
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                    {getPriorityText(task.priority)}
                  </p>
                </div>
              </div>

              {/* Alt Görev Özeti */}
              {totalSubTasks > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                    Alt Görev İlerlemesi
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-indigo-200 dark:bg-indigo-900 rounded-full h-2">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              totalSubTasks > 0
                                ? (completedSubTasks / totalSubTasks) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                      {completedSubTasks}/{totalSubTasks}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "subtasks" && (
            <div>
              <SubTaskList taskId={task.id} parentTask={task} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;