import { useState } from 'react';
import { useProjectManager } from '../../hooks/useProjectManager';
import { useProjectFilters } from '../../hooks/useProjectFilters';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import ProjectDetailModal from './ProjectDetailModal';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast'; // ✅ YENİ
import { EmptyProjectsState, NoFilterResultsState, LoadingState } from './ProjectEmptyStates';

function ProjectManager() {
  // Custom hooks
  const {
    projects,
    categories,
    loading,
    createProject,
    updateProject,
    deleteProject,
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
  
  // ✅ YENİ: Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  // Form handlers
  const handleFormSubmit = async (formData) => {
    const result = editingProject
      ? await updateProject(editingProject.id, formData)
      : await createProject(formData);

    if (result.success) {
      handleFormCancel();
      // ✅ YENİ: Başarı toast'ı göster
      setToast({
        show: true,
        message: editingProject ? 'Proje güncellendi!' : 'Proje oluşturuldu!',
        type: 'success',
      });
    } else {
      alert("Hata: " + result.error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null); // ✅ FIX: Editing state'i temizle
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // ✅ YENİ: Yeni proje butonuna basınca editing'i temizle
  const handleNewProject = () => {
    setEditingProject(null); // ✅ FIX: Önce temizle
    setShowForm(true);
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
      // ✅ YENİ: Toast ile bildir
      setToast({
        show: true,
        message: taskCount > 0 
          ? `"${projectName}" projesi ve ${taskCount} görevi silindi`
          : `"${projectName}" projesi silindi`,
        type: 'success',
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

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Projeler
        </h2>
        <button
          onClick={handleNewProject} // ✅ FIX: Yeni fonksiyon kullan
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
        >
          {showForm && !editingProject ? "İptal" : "+ Yeni Proje"}
        </button>
      </div>

      {/* Filters */}
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

      {/* Form */}
      {showForm && (
        <ProjectForm
          editingProject={editingProject}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Project List / Empty States */}
      {projects.length === 0 ? (
        <EmptyProjectsState />
      ) : filteredProjects.length === 0 ? (
        <NoFilterResultsState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          onClose={() => setSelectedProject(null)}
          onTaskUpdate={() => {}} // Refetch handled by hook
        />
      )}

      {/* ✅ YENİ: Toast Notification */}
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