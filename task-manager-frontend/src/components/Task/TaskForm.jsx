import { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../../services/api';
import RichTextEditor from '../RichTextEditor';

function TaskForm({ onClose, onSuccess, editTask = null }) {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 1,
    status: 'Devam Ediyor',
    projectId: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description || '',
        priority: editTask.priority,
        status: editTask.status,
        projectId: editTask.projectId || '',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
      });
    }
  }, [editTask]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error('Projeler yüklenemedi:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      alert('Lütfen bir proje seçin!');
      return;
    }
    
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        projectId: parseInt(formData.projectId),
        dueDate: formData.dueDate || null,
      };

      if (editTask) {
        await tasksAPI.update(editTask.id, { ...taskData, id: editTask.id });
      } else {
        await tasksAPI.create(taskData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert('Hata: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {editTask ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Proje Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Proje <span className="text-red-500">*</span>
              </label>
              {projectsLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Projeler yükleniyor...</div>
              ) : projects.length === 0 ? (
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  Henüz proje yok. Önce bir proje oluşturun.
                </div>
              ) : (
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">Proje Seçin</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Görev Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Görevi tanımlayın"
              />
            </div>

            {/* RichTextEditor Komponenti */}
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              label="Açıklama"
              placeholder="Detayları yazın (opsiyonel)&#10;&#10;Örnek:&#10;• Görev detayı 1&#10;• Görev detayı 2&#10;&#10;1. İlk adım&#10;2. İkinci adım"
              rows={6}
              showCharCount={true}
              maxLength={2000}
              id="task-description-editor"
            />

            {/* Öncelik ve Durum - Yan Yana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Öncelik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="1">Düşük</option>
                  <option value="2">Orta</option>
                  <option value="3">Yüksek</option>
                  <option value="4">Acil</option>
                </select>
              </div>

              {/* Durum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durum
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="Bekliyor">Bekliyor</option>
                  <option value="Devam Ediyor">Devam Ediyor</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                </select>
              </div>
            </div>

            {/* Son Tarih */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Son Teslim Tarihi
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            {/* Butonlar */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading || projects.length === 0}
                className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : editTask ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;