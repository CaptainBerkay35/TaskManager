import { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';

function MiniCalendar() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data.filter(task => task.dueDate));
    } catch (err) {
      console.error('Görevler yüklenemedi:', err);
    }
  };

  // Ayın günlerini hesapla
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Önceki ayın günleri
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true });
    }

    return days;
  };

  // Belirli bir gündeki görev sayısı
  const getTasksForDate = (date) => {
    if (!date) return 0;
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toISOString().split('T')[0];
    
    return tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    ).length;
  };

  // Seçili tarihteki görevler
  const getSelectedDateTasks = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    );
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), date));
    }
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!date) return false;
    return (
      date === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          📅 Takvim
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const taskCount = day.isCurrentMonth ? getTasksForDate(day.date) : 0;
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day.date)}
              disabled={!day.isCurrentMonth}
              className={`
                aspect-square p-1 rounded text-xs relative
                ${!day.isCurrentMonth ? 'text-gray-300 dark:text-gray-700 cursor-default' : ''}
                ${isToday(day.date) ? 'bg-indigo-100 dark:bg-indigo-900 font-bold' : ''}
                ${isSelected(day.date) ? 'ring-2 ring-indigo-500' : ''}
                ${day.isCurrentMonth && !isToday(day.date) ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                text-gray-700 dark:text-gray-300
              `}
            >
              {day.date}
              {taskCount > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date tasks */}
      {getSelectedDateTasks().length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {getSelectedDateTasks().map((task) => (
              <div
                key={task.id}
                className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 4 ? 'bg-red-500' :
                  task.priority === 3 ? 'bg-orange-500' :
                  task.priority === 2 ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className="text-gray-700 dark:text-gray-300 truncate">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MiniCalendar;