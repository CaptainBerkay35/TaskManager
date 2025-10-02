import { useState, useMemo } from 'react';

export function useTaskFilters(tasks) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;
      
      const matchesPriority =
        filterPriority === "all" || task.priority === parseInt(filterPriority);
      
      const matchesCategory =
        filterCategory === "all" || task.categoryId === parseInt(filterCategory);

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority, filterCategory]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    filteredTasks,
  };
}