import { useState, useEffect } from "react";
import { projectsAPI } from "../../services/api";

function ProjectSidebar({
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
}) {
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
      console.error("Projeler yüklenemedi:", err);
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
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        {!isCollapsed && (
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Projeler
          </h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          title={isCollapsed ? "Genişlet" : "Daralt"}
          aria-label={isCollapsed ? "Genişlet" : "Daralt"}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Projects List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : projects.length === 0 ? (
          !isCollapsed && (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Henüz proje yok
              </p>
              <button
                onClick={onCreateProject}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                İlk projenizi oluşturun →
              </button>
            </div>
          )
        ) : (
          <div className="space-y-1">
            {/* "Tümü" seçeneği */}
            <button
              onClick={() => onProjectSelect(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition group ${
                selectedProjectId === null
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title={isCollapsed ? "Tüm Görevler" : ""}
            >
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {!isCollapsed && (
                <span className="text-sm font-medium flex-1 text-left">
                  Tüm Görevler
                </span>
              )}
            </button>

            {/* Projeler */}
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition group ${
                  selectedProjectId === project.id
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={isCollapsed ? project.name : ""}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate flex-1 text-left">
                    {project.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Yeni Proje Butonu */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={onCreateProject}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-medium text-sm ${
            isCollapsed ? "px-2" : ""
          }`}
          title={isCollapsed ? "Yeni Proje" : ""}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          {!isCollapsed && <span>Yeni Proje</span>}
        </button>
      </div>
    </div>
  );
}

export default ProjectSidebar;
