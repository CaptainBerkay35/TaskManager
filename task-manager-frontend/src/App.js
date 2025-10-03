import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CalendarView from './components/Calendar/CalendarView'; 
import CategoryManager from "./components/Category/CategoryManager";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectManager from "./components/Project/ProjectManager";
import ProjectSidebar from "./components/Project/ProjectSidebar";
import ProjectTaskView from "./components/Project/ProjectTaskView";
import ThemeToggle from "./components/ThemeToggle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './styles/calendar-custom.css'; // YENİ EKLENEN CSS


// Korumalı Route bileşeni
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Login için zaten giriş yapmış kullanıcıları yönlendir
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Ana uygulama içeriği
const AppContent = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    // TaskForm'dan gelen kategori sekmesine geçiş eventi
    const handleSwitchToCategories = () => {
      setActiveTab("categories");
    };

    window.addEventListener("switchToCategories", handleSwitchToCategories);
    return () => {
      window.removeEventListener(
        "switchToCategories",
        handleSwitchToCategories
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Sadece tasks sekmesinde görünür */}
        {activeTab === "tasks" && (
          <ProjectSidebar
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
            onCreateProject={() => setShowProjectForm(true)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Görev Yönetim Sistemi
                </h1>
                {user && (
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                    Hoş geldin, {user.fullName || user.username}!
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  title="Çıkış"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 inline-flex gap-1">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    activeTab === "dashboard"
                      ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    activeTab === "tasks"
                      ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Görevler
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    activeTab === "projects"
                      ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Proje Yönetimi
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    activeTab === 'calendar'
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  📅 Takvim
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    activeTab === "categories"
                      ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Kategoriler
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "tasks" && (
              <ProjectTaskView projectId={selectedProjectId} />
            )}
            {activeTab === "projects" && <ProjectManager />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === "categories" && <CategoryManager />}
          </main>
        </div>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Yeni Proje
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Proje oluşturmak için "Proje Yönetimi" sekmesine gidin.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActiveTab("projects");
                  setShowProjectForm(false);
                }}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Proje Yönetimine Git
              </button>
              <button
                onClick={() => setShowProjectForm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
