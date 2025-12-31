import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarClock, 
  FolderKanban,
  Plus 
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/today', icon: CalendarDays, label: 'Today' },
  // Center button will be injected here
  { path: '/upcoming', icon: CalendarClock, label: 'Plan' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
];

export default function BottomNav() {
  const { openModal } = useTasks();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 pt-2 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pointer-events-none">
      <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto">
        <nav className="flex items-center justify-around p-2">
           {navItems.map(({ path, icon: Icon, label }, index) => {
             // Inject Add Button in middle (after 2nd item)
             const isCenter = index === 2;
             
             return (
               <div key={path} className="flex contents">
                 {isCenter && (
                   <button
                     onClick={() => openModal()}
                     className="
                       relative -top-6 
                       bg-gradient-to-tr from-indigo-500 to-purple-600 
                       text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 
                       border-4 border-slate-900 hover:scale-105 transition-transform
                     "
                   >
                     <Plus className="w-7 h-7" />
                   </button>
                 )}
                 
                 <NavLink
                    to={path}
                    className={({ isActive }) => `
                      relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'text-indigo-400 -translate-y-4' 
                        : 'text-slate-500 hover:text-slate-300'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`
                          p-2 rounded-full transition-all duration-300
                          ${isActive 
                            ? 'bg-slate-800 shadow-lg shadow-indigo-500/20 border border-indigo-500/20 ring-4 ring-slate-900' 
                            : 'bg-transparent'
                          }
                        `}>
                          <Icon className={`w-6 h-6 ${isActive ? 'fill-indigo-500/10' : ''}`} />
                        </div>
                        <span className={`
                          text-[10px] font-bold tracking-wide uppercase transition-all duration-300 absolute -bottom-2
                          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                        `}>
                          {label}
                        </span>
                      </>
                    )}
                  </NavLink>
               </div>
             );
           })}
        </nav>
      </div>
    </div>
  );
}
