import { useState, useEffect } from 'react';
import { projectsAPI, categoriesAPI } from '../../services/api';
import ConfirmDialog from '../ConfirmDialog';
import ProjectDetailModal from './ProjectDetailModal';
import MultiSelectCategories from '../Category/MultiSelectCategories';
import ProjectFilters from './ProjectFilters';

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Filter ve Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdDate'); // Default: Eklenme tarihi
  
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    projectId: null,
    projectName: "",
    taskCount: 0,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366f1",
    deadline: "",
    categoryIds: [],
  });

  const colorOptions = [
    { value: "#6366f1", label: "İndigo" },
    { value: "#3b82f6", label: "Mavi" },
    { value: "#10b981", label: "Yeşil" },
    { value: "#f59e0b", label: "Turuncu" },
    { value: "#ef4444", label: "Kırmızı" },
    { value: "#8b5cf6", label: "Mor" },
    { value: "#ec4899", label: "Pembe" },
  ];

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error("Projeler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryIds || formData.categoryIds.length === 0) {
      alert('Lütfen en az 1 kategori seçin!');
      return;
    }

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        deadline: formData.deadline || null,
        categoryIds: formData.categoryIds,
      };

      if (editingProject) {
        await projectsAPI.update(editingProject.id, { 
          ...projectData, 
          id: editingProject.id 
        });
      } else {
        await projectsAPI.create(projectData);
      }
      
      setFormData({
        name: "",
        description: "",
        color: "#6366f1",
        deadline: "",
        categoryIds: [],
      });
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      alert("Hata: " + (err.response?.data || err.message));
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      color: project.color,
      deadline: project.deadline ? project.deadline.split("T")[0] : "",
      categoryIds: project.categories ? project.categories.map(c => c.id) : [],
    });
    setShowForm(true);
  };

  const handleDeleteClick = (project) => {
    const taskCount = project.tasks?.length || 0;
    setDeleteConfirm({
      show: true,
      projectId: project.id,
      projectName: project.name,
      taskCount: taskCount,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await projectsAPI.delete(deleteConfirm.projectId);

      if (response.data) {
        const message =
          response.data.deletedTasksCount > 0
            ? `"${response.data.projectName}" projesi ve ${response.data.deletedTasksCount} görevi silindi.`
            : `"${response.data.projectName}" projesi silindi.`;
        alert(message);
      }

      setDeleteConfirm({
        show: false,
        projectId: null,
        projectName: "",
        taskCount: 0,
      });
      fetchProjects();
    } catch (err) {
      alert("Silme hatası: " + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      color: "#6366f1",
      deadline: "",
      categoryIds: [],
    });
  };

  // Filtreleme ve Sıralama Fonksiyonu
  const getFilteredAndSortedProjects = () => {
    let filtered = [...projects];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Kategori filtresi
    if (filterCategory !== 'all') {
      filtered = filtered.filter(project =>
        project.categories && project.categories.some(cat => cat.id === parseInt(filterCategory))
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdDate':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'createdDateOld':
          return new Date(a.createdDate) - new Date(b.createdDate);
        case 'deadline':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case 'deadlineFar':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(b.deadline) - new Date(a.deadline);
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'nameDesc':
          return b.name.localeCompare(a.name, 'tr');
        case 'taskCount':
          return (b.tasks?.length || 0) - (a.tasks?.length || 0);
        case 'taskCountLow':
          return (a.tasks?.length || 0) - (b.tasks?.length || 0);
        default:
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

    return filtered;
  };

  const filteredProjects = getFilteredAndSortedProjects();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Projeler
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
        >
          {showForm ? "İptal" : "+ Yeni Proje"}
        </button>
      </div>

      {/* Filtreler - Form açık değilken göster */}
      {!showForm && (
        <ProjectFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingProject ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Proje Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Mobil Uygulama Projesi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategoriler <span className="text-red-500">*</span> (En az 1 tane)
              </label>
              {categories.length === 0 ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    ⚠️ Proje oluşturmak için önce kategori oluşturmalısınız.
                  </p>
                </div>
              ) : (
                <MultiSelectCategories
                  categories={categories}
                  selectedIds={formData.categoryIds}
                  onChange={(ids) => setFormData({ ...formData, categoryIds: ids })}
                  required={true}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                placeholder="Proje hakkında kısa açıklama"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Renk
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                      className={`w-10 h-10 rounded-full transition border-2 ${
                        formData.color === color.value
                          ? "border-gray-800 dark:border-white scale-110"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Son Teslim Tarihi
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={categories.length === 0}
                className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {editingProject ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Henüz proje yok. Yeni proje oluşturun!
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">
            Filtrelere uygun proje bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition border-l-4 cursor-pointer"
              style={{ borderLeftColor: project.color }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {project.name}
                    </h3>
                  </div>
                  {project.categories && project.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: cat.color + "20",
                            color: cat.color,
                          }}
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(project);
                    }}
                    className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(project);
                    }}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
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

              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {project.tasks?.length || 0} görev
                </span>
                {project.deadline && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(project.deadline).toLocaleDateString("tr-TR")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Projeyi Sil"
        message={
          deleteConfirm.taskCount > 0
            ? `"${deleteConfirm.projectName}" projesini silmek istediğinizden emin misiniz?\n\n⚠️ Bu projede ${deleteConfirm.taskCount} görev var ve TÜM GÖREVLER SİLİNECEK!\n\nBu işlem geri alınamaz.`
            : `"${deleteConfirm.projectName}" projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
        }
        confirmText="Evet, Sil"
        cancelText="İptal"
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteConfirm({
            show: false,
            projectId: null,
            projectName: "",
            taskCount: 0,
          })
        }
      />

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onTaskUpdate={fetchProjects}
        />
      )}
    </div>
  );
}

export default ProjectManager;