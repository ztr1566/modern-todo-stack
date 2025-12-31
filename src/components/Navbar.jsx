import { Menu, Search, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Navbar({ pageName, onMenuClick }) {
  const { searchQuery, setSearchQuery, openModal } = useTasks();

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 hidden lg:flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{pageName}</h1>
          <p className="text-sm text-slate-400 hidden md:block">Manage your tasks efficiently</p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-64 pl-10 pr-4 py-2.5
              bg-slate-800 border border-slate-700 rounded-xl
              text-sm text-slate-200 placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
              transition-all shadow-sm
            "
          />
        </div>

        {/* Add task button */}
        <button 
          onClick={() => openModal()}
          className="
            flex items-center gap-2 px-5 py-2.5
            bg-gradient-to-r from-indigo-500 to-purple-600 
            hover:from-indigo-400 hover:to-purple-500
            text-white font-medium rounded-xl
            shadow-lg shadow-indigo-500/25
            transition-all duration-200
            active:scale-95 border border-white/10
          "
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  );
}
