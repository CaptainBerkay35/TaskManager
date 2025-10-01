import { useState, useEffect } from 'react';
import { projectsAPI } from '../../services/api';

function ProjectSidebar({ selectedProjectId, onProjectSelect, onCreateProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error('Projeler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  // Parent component'ten yenileme için expose et
  useEffect(() => {
    window.refreshProjectSidebar = fetchProjects;
    return () => {
      delete window.refreshProjectSidebar;
    };
  }, []);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {!isCollapsed && (
          <h3 className="font-semibold text-gray-800 dark:text-white">Projeler</h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          title={isCollapsed ? 'Genişlet' : 'Daralt'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

     

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : projects.length === 0 ? (
          !isCollapsed && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Henüz proje yok
            </p>
          )
        ) : (
          <div className="space-y-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition group ${
                  selectedProjectId === project.id
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                title={isCollapsed ? project.name : ''}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm truncate">{project.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                      {project.tasks?.length || 0}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Project Button */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCreateProject}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          title={isCollapsed ? 'Yeni Proje' : ''}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {!isCollapsed && <span className="font-medium">Yeni Proje</span>}
        </button>
      </div>
    </div>
  );
}

export default ProjectSidebar;