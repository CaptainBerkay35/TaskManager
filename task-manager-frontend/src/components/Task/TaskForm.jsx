import { useState, useEffect } from "react";
import { projectsAPI, tasksAPI } from "../../services/api";
import RichTextEditor from "../RichTextEditor";

function TaskForm({ editTask, onClose, onRefresh }) {
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
    }
  }, [editTask]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.filter(p => p.isActive));
    } catch (err) {
      console.error("Projeler yüklenemedi:", err);
    }
  };

  const getSelectedProjectDeadline = () => {
    if (!formData.projectId) return null;
    const project = projects.find(p => p.id === parseInt(formData.projectId));
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
          `Görev tarihi, projenin son teslim tarihinden (${deadline.toLocaleDateString('tr-TR')}) sonra olamaz!`
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
    const newProject = projects.find(p => p.id === parseInt(newProjectId));
    
    if (formData.dueDate && newProject?.deadline) {
      const dueDate = new Date(formData.dueDate);
      const deadline = new Date(newProject.deadline);
      
      if (dueDate > deadline) {
        setDeadlineError(
          `Görev tarihi, seçilen projenin son teslim tarihinden (${deadline.toLocaleDateString('tr-TR')}) sonra olamaz!`
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

    // Edit durumunda ID ekle
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {editTask ? "Görevi Düzenle" : "Yeni Görev Oluştur"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Görev Başlığı *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Görev adını girin..."
              />
            </div>

            <div>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Görev detaylarını yazın..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proje *
                </label>
                <select
                  required
                  value={formData.projectId}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">Proje Seçin</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                      {project.deadline && ` (Son: ${new Date(project.deadline).toLocaleDateString('tr-TR')})`}
                    </option>
                  ))}
                </select>
                {projects.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Önce proje oluşturmalısınız!
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="1">Düşük</option>
                  <option value="2">Orta</option>
                  <option value="3">Yüksek</option>
                  <option value="4">Acil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Son Teslim Tarihi
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleDueDateChange}
                max={getMaxDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${
                  deadlineError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                }`}
              />
              {deadlineError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {deadlineError}
                </p>
              )}
              {(() => {
  const deadline = getSelectedProjectDeadline();
  return deadline && !deadlineError && (
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      ℹ️ Proje deadline: {new Date(deadline).toLocaleDateString('tr-TR')}
    </p>
  );
})()}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || projects.length === 0 || !!deadlineError}
                className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : editTask ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;