import { useState, useEffect } from 'react';
import { subTasksAPI } from '../../services/api';

function SubTaskList({ taskId }) {
  const [subTasks, setSubTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 1,
    dueDate: '',
  });
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
    if (!formData.title.trim()) return;

    try {
      setLoading(true);
      await subTasksAPI.create({
        title: formData.title,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        taskId: taskId,
        isCompleted: false,
      });
      setFormData({ title: '', priority: 1, dueDate: '' });
      setShowForm(false);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 4: return 'text-red-600';
      case 3: return 'text-orange-600';
      case 2: return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 4: return 'Acil';
      case 3: return 'Yüksek';
      case 2: return 'Orta';
      default: return 'Düşük';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Gecikmiş';
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Yarın';
    return `${days} gün kaldı`;
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
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showForm ? 'İptal' : '+ Ekle'}
        </button>
      </div>

      {totalCount > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Alt görev başlığı"
            className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value={1}>Düşük</option>
              <option value={2}>Orta</option>
              <option value={3}>Yüksek</option>
              <option value={4}>Acil</option>
            </select>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition"
          >
            {loading ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {subTasks.map((subTask) => (
          <div
            key={subTask.id}
            className={`flex items-start gap-2 text-sm p-2 rounded group ${
              subTask.isCompleted ? 'bg-gray-50' : 'bg-white border border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={subTask.isCompleted}
              onChange={() => handleToggle(subTask)}
              className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className={`${subTask.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {subTask.title}
              </div>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className={`text-xs font-medium ${getPriorityColor(subTask.priority)}`}>
                  {getPriorityText(subTask.priority)}
                </span>
                {subTask.dueDate && (
                  <span className={`text-xs ${
                    isOverdue(subTask.dueDate) && !subTask.isCompleted
                      ? 'text-red-600 font-medium'
                      : 'text-gray-500'
                  }`}>
                    {!subTask.isCompleted && getDaysRemaining(subTask.dueDate) + ': '}
                    {new Date(subTask.dueDate).toLocaleDateString('tr-TR')}
                  </span>
                )}
              </div>
            </div>
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