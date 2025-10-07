import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/tr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { tasksAPI, projectsAPI } from "../../services/api";
import TaskForm from "../Task/TaskForm";
import TaskDetailModal from "../Task/TaskDetailModal";
import ProjectDetailModal from "../Project/ProjectDetailModal";
import CalendarHeader from "./CalendarHeader";
import CalendarLegend from "./CalendarLegend";
import CalendarStats from "./CalendarStats";
import CalendarProjectFilter from "./CalendarProjectFilter";
import CalendarMonthSelector from "./CalendarMonthSelector";
import useCalendarEvents from "../../hooks/useCalendarEvents";
import useEventStyleGetter from "../../hooks/useEventStyleGetter";
import { CALENDAR_MESSAGES } from "../../constants/calendarMessages";

// Türkçe yerelleştirme
moment.locale("tr");
const localizer = momentLocalizer(moment);

function CalendarView() {
  // State
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterProjectId, setFilterProjectId] = useState(null);

  // Custom Hooks
  const events = useCalendarEvents(tasks, projects, filterProjectId);
  const eventStyleGetter = useEventStyleGetter();

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  // Data Fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        tasksAPI.getAll(),
        projectsAPI.getAll(),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error("Veriler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleSelectEvent = (event) => {
    const { type, data } = event.resource;

    if (type === "task") {
      setSelectedTask(data);
      setShowTaskDetail(true);
    } else if (type === "project") {
      setSelectedProject(data);
      setShowProjectDetail(true);
    }
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowTaskForm(true);
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
    fetchData();
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  const handleTaskFormSuccess = () => {
    fetchData();
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  const handleCloseProjectDetail = () => {
    setShowProjectDetail(false);
    setSelectedProject(null);
  };

  const handleProjectUpdate = () => {
    fetchData();
  };

  const handleProjectFilterChange = (projectId) => {
    setFilterProjectId(projectId);
  };

  const handleMonthChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Custom Toolbar Component
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <div className=" mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToBack}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              ← Önceki
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-medium"
            >
              Bugün
            </button>
            <button
              onClick={goToNext}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Sonraki →
            </button>
          </div>

          {/* Month/Year Selector */}
          <CalendarMonthSelector
            currentDate={toolbar.date}
            onDateChange={handleMonthChange}
          />

          {/* View Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("month")}
              className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
                view === "month"
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Ay
            </button>
            <button
              onClick={() => setView("agenda")}
              className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
                view === "agenda"
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Ajanda
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <CalendarHeader onNewTask={handleNewTask} />

        {/* Project Filter */}
        <div className="mt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <CalendarProjectFilter
            projects={projects}
            selectedProjectId={filterProjectId}
            onProjectChange={handleProjectFilterChange}
          />
          {filterProjectId && (
            <div className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
              <span className="font-medium">
                Filtreleniyor:{" "}
                {projects.find((p) => p.id === filterProjectId)?.name}
              </span>
            </div>
          )}
        </div>

        <CalendarLegend />
        <CalendarStats
          tasks={tasks}
          projects={projects}
          selectedProjectId={filterProjectId}
          currentMonth={selectedDate}
        />
      </div>

      {/* Calendar Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div style={{ height: 800 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            selectable={false}
            draggableAccessor={() => false}
            views={["month", "agenda"]}
            view={view}
            onView={setView}
            date={selectedDate}
            onNavigate={setSelectedDate}
            messages={CALENDAR_MESSAGES}
            popup
            className="dark:text-white"
            components={{
              toolbar: CustomToolbar,
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {showTaskDetail && selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={handleCloseTaskDetail} />
      )}

      {showTaskForm && (
        <TaskForm
          task={selectedTask}
          onClose={handleCloseTaskForm}
          onRefresh={handleTaskFormSuccess}
        />
      )}

      {showProjectDetail && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={handleCloseProjectDetail}
          onTaskUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
}

export default CalendarView;
