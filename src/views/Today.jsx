import { CalendarDays } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';

export default function Today() {
  const { getTodayTasks, getFilteredTasks } = useTasks();
  const todayTasks = getTodayTasks();
  const filteredTasks = getFilteredTasks(todayTasks);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 md:p-8 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-indigo-200 text-xs md:text-sm font-semibold tracking-wider uppercase">Today's Focus</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight break-words">{today}</h2>
          <p className="text-indigo-100 mt-2 text-lg">
            You have {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} scheduled for today.
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            Today's Agenda
          </h2>
        </div>
        
        <div className="p-4 space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                <CalendarDays className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-300 font-medium text-lg">No tasks for today</p>
              <p className="text-sm text-slate-500 mt-1">Enjoy your free time! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
