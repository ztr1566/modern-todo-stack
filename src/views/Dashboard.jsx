import { useState } from 'react';
import { ListChecks, CheckCircle, Clock, Trash2, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import StatsCard from '../components/StatsCard';
import ProgressCircle from '../components/ProgressCircle';
import TaskItem from '../components/TaskItem';

export default function Dashboard() {
  const { tasks, getStats, clearCompleted, getFilteredTasks } = useTasks();
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending'
  
  const stats = getStats();
  const searchedTasks = getFilteredTasks(tasks);
  
  // Apply status filter
  const filteredTasks = searchedTasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const hasCompletedTasks = tasks.some(t => t.status === 'completed');

  return (
    <div className="flex flex-col gap-6 pb-4 xl:h-[calc(100vh-8rem)]">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none opacity-30 mix-blend-screen" />

      {/* Main Layout: Side by Side with Equal Height */}
      <div className="flex flex-col xl:flex-row gap-8 relative z-10 h-full">
        
        {/* Left Column: Overview (60% on desktop, 100% on mobile) */}
        <div className="w-full xl:w-[60%] flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 h-8 shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Overview</h2>
          </div>
          
          {/* Overview Container */}
          <div className="
            flex-1
            sm:bg-slate-800/40 sm:backdrop-blur-md sm:border sm:border-slate-700/50 
            sm:rounded-[32px] sm:shadow-2xl sm:shadow-black/20
            sm:p-6 flex items-center justify-center
            h-full
          ">
            <div className="w-full h-full flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-6">
              <div className="flex-1 flex flex-col justify-center sm:block sm:h-auto">
                 <StatsCard 
                   icon={ListChecks} 
                   label="Total" 
                   value={stats.total}
                   color="primary"
                   className="h-full"
                   onClick={() => setStatusFilter('all')}
                   isActive={statusFilter === 'all'}
                 />
              </div>
              <div className="flex-1 flex flex-col justify-center sm:block sm:h-auto">
                 <StatsCard 
                   icon={CheckCircle} 
                   label="Done" 
                   value={stats.completed}
                   color="emerald"
                   className="h-full"
                   onClick={() => setStatusFilter('completed')}
                   isActive={statusFilter === 'completed'}
                 />
              </div>
              <div className="flex-1 flex flex-col justify-center sm:block sm:h-auto">
                 <StatsCard 
                   icon={Clock} 
                   label="Pending" 
                   value={stats.pending}
                   color="amber"
                   className="h-full"
                   onClick={() => setStatusFilter('pending')}
                   isActive={statusFilter === 'pending'}
                 />
              </div>
              
              {/* Premium Progress Card (Rate) */}
              <div className="flex-1 flex flex-col justify-center h-full sm:block sm:h-auto">
                <div className="
                  relative overflow-hidden
                  bg-gradient-to-br from-slate-800/80 to-slate-900/80
                  rounded-[20px] sm:rounded-3xl p-4 sm:p-6
                  transition-all duration-300
                  group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20
                  h-full flex flex-col justify-between border border-white/5
                ">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-sm font-black tracking-widest uppercase text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                       Rate
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>

                  {/* Value */}
                  <div className="relative z-10 flex items-baseline gap-1">
                     <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter">{stats.completionRate}</span>
                     <span className="text-lg text-slate-500 font-bold">%</span>
                  </div>

                   {/* Linear Progress Bar */}
                   <div className="relative z-10 w-full h-3 bg-slate-700/50 rounded-full overflow-hidden mt-auto">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${stats.completionRate}%` }}
                      >
                         <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Task List (40%) - Hidden on mobile/tablet */}
        <div className="hidden xl:flex w-full xl:w-[40%] flex-col h-full">
           <div className="flex items-center justify-between mb-4 h-8 shrink-0">
             <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">
                {statusFilter === 'all' ? 'Your Tasks' : `${statusFilter} Tasks`}
             </h2>
              {hasCompletedTasks && (
                <button
                  onClick={clearCompleted}
                  className="
                    flex items-center gap-2 text-xs font-bold
                    text-rose-400 hover:text-rose-300
                    transition-colors uppercase tracking-wider
                  "
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Done
                </button>
              )}
           </div>

          <div className="
            flex-1
            bg-slate-800/40 backdrop-blur-md border border-slate-700/50 
            rounded-[32px] overflow-hidden shadow-2xl shadow-black/20
            flex flex-col relative
          ">
            {/* Scrollable Area */}
            <div className="absolute inset-0 overflow-y-auto p-6 scroll-smooth">
              {filteredTasks.length > 0 ? (
                <div className="flex flex-col gap-3 pb-6">
                  {filteredTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                  
                  {/* Bottom spacer for safe scrolling */}
                  <div className="h-8"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center border border-slate-700 shadow-xl">
                      <CheckCircle2 className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">No {statusFilter} tasks!</h3>
                  <p className="text-slate-400 mt-2 max-w-[200px] mx-auto">
                    {statusFilter === 'completed' ? "Time to get to work." : "You're all clear."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
