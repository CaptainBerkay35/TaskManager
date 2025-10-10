// src/hooks/useTaskFilters.js
import { useState, useMemo } from 'react';

export function useTaskFilters(tasks) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdDate");

  console.log('🔍 useTaskFilters called');
  console.log('📊 sortBy state:', sortBy);
  console.log('⚙️ setSortBy function:', setSortBy);

  const filteredTasks = useMemo(() => {
    console.log('🔄 Filtering and sorting tasks...');
    
    // 1. Filtreleme
    let filtered = tasks.filter((task) => {
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

    // 2. Sıralama
    console.log('📋 Sorting by:', sortBy);
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdDate':
          return new Date(b.createdDate) - new Date(a.createdDate);
        
        case 'createdDateOld':
          return new Date(a.createdDate) - new Date(b.createdDate);
        
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        
        case 'dueDateFar':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        
        case 'priority':
          return b.priority - a.priority;
        
        case 'priorityLow':
          return a.priority - b.priority;
        
        case 'title':
          return a.title.localeCompare(b.title, 'tr');
        
        case 'titleDesc':
          return b.title.localeCompare(a.title, 'tr');
        
        default:
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

    console.log('✅ Filtered tasks count:', filtered.length);
    return filtered;
  }, [tasks, searchTerm, filterStatus, filterPriority, filterCategory, sortBy]);

  const returnValue = {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    filteredTasks,
  };

  console.log('📤 useTaskFilters returning:', Object.keys(returnValue));
  console.log('📤 sortBy value:', returnValue.sortBy);
  console.log('📤 setSortBy type:', typeof returnValue.setSortBy);

  return returnValue;
}