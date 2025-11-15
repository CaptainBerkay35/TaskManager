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

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 4:
        return {
          bg: "bg-gradient-to-r from-red-500 to-red-600",
          text: "text-white",
          icon: "🔥",
          label: "Acil"
        };
      case 3:
        return {
          bg: "bg-gradient-to-r from-orange-500 to-orange-600",
          text: "text-white",
          icon: "⚠️",
          label: "Yüksek"
        };
      case 2:
        return {
          bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
          text: "text-white",
          icon: "📋",
          label: "Orta"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-green-500 to-green-600",
          text: "text-white",
          icon: "✅",
          label: "Düşük"
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Tamamlandı":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-600",
          text: "text-white",
          icon: "✓",
          label: "Tamamlandı"
        };
      case "Devam Ediyor":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
          text: "text-white",
          icon: "▶",
          label: "Devam Ediyor"
        };
      case "Bekliyor":
        return {
          bg: "bg-gradient-to-r from-orange-500 to-amber-600",
          text: "text-white",
          icon: "⏸",
          label: "Bekliyor"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500 to-gray-600",
          text: "text-white",
          icon: "○",
          label: status
        };
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === "Tamamlandı") return false;
    return new Date(task.dueDate) < new Date();
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const completedSubTasks = subTasks.filter((st) => st.isCompleted).length;
  const totalSubTasks = subTasks.length;
  const subTaskProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/80 w-full max-w-4xl my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        
        {/* ✅ MODERN HEADER - Gradient Background */}
        <div className={`relative ${task.project?.color ? '' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'} p-6 sm:p-8 text-white overflow-hidden`}
             style={task.project?.color ? {
               background: `linear-gradient(135deg, ${task.project.color} 0%, ${task.project.color}dd 100%)`
             } : {}}>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start gap-4 mb-4">
              {/* Title & Close Button */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{statusConfig.icon}</span>
                  <h2 className="text-xl sm:text-3xl font-bold break-words leading-tight">
                    {task.title}
                  </h2>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 group"
                aria-label="Kapat"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`${priorityConfig.bg} ${priorityConfig.text} px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1.5`}>
                <span>{priorityConfig.icon}</span>
                {priorityConfig.label}
              </span>
              
              <span className={`${statusConfig.bg} ${statusConfig.text} px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1.5`}>
                <span>{statusConfig.icon}</span>
                {statusConfig.label}
              </span>
              
              {task.project && (
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {task.project.name}
                </span>
              )}
            </div>

         
          </div>
        </div>

        {/* ✅ MODERN TABS */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex px-4 sm:px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`relative px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "details"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Detaylar
              </span>
              {activeTab === "details" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("subtasks")}
              className={`relative px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "subtasks"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="hidden sm:inline">Alt Görevler</span>
                <span className="sm:hidden">Alt Görev</span>
                {!subTasksLoading && totalSubTasks > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === "subtasks"
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {completedSubTasks}/{totalSubTasks}
                  </span>
                )}
              </span>
              {activeTab === "subtasks" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"></div>
              )}
            </button>
          </div>
        </div>

        {/* ✅ CONTENT AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/30">
          {activeTab === "details" && (
            <div className="space-y-4 max-w-3xl mx-auto">
              
              {/* Description Card */}
              {task.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Açıklama</h3>
                  </div>
                  <DescriptionRenderer
                    text={task.description}
                    className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                  />
                </div>
              )}

              {/* Date Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Oluşturulma</div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {new Date(task.createdDate).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {task.dueDate && (
                  <div className={`rounded-xl p-4 shadow-sm border ${
                    isOverdue()
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isOverdue() 
                          ? "bg-red-100 dark:bg-red-900/30" 
                          : "bg-amber-100 dark:bg-amber-900/30"
                      }`}>
                        <svg className={`w-5 h-5 ${isOverdue() ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Son Tarih</div>
                        <div className={`text-sm font-semibold ${
                          isOverdue() 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-gray-800 dark:text-gray-200"
                        }`}>
                          {isOverdue() && '⚠️ '}
                          {new Date(task.dueDate).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        {isOverdue() && (
                          <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                            Gecikmiş
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Completion Date */}
              {task.completedDate && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">Tamamlandı</div>
                      <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {new Date(task.completedDate).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "subtasks" && (
            <div className="max-w-3xl mx-auto">
              <SubTaskList taskId={task.id} parentTask={task} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;