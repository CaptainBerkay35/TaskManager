import { useMemo } from 'react';

/**
 * Custom hook to transform tasks and projects into calendar events
 * @param {Array} tasks - List of tasks
 * @param {Array} projects - List of projects
 * @param {number|null} selectedProjectId - ID of selected project for filtering
 */
function useCalendarEvents(tasks, projects, selectedProjectId = null) {
  const events = useMemo(() => {
    // Görevleri filtrele (proje seçiliyse)
    let filteredTasks = tasks.filter(task => task.dueDate);
    
    if (selectedProjectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === selectedProjectId);
    }

    // Görevler için eventler
    const taskEvents = filteredTasks.map(task => ({
      id: `task-${task.id}`,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      resource: { type: 'task', data: task },
      allDay: true,
    }));

    // Projeler için eventler (deadline olanlar)
    // Eğer proje seçiliyse, sadece seçili projeyi göster
    let filteredProjects = projects.filter(project => project.deadline && project.isActive);
    
    if (selectedProjectId) {
      filteredProjects = filteredProjects.filter(project => project.id === selectedProjectId);
    }

    const projectEvents = filteredProjects.map(project => ({
      id: `project-${project.id}`,
      title: `📁 ${project.name}`,
      start: new Date(project.deadline),
      end: new Date(project.deadline),
      resource: { type: 'project', data: project },
      allDay: true,
    }));

    return [...taskEvents, ...projectEvents];
  }, [tasks, projects, selectedProjectId]);

  return events;
}

export default useCalendarEvents;