import { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../../services/api';

function MiniCalendar() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, projectsResponse] = await Promise.all([
        tasksAPI.getAll(),
        projectsAPI.getAll()
      ]);
      
      setTasks(tasksResponse.data.filter(task => task.dueDate));
      setProjects(projectsResponse.data.filter(project => project.deadline));
    } catch (err) {
      console.error('Veriler yüklenemedi:', err);
    } finally {
      setLoading(false);
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

  // Belirli bir gündeki öğe sayısı (task + project)
  const getItemsForDate = (date) => {
    if (!date) return { taskCount: 0, projectCount: 0, total: 0 };
    
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toISOString().split('T')[0];
    
    const taskCount = tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    ).length;

    const projectCount = projects.filter(project => 
      project.deadline && project.deadline.startsWith(dateStr)
    ).length;

    return { taskCount, projectCount, total: taskCount + projectCount };
  };

  // Seçili tarihteki task'ler ve projeler
  const getSelectedDateItems = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    const dateTasks = tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    );

    const dateProjects = projects.filter(project => 
      project.deadline && project.deadline.startsWith(dateStr)
    );

    return { tasks: dateTasks, projects: dateProjects };
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

  const selectedItems = getSelectedDateItems();
  const hasSelectedItems = selectedItems.tasks.length > 0 || selectedItems.projects.length > 0;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
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
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
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
          const items = day.isCurrentMonth ? getItemsForDate(day.date) : { taskCount: 0, projectCount: 0, total: 0 };
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
                transition-all duration-150
              `}
            >
              {day.date}
              {/* Indicators */}
              {items.total > 0 && (
                <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                  {items.taskCount > 0 && (
                    <div 
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full" 
                      title={`${items.taskCount} görev`}
                    ></div>
                  )}
                  {items.projectCount > 0 && (
                    <div 
                      className="w-1.5 h-1.5 bg-purple-500 rounded-full" 
                      title={`${items.projectCount} proje`}
                    ></div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date items */}
      {hasSelectedItems && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h4>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {/* Projects */}
            {selectedItems.projects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Projeler ({selectedItems.projects.length})
                  </span>
                </div>
                <div className="space-y-1.5 ml-4">
                  {selectedItems.projects.map((project) => (
                    <div
                      key={`project-${project.id}`}
                      className="text-xs p-2 bg-purple-50 dark:bg-purple-900/20 rounded flex items-center gap-2 border border-purple-200 dark:border-purple-800"
                    >
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: project.color || '#8b5cf6' }}
                      ></div>
                      <span className="text-gray-700 dark:text-gray-300 truncate font-medium">
                        {project.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {selectedItems.tasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Görevler ({selectedItems.tasks.length})
                  </span>
                </div>
                <div className="space-y-1.5 ml-4">
                  {selectedItems.tasks.map((task) => (
                    <div
                      key={`task-${task.id}`}
                      className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-2 border border-blue-200 dark:border-blue-800"
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
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Görev</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Proje</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniCalendar;