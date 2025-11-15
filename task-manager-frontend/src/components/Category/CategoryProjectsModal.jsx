import { useState } from 'react';
import ProjectDetailModal from '../Project/ProjectDetailModal';

function CategoryProjectsModal({ category, onClose }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  if (!category) return null;

const projects = category.projectCategories
  ?.map(pc => pc.project)
  .filter(p => p != null) || [];
  
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleCloseProjectDetail = () => {
    setShowProjectDetail(false);
    setSelectedProject(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/50 max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {projects.length} proje
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Bu kategoride henüz proje yok
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition cursor-pointer"
                    style={{ borderLeftColor: project.color }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {project.name}
                          </h4>
                        </div>
                        
                        {project.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="flex gap-2 flex-wrap items-center">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400">
                            {project.tasks?.length || 0} görev
                          </span>
                          
                          {project.deadline && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                              📅 {new Date(project.deadline).toLocaleDateString('tr-TR')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={onClose}
              className="w-full bg-gray-600 dark:bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>

      {/* ProjectDetailModal */}
      {showProjectDetail && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={handleCloseProjectDetail}
          onTaskUpdate={() => {}} // İhtiyaca göre eklenebilir
        />
      )}
    </>
  );
}

export default CategoryProjectsModal;