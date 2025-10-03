import { useCallback } from 'react';

/**
 * Custom hook for getting event styles based on type and priority
 */
function useEventStyleGetter() {
  const getEventStyle = useCallback((event) => {
    const { type, data } = event.resource;
    let backgroundColor = '#6366f1';
    let borderStyle = '0px';
    let fontWeight = '500';

    if (type === 'task') {
      const task = data;
      // Öncelik bazlı renkler
      if (task.priority === 4) {
        backgroundColor = '#ef4444'; // Acil - Kırmızı
      } else if (task.priority === 3) {
        backgroundColor = '#f59e0b'; // Yüksek - Turuncu
      } else if (task.priority === 2) {
        backgroundColor = '#3b82f6'; // Orta - Mavi
      } else {
        backgroundColor = '#10b981'; // Düşük - Yeşil
      }

      // Tamamlanmış görevler için gri
      if (task.isCompleted) {
        backgroundColor = '#9ca3af';
      }
    } else if (type === 'project') {
      // Projeler için özel stil - kalın border ve farklı görünüm
      backgroundColor = data.color || '#8b5cf6';
      borderStyle = `3px solid ${data.color || '#8b5cf6'}`;
      fontWeight = '700';
    }

    return {
      style: {
        backgroundColor: type === 'project' ? `${backgroundColor}20` : backgroundColor,
        borderRadius: '6px',
        opacity: type === 'task' && data.isCompleted ? 0.6 : 1,
        color: type === 'project' ? backgroundColor : 'white',
        border: type === 'project' ? borderStyle : '0px',
        display: 'block',
        fontSize: '0.85rem',
        padding: type === 'project' ? '4px 8px' : '2px 5px',
        fontWeight: fontWeight,
        boxShadow: type === 'project' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
      },
    };
  }, []);

  return getEventStyle;
}

export default useEventStyleGetter;