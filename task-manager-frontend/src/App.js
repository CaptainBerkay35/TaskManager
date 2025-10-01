import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TaskList from './components/Task/TaskList';
import CategoryManager from './components/Category/CategoryManager';
import Dashboard from './components/Dashboard/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import Login from './pages/Login';
import Register from './pages/Register';

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
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    // TaskForm'dan gelen kategori sekmesine geçiş eventi
    const handleSwitchToCategories = () => {
      setActiveTab('categories');
    };

    window.addEventListener('switchToCategories', handleSwitchToCategories);
    return () => {
      window.removeEventListener('switchToCategories', handleSwitchToCategories);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Görev Yönetim Sistemi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Azure SQL + React ile görevlerinizi organize edin
            </p>
            {user && (
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                Hoş geldin, {user.fullName || user.username}!
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Çıkış Yap
              </button>
            )}
          </div>
        </header>

        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Görevler
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'categories'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Kategoriler
            </button>
          </div>
        </div>
        
        <main>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'categories' && <CategoryManager />}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
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