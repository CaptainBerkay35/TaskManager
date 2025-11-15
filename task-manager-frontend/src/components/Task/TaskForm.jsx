// components/Task/TaskForm.jsx
import { useState, useEffect } from "react";
import { projectsAPI, tasksAPI } from "../../services/api";
import RichTextEditor from "../RichTextEditor";

function TaskForm({ editTask, onClose, onRefresh, defaultProjectId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 2,
    dueDate: "",
    projectId: 0,
    status: "Devam Ediyor",
  });
  
  const [errors, setErrors] = useState({
    title: "",
    projectId: "",
    dueDate: "",
    general: ""
  });

  useEffect(() => {
    fetchProjects();
    if (editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        priority: editTask.priority || 2,
        dueDate: editTask.dueDate ? editTask.dueDate.split("T")[0] : "",
        projectId: editTask.projectId || 0,
        status: editTask.status || "Devam Ediyor",
      });
    } else if (defaultProjectId) {
      setFormData(prev => ({
        ...prev,
        projectId: defaultProjectId
      }));
    }
  }, [editTask, defaultProjectId]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.filter((p) => p.isActive));
    } catch (err) {
      console.error("Projeler yüklenemedi:", err);
      setErrors(prev => ({ ...prev, general: "Projeler yüklenirken hata oluştu" }));
    }
  };

  const getSelectedProjectDeadline = () => {
    if (!formData.projectId) return null;
    const project = projects.find((p) => p.id === parseInt(formData.projectId));
    return project?.deadline || null;
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      projectId: "",
      dueDate: "",
      general: ""
    };

    if (!formData.title.trim()) {
      newErrors.title = "Görev başlığı gereklidir";
    }

    if (!formData.projectId || formData.projectId === "0" || formData.projectId === 0) {
      newErrors.projectId = "Lütfen bir proje seçin";
    }

    if (formData.dueDate && formData.projectId) {
      const projectDeadline = getSelectedProjectDeadline();
      if (projectDeadline) {
        const dueDate = new Date(formData.dueDate);
        const deadline = new Date(projectDeadline);
        if (dueDate > deadline) {
          newErrors.dueDate = `Görev tarihi, projenin son teslim tarihinden (${deadline.toLocaleDateString("tr-TR")}) sonra olamaz`;
        }
      }
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.projectId && !newErrors.dueDate;
  };

  const handleDueDateChange = (e) => {
    const newDueDate = e.target.value;
    setFormData({ ...formData, dueDate: newDueDate });
    
    // Clear error when user types
    if (errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: "" }));
    }

    // Validate on change
    if (newDueDate && formData.projectId) {
      const projectDeadline = getSelectedProjectDeadline();
      if (projectDeadline) {
        const dueDate = new Date(newDueDate);
        const deadline = new Date(projectDeadline);
        if (dueDate > deadline) {
          setErrors(prev => ({
            ...prev,
            dueDate: `Görev tarihi, projenin son teslim tarihinden (${deadline.toLocaleDateString("tr-TR")}) sonra olamaz`
          }));
        }
      }
    }
  };

  const handleProjectChange = (e) => {
    const newProjectId = e.target.value;
    setFormData({ ...formData, projectId: newProjectId });
    
    // Clear errors when user selects
    if (errors.projectId) {
      setErrors(prev => ({ ...prev, projectId: "" }));
    }

    // Re-validate date if exists
    if (formData.dueDate && newProjectId) {
      const newProject = projects.find((p) => p.id === parseInt(newProjectId));
      if (newProject?.deadline) {
        const dueDate = new Date(formData.dueDate);
        const deadline = new Date(newProject.deadline);
        if (dueDate > deadline) {
          setErrors(prev => ({
            ...prev,
            dueDate: `Görev tarihi, seçilen projenin son teslim tarihinden (${deadline.toLocaleDateString("tr-TR")}) sonra olamaz`
          }));
        } else {
          setErrors(prev => ({ ...prev, dueDate: "" }));
        }
      }
    }
  };

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate before submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));

    try {
      const taskData = {
        title: formData.title,
        description: formData.description || "",
        priority: parseInt(formData.priority),
        projectId: parseInt(formData.projectId),
        dueDate: formData.dueDate || null,
        status: formData.status || "Devam Ediyor",
      };

      if (editTask) {
        taskData.id = editTask.id;
        await tasksAPI.update(editTask.id, taskData);
      } else {
        await tasksAPI.create(taskData);
      }

      onRefresh();
      onClose();
    } catch (err) {
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data 
        || err.message 
        || "Görev kaydedilirken bir hata oluştu";
      
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const getMaxDate = () => {
    const projectDeadline = getSelectedProjectDeadline();
    if (!projectDeadline) return "";
    return projectDeadline.split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* ✅ Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {editTask ? "Görevi Düzenle" : "Yeni Görev"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition touch-manipulation"
            aria-label="Kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ✅ General Error Message */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {errors.general}
                  </p>
                </div>
                <button
                  onClick={() => setErrors(prev => ({ ...prev, general: "" }))}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Görev Başlığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Görev Başlığı *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition ${
                  errors.title
                    ? "border-red-500 dark:border-red-600 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                }`}
                placeholder="Görev adını girin..."
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Açıklama */}
            <div>
              <RichTextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Görev detaylarını yazın..."
              />
            </div>

            {/* Proje ve Öncelik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Proje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proje *
                </label>
                <select
                  required
                  value={formData.projectId}
                  onChange={handleProjectChange}
                  disabled={!!defaultProjectId && !editTask} 
                  className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition ${
                    errors.projectId
                      ? "border-red-500 dark:border-red-600 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  }`}
                >
                  <option value="">Proje Seçin</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                      {project.deadline &&
                        ` (Son: ${new Date(project.deadline).toLocaleDateString(
                          "tr-TR"
                        )})`}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.projectId}
                  </p>
                )}
                {projects.length === 0 && !errors.projectId && (
                  <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Önce proje oluşturmalısınız!
                  </p>
                )}
              </div>

              {/* Öncelik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="1">🟢 Düşük</option>
                  <option value="2">🟡 Orta</option>
                  <option value="3">🟠 Yüksek</option>
                  <option value="4">🔴 Acil</option>
                </select>
              </div>
            </div>

            {/* Son Teslim Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Son Teslim Tarihi
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleDueDateChange}
                max={getMaxDate()}
                className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition ${
                  errors.dueDate
                    ? "border-red-500 dark:border-red-600 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.dueDate}
                </p>
              )}
              {(() => {
                const deadline = getSelectedProjectDeadline();
                return (
                  deadline &&
                  !errors.dueDate && (
                    <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Proje deadline: {new Date(deadline).toLocaleDateString("tr-TR")}
                    </p>
                  )
                );
              })()}
            </div>
          </form>
        </div>

        {/* ✅ Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium touch-manipulation"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || projects.length === 0}
              className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-3 sm:py-2 text-base sm:text-sm rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium touch-manipulation flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Kaydediliyor..." : editTask ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;