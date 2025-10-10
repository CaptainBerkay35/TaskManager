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
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState([]);
  const [dateError, setDateError] = useState(''); // ✅ EKLENEN: Date validation error
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
      setFetchLoading(true); // ✅ EKLENEN
      const response = await subTasksAPI.getByTask(taskId);
      setSubTasks(response.data);
    } catch (err) {
      console.error('Alt görevler yüklenemedi:', err);
    } finally {
      setFetchLoading(false); // ✅ EKLENEN
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (formData.dueDate && parentTask?.dueDate) {
      const subTaskDate = new Date(formData.dueDate);
      const taskDate = new Date(parentTask.dueDate);
      
      if (subTaskDate > taskDate) {
        // ✅ Alert yerine inline error kullanabiliriz ama şimdilik bırakıyoruz
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
      fetchSubTasks(); // Bu zaten setFetchLoading kullanacak
    } catch (err) {
      console.error('Alt görev eklenemedi:', err);
      // ✅ Error handling - alert yerine toast kullanılabilir
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
      console.error('Alt görev güncellenemedi:', err);
    }
  };

  const handleDeleteClick = (subTask) => {
    if (deletingIds.includes(subTask.id)) return;
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
      setSubTasks(prev => prev.filter(st => st.id !== subTaskId));
    } catch (err) {
      console.error('SubTask silme hatası:', err);
      if (err.response?.status === 404) {
        // Zaten silinmiş, UI'dan kaldır
        setSubTasks(prev => prev.filter(st => st.id !== subTaskId));
      } else {
        // Hata durumunda refresh
        fetchSubTasks();
      }
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== subTaskId));
      setDeleteConfirm({ show: false, subTaskId: null, subTaskTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, subTaskId: null, subTaskTitle: '' });
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 4: return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: '🔥', label: 'Acil' };
      case 3: return { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: '⚠️', label: 'Yüksek' };
      case 2: return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: '📋', label: 'Orta' };
      default: return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', icon: '✅', label: 'Düşük' };
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
    return `${days} gün`;
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
      {/* ✅ MODERN HEADER */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">
                Alt Görevler
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {completedCount} / {totalCount} tamamlandı
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${
              showForm
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'
            }`}
          >
            {showForm ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                İptal
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ekle
              </span>
            )}
          </button>
        </div>

        {/* ✅ PROGRESS BAR */}
        {totalCount > 0 && (
          <div className="relative">
            <div className="w-full bg-white/60 dark:bg-gray-700/60 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {progress}%
            </div>
          </div>
        )}
      </div>

      {/* ✅ FORM - Modern Card */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 mb-4 shadow-lg border border-gray-200 dark:border-gray-700 animate-slideDown">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Yeni Alt Görev</h5>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Alt görev başlığı girin..."
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition"
                >
                  <option value={1}>✅ Düşük</option>
                  <option value={2}>📋 Orta</option>
                  <option value={3}>⚠️ Yüksek</option>
                  <option value={4}>🔥 Acil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Son Tarih
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  max={getMaxAllowedDate()}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition"
                />
              </div>
            </div>
            
            {parentTask?.dueDate && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Ana görevin son tarihi: <strong>{new Date(parentTask.dueDate).toLocaleDateString('tr-TR')}</strong>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ekle
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ✅ SUBTASK LIST - Modern Cards */}
      {fetchLoading ? (
        // ✅ LOADING SKELETON
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : subTasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Henüz alt görev eklenmemiş
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {subTasks.map((subTask) => {
            const priorityConfig = getPriorityConfig(subTask.priority);
            const overdue = isOverdue(subTask.dueDate) && !subTask.isCompleted;
            
            return (
              <div
                key={subTask.id}
                className={`group relative bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm border transition-all hover:shadow-md ${
                  subTask.isCompleted 
                    ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                    : overdue
                    ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
                    : 'border-gray-200 dark:border-gray-700'
                } ${deletingIds.includes(subTask.id) ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* ✅ Custom Checkbox */}
                  <label className="relative flex items-center cursor-pointer mt-0.5">
                    <input
                      type="checkbox"
                      checked={subTask.isCompleted}
                      onChange={() => handleToggle(subTask)}
                      disabled={deletingIds.includes(subTask.id)}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all peer-checked:bg-gradient-to-br peer-checked:from-green-500 peer-checked:to-emerald-600 peer-checked:border-green-500 flex items-center justify-center ${
                      subTask.isCompleted 
                        ? '' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                    }`}>
                      {subTask.isCompleted && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </label>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm sm:text-base font-medium mb-1.5 ${
                      subTask.isCompleted 
                        ? 'line-through text-gray-400 dark:text-gray-600' 
                        : 'text-gray-800 dark:text-white'
                    }`}>
                      {subTask.title}
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`${priorityConfig.bg} ${priorityConfig.color} px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1`}>
                        <span>{priorityConfig.icon}</span>
                        {priorityConfig.label}
                      </span>
                      
                      {subTask.dueDate && (
                        <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                          overdue
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {!subTask.isCompleted && getDaysRemaining(subTask.dueDate) && (
                            <span className="font-bold">{getDaysRemaining(subTask.dueDate)}</span>
                          )}
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(subTask.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ✅ Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(subTask)}
                    disabled={deletingIds.includes(subTask.id)}
                    className={`${
                      deletingIds.includes(subTask.id) 
                        ? 'opacity-100' 
                        : 'opacity-0 group-hover:opacity-100'
                    } flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      deletingIds.includes(subTask.id)
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {deletingIds.includes(subTask.id) ? (
                      <svg className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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