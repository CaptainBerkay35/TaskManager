import TaskList from './components/TaskList.jsx';

function App() {
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
        
        <main>
          <TaskList />
        </main>
      </div>
    </div>
  );
}

export default App;