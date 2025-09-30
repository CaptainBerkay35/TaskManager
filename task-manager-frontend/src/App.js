import { useState } from 'react';
import TaskList from './components/Task/TaskList.jsx';
import CategoryManager from './components/Category/CategoryManager.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Görev Yönetim Sistemi
          </h1>
          <p className="text-gray-600">
            Azure SQL + React ile görevlerinizi organize edin
          </p>
        </header>

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Görevler
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'categories'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Kategoriler
            </button>
          </div>
        </div>
        
        <main>
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'categories' && <CategoryManager />}
        </main>
      </div>
    </div>
  );
}

export default App;