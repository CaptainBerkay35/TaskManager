import { useState } from 'react';
import { useProjectManager } from '../../hooks/useProjectManager';
import { useProjectFilters } from '../../hooks/useProjectFilters';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import ProjectDetailModal from './ProjectDetailModal';
import ConfirmDialog from '../ConfirmDialog';
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
    refetch, // ← Projeleri yeniden yüklemek için
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

  // Form handlers
  const handleFormSubmit = async (formData) => {
    const result = editingProject
      ? await updateProject(editingProject.id, formData)
      : await createProject(formData);

    if (result.success) {
      handleFormCancel();
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
    const result = await deleteProject(deleteConfirm.projectId);
    
    if (result.success && result.data) {
      const message = result.data.deletedTasksCount > 0
        ? `"${result.data.projectName}" projesi ve ${result.data.deletedTasksCount} görevi silindi.`
        : `"${result.data.projectName}" projesi silindi.`;
      alert(message);
    } else if (!result.success) {
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

  // ✅ Task güncellendiğinde projeleri yeniden yükle
  const handleTaskUpdate = async () => {
    const freshProjects = await refetch(); // Returns fresh data
    
    // Modal açıksa, güncel project bilgisini güncelle
    if (selectedProject && freshProjects) {
      const updatedProject = freshProjects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
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
          📁 Projeler
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center gap-2"
        >
          {showForm ? (
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
          onTaskUpdate={handleTaskUpdate} // ✅ Artık gerçek fonksiyon
        />
      )}
    </div>
  );
}

export default ProjectManager;