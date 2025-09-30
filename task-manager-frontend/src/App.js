import { useState } from 'react';
import TaskList from './components/Task/TaskList';
import CategoryManager from './components/Category/CategoryManager';
import Dashboard from './components/Dashboard/Dashboard';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');

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
          </div>
          <ThemeToggle />
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
}

export default App;