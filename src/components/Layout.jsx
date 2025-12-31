import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TaskModal from './TaskModal';
import BottomNav from './BottomNav';
import { useTasks } from '../context/TaskContext';
import { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isModalOpen, closeModal, taskToEdit } = useTasks();

  // Get current page name from path
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/today') return 'Today';
    if (path === '/upcoming') return 'Upcoming';
    if (path === '/projects') return 'Projects';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex text-slate-100 font-sans overflow-x-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72 transition-all duration-300">
        <Navbar 
          pageName={getPageName()}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Added pb-28 for BottomNav (mobile) space */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden pb-28 lg:pb-8 w-full">
          <div className="max-w-7xl mx-auto animate-fade-in space-y-8 w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Task Modal (Add/Edit) */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
