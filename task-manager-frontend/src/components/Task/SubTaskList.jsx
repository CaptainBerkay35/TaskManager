import { useState, useEffect } from 'react';
import { subTasksAPI } from '../../services/api';
import ConfirmDialog from '../ConfirmDialog';

function SubTaskList({ taskId, parentTask }) {
  const [subTasks, setSubTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 1,
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    subTaskId: null,
    subTaskTitle: '',
  });

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

    // Parent task deadline kontrolü (Frontend Validation)
    if (formData.dueDate && parentTask?.dueDate) {
      const subTaskDate = new Date(formData.dueDate);
      const taskDate = new Date(parentTask.dueDate);
      
      if (subTaskDate > taskDate) {
        alert(
          `Alt görev tarihi, ana görevin son teslim tarihinden (${taskDate.toLocaleDateString('tr-TR')}) sonra olamaz!`
        );
        return;
      }
    }

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
      alert('Hata: ' + (err.response?.data || err.message));
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

  const handleDeleteClick = (subTask) => {
    // Zaten siliniyorsa işlem yapma
    if (deletingIds.includes(subTask.id)) {
      return;
    }

    setDeleteConfirm({
      show: true,
      subTaskId: subTask.id,
      subTaskTitle: subTask.title,
    });
  };

  const handleDeleteConfirm = async () => {
    const subTaskId = deleteConfirm.subTaskId;

    try {
      setDeletingIds(prev => [...prev, subTaskId]);
      
      await subTasksAPI.delete(subTaskId);
      
      // Optimistic Update - Hemen UI'dan kaldır
      setSubTasks(prev => prev.filter(st => st.id !== subTaskId));
      
    } catch (err) {
      console.error('SubTask silme hatası:', err);
      
      if (err.response?.status === 404) {
        alert('Bu alt görev zaten silinmiş.');
        setSubTasks(prev => prev.filter(st => st.id !== subTaskId));
      } else if (err.response?.status === 500) {
        alert('Sunucu hatası: Alt görev silinemedi. Lütfen tekrar deneyin.');
        fetchSubTasks();
      } else {
        alert('Hata: ' + (err.response?.data || err.message));
      }
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== subTaskId));
      setDeleteConfirm({ show: false, subTaskId: null, subTaskTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, subTaskId: null, subTaskTitle: '' });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 4: return 'text-red-600 dark:text-red-400';
      case 3: return 'text-orange-600 dark:text-orange-400';
      case 2: return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-green-600 dark:text-green-400';
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

  const getMaxAllowedDate = () => {
    if (!parentTask?.dueDate) return '';
    return parentTask.dueDate.split('T')[0];
  };

  const completedCount = subTasks.filter(st => st.isCompleted).length;
  const totalCount = subTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Alt Görevler ({completedCount}/{totalCount})
          </h4>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            {showForm ? 'İptal' : '+ Ekle'}
          </button>
        </div>

        {totalCount > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3 space-y-2">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Alt görev başlığı"
              className="w-full text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-600 text-gray-800 dark:text-white placeholder-gray-400"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
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
                max={getMaxAllowedDate()}
                className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
              />
            </div>
            
            {parentTask?.dueDate && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  ℹ️ Ana görevin son teslim tarihi: <strong>{new Date(parentTask.dueDate).toLocaleDateString('tr-TR')}</strong>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm bg-indigo-600 dark:bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
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
                subTask.isCompleted 
                  ? 'bg-gray-50 dark:bg-gray-700/50' 
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
              } ${deletingIds.includes(subTask.id) ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input
                type="checkbox"
                checked={subTask.isCompleted}
                onChange={() => handleToggle(subTask)}
                disabled={deletingIds.includes(subTask.id)}
                className="mt-1 w-4 h-4 text-indigo-600 dark:text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              <div className="flex-1">
                <div className={`${
                  subTask.isCompleted 
                    ? 'line-through text-gray-400 dark:text-gray-500' 
                    : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {subTask.title}
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className={`text-xs font-medium ${getPriorityColor(subTask.priority)}`}>
                    {getPriorityText(subTask.priority)}
                  </span>
                  {subTask.dueDate && (
                    <span className={`text-xs ${
                      isOverdue(subTask.dueDate) && !subTask.isCompleted
                        ? 'text-red-600 dark:text-red-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {!subTask.isCompleted && getDaysRemaining(subTask.dueDate) + ': '}
                      {new Date(subTask.dueDate).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteClick(subTask)}
                disabled={deletingIds.includes(subTask.id)}
                className={`${
                  deletingIds.includes(subTask.id) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'opacity-0 group-hover:opacity-100'
                } text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition`}
              >
                {deletingIds.includes(subTask.id) ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Alt Görevi Sil"
        message={`"${deleteConfirm.subTaskTitle}" alt görevini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default SubTaskList;