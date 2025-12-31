import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext();

const initialCategories = [
  { id: 'project', name: 'Project', color: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  { id: 'personal', name: 'Personal', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  { id: 'work', name: 'Work', color: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  { id: 'health', name: 'Health', color: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' }
];

export function TaskProvider({ children }) {
  // Load tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('flow_todo_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Load categories from localStorage or use defaults
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('flow_todo_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [initialTaskValues, setInitialTaskValues] = useState(null);

  useEffect(() => {
    localStorage.setItem('flow_todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('flow_todo_categories', JSON.stringify(categories));
  }, [categories]);

  // --- Task Operations ---
  
  const addTask = (task) => {
    const newTask = { ...task, id: uuidv4(), status: 'pending' };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedFields } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } 
        : task
    ));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => task.status !== 'completed'));
  };

  // --- Category Operations ---

  const addCategory = (name, colorPreset) => {
    // colorPreset should be an object likely selected from a list of predefined styles
    const newCat = {
      id: uuidv4(),
      name,
      ...colorPreset // Spread color styles (bg, text, border etc)
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Optionally move tasks to a default category or leave them orphaned (fallback to 'project')
  };

  // --- Drag and Drop Specific ---
  
  const updateTaskCategory = (taskId, newCategoryId) => {
    updateTask(taskId, { category: newCategoryId });
  };
  
  const updateTaskDate = (taskId, newDate) => {
    updateTask(taskId, { date: newDate });
  };

  // --- Filtering & Stats ---

  const getFilteredTasks = (taskList = tasks) => {
    if (!searchQuery) return taskList;
    return taskList.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTodayTasks = () => {
    const today = getTodayDate();
    return tasks.filter(task => task.date === today);
  };

  const getUpcomingTasks = () => {
    const today = getTodayDate();
    return tasks.filter(task => task.date > today);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, completionRate };
  };

  // --- Modal Control ---

  const openModal = (task = null, initialValues = null) => {
    setTaskToEdit(task);
    setInitialTaskValues(initialValues);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    setInitialTaskValues(null);
  };

  const value = {
    tasks,
    categories,
    initialCategories, // Exposed for reference/reset if needed
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
    clearCompleted,
    addCategory,
    deleteCategory,
    updateTaskCategory,
    updateTaskDate,
    getFilteredTasks,
    getTodayTasks,
    getUpcomingTasks,
    getStats,
    isModalOpen,
    taskToEdit,
    initialTaskValues,
    openModal,
    closeModal
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}

// Helper export
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
