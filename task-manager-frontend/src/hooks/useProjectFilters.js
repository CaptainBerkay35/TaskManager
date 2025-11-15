import { useState, useMemo } from 'react';

export function useProjectFilters(projects) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdDate');

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(project =>
        project.categories && project.categories.some(cat => cat.id === parseInt(filterCategory))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdDate':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'createdDateOld':
          return new Date(a.createdDate) - new Date(b.createdDate);
        case 'deadline':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case 'deadlineFar':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(b.deadline) - new Date(a.deadline);
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'nameDesc':
          return b.name.localeCompare(a.name, 'tr');
        case 'taskCount':
          return (b.tasks?.length || 0) - (a.tasks?.length || 0);
        case 'taskCountLow':
          return (a.tasks?.length || 0) - (b.tasks?.length || 0);
        default:
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

    return filtered;
  }, [projects, searchTerm, filterCategory, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    filteredProjects: filteredAndSortedProjects,
  };
}