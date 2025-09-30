import { useState, useEffect } from 'react';
import { subTasksAPI } from '../../services/api';

function SubTaskList({ taskId }) {
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubTasks();
  }, [taskId]);

  const fetchSubTasks = async () => {
    try {
      const response = await subTasksAPI.getByTask(taskId);
      setSubTasks(response.data);
    } catch (err) {
      console.error('Alt görevler yüklenemedi:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSubTask.trim()) return;

    try {
      setLoading(true);
      await subTasksAPI.create({
        title: newSubTask,
        taskId: taskId,
        isCompleted: false,
      });
      setNewSubTask('');
      fetchSubTasks();
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (subTask) => {
    try {
      await subTasksAPI.update(subTask.id, {
        ...subTask,
        isCompleted: !subTask.isCompleted,
      });
      fetchSubTasks();
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await subTasksAPI.delete(id);
      fetchSubTasks();
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  const completedCount = subTasks.filter(st => st.isCompleted).length;
  const totalCount = subTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Alt Görevler ({completedCount}/{totalCount})
        </h4>
        {totalCount > 0 && (
          <span className="text-xs text-gray-500">{progress}%</span>
        )}
      </div>

      {totalCount > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Yeni alt görev ekle..."
          className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition disabled:bg-gray-400"
        >
          Ekle
        </button>
      </form>

      <div className="space-y-1.5">
        {subTasks.map((subTask) => (
          <div
            key={subTask.id}
            className="flex items-center gap-2 text-sm group"
          >
            <input
              type="checkbox"
              checked={subTask.isCompleted}
              onChange={() => handleToggle(subTask)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className={`flex-1 ${subTask.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {subTask.title}
            </span>
            <button
              onClick={() => handleDelete(subTask.id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubTaskList;