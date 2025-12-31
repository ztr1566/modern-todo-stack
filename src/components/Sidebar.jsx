import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarClock, 
  FolderKanban, 
  X,
  CheckCircle2
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/today', icon: CalendarDays, label: 'Today' },
  { path: '/upcoming', icon: CalendarClock, label: 'Upcoming' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside 
      className={`
        fixed top-0 left-0 h-full w-72 
        bg-slate-900 border-r border-slate-800
        z-30 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="h-24 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Flow</span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold
              transition-all duration-200 group relative overflow-hidden
              ${isActive 
                ? 'text-white shadow-lg shadow-indigo-500/10' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active Background Gradient */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100" />
                )}
                
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'group-hover:text-indigo-400 transition-colors'}`} />
                <span className="relative z-10 tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="px-6 py-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-20 h-20 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-white relative z-10 uppercase tracking-wider">Pro Tip</p>
          <p className="text-xs text-slate-400 mt-1 relative z-10 leading-relaxed">
            Break big tasks into smaller steps to keep your momentum.
          </p>
        </div>
      </div>
    </aside>
  );
}
