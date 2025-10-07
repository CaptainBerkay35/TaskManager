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
  const [deadlineError, setDeadlineError] = useState("");

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
    }
  };

  const getSelectedProjectDeadline = () => {
    if (!formData.projectId) return null;
    const project = projects.find((p) => p.id === parseInt(formData.projectId));
    return project?.deadline || null;
  };

  const handleDueDateChange = (e) => {
    const newDueDate = e.target.value;
    const projectDeadline = getSelectedProjectDeadline();

    if (newDueDate && projectDeadline) {
      const dueDate = new Date(newDueDate);
      const deadline = new Date(projectDeadline);

      if (dueDate > deadline) {
        setDeadlineError(
          `Görev tarihi, projenin son teslim tarihinden (${deadline.toLocaleDateString(
            "tr-TR"
          )}) sonra olamaz!`
        );
      } else {
        setDeadlineError("");
      }
    } else {
      setDeadlineError("");
    }

    setFormData({ ...formData, dueDate: newDueDate });
  };

  const handleProjectChange = (e) => {
    const newProjectId = e.target.value;
    const newProject = projects.find((p) => p.id === parseInt(newProjectId));

    if (formData.dueDate && newProject?.deadline) {
      const dueDate = new Date(formData.dueDate);
      const deadline = new Date(newProject.deadline);

      if (dueDate > deadline) {
        setDeadlineError(
          `Görev tarihi, seçilen projenin son teslim tarihinden (${deadline.toLocaleDateString(
            "tr-TR"
          )}) sonra olamaz!`
        );
      } else {
        setDeadlineError("");
      }
    }

    setFormData({ ...formData, projectId: newProjectId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (deadlineError) {
      alert("Lütfen geçerli bir son teslim tarihi girin.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Lütfen görev başlığı girin.");
      return;
    }

    if (!formData.projectId) {
      alert("Lütfen bir proje seçin.");
      return;
    }

    setLoading(true);
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
      console.error("FULL ERROR:", err);
      console.error("ERROR RESPONSE:", err.response?.data);
      alert("Hata: " + (err.response?.data || err.message));
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
        {/* ✅ Sticky Header - Mobilde üstte sabit */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {editTask ? "Görevi Düzenle" : "Yeni Görev"}
          </h2>
          {/* ✅ Mobilde X butonu göster */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 touch-manipulation"
            aria-label="Kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Görev adını girin..."
              />
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

            {/* ✅ Proje ve Öncelik - Mobilde stack, tablet+ grid */}
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
                  className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
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
                {projects.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
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
                className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${
                  deadlineError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                }`}
              />
              {deadlineError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {deadlineError}
                </p>
              )}
              {(() => {
                const deadline = getSelectedProjectDeadline();
                return (
                  deadline &&
                  !deadlineError && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ℹ️ Proje deadline:{" "}
                      {new Date(deadline).toLocaleDateString("tr-TR")}
                    </p>
                  )
                );
              })()}
            </div>
          </form>
        </div>

        {/* ✅ Sticky Footer - Mobilde altta sabit */}
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
              disabled={loading || projects.length === 0 || !!deadlineError}
              className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-3 sm:py-2 text-base sm:text-sm rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium touch-manipulation"
            >
              {loading
                ? "Kaydediliyor..."
                : editTask
                ? "Güncelle"
                : "Oluştur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;