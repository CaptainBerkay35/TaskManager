import { useState } from "react";
import { useProjectManager } from "../../hooks/useProjectManager";
import { useProjectFilters } from "../../hooks/useProjectFilters";
import ProjectForm from "./ProjectForm";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import ProjectDetailModal from "./ProjectDetailModal";
import ConfirmDialog from "../ConfirmDialog";
import Toast from "../Toast";
import {
  EmptyProjectsState,
  NoFilterResultsState,
  LoadingState,
} from "./ProjectEmptyStates";

function ProjectManager() {
  // Custom hooks
  const {
    projects,
    categories,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch,
  } = useProjectManager();

  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    filteredProjects,
  } = useProjectFilters(projects);

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    projectId: null,
    projectName: "",
    taskCount: 0,
  });

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Form handlers
  const handleFormSubmit = async (formData) => {
    const result = editingProject
      ? await updateProject(editingProject.id, formData)
      : await createProject(formData);

    if (result.success) {
      handleFormCancel();
      setToast({
        show: true,
        message: editingProject ? "Proje güncellendi!" : "Proje oluşturuldu!",
        type: "success",
      });
    } else {
      alert("Hata: " + result.error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // ✅ DÜZELTİLDİ: Yeni proje butonuna basınca editing'i temizle
  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  // ✅ YENİ: Buton toggle handler
  const handleToggleForm = () => {
    if (showForm) {
      // Form açıksa kapat
      handleFormCancel();
    } else {
      // Form kapalıysa aç
      handleNewProject();
    }
  };

  // Delete handlers
  const handleDeleteClick = (project) => {
    setDeleteConfirm({
      show: true,
      projectId: project.id,
      projectName: project.name,
      taskCount: project.tasks?.length || 0,
    });
  };

  const handleDeleteConfirm = async () => {
    const projectName = deleteConfirm.projectName;
    const taskCount = deleteConfirm.taskCount;

    const result = await deleteProject(deleteConfirm.projectId);

    if (result.success) {
      setToast({
        show: true,
        message:
          taskCount > 0
            ? `"${projectName}" projesi ve ${taskCount} görevi silindi`
            : `"${projectName}" projesi silindi`,
        type: "success",
      });
    } else {
      alert("Silme hatası: " + result.error);
    }

    setDeleteConfirm({
      show: false,
      projectId: null,
      projectName: "",
      taskCount: 0,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      show: false,
      projectId: null,
      projectName: "",
      taskCount: 0,
    });
  };

  const handleCloseDetailModal = () => {
    setSelectedProject(null);
    refetch();
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Projeler
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Toplam {filteredProjects.length} proje
          </p>
        </div>
        
        {/* ✅ DÜZELTİLDİ: Buton toggle fonksiyonu */}
        <button
          onClick={handleToggleForm}
          className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg transition font-medium text-sm sm:text-base shadow-sm touch-manipulation flex items-center justify-center gap-2 ${
            showForm && !editingProject
              ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              : "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
          }`}
        >
          {showForm && !editingProject ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              İptal
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Proje
            </>
          )}
        </button>
      </div>

      {/* Filters - Sadece form kapalıyken göster */}
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

      {/* Form - Açıkken göster */}
      {showForm && (
        <ProjectForm
          editingProject={editingProject}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Project List / Empty States - Form kapalıyken göster */}
      {!showForm && (
        <>
          {projects.length === 0 ? (
            <EmptyProjectsState />
          ) : filteredProjects.length === 0 ? (
            <NoFilterResultsState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onClick={setSelectedProject}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
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
        onCancel={handleDeleteCancel}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={handleCloseDetailModal}
          onTaskUpdate={refetch}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </div>
  );
}

export default ProjectManager;