import { Trash2, Calendar, Pencil } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const categoryColors = {
  project: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  personal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  work: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  health: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

export default function TaskItem({ task }) {
  const { toggleStatus, deleteTask, openModal } = useTasks();
  const isCompleted = task.status === 'completed';

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prevent edit/delete when clicking checkbox
  const handleEditClick = (e) => {
    e.stopPropagation();
    openModal(task);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <div 
      className={`
        group flex items-center gap-3 sm:gap-4 p-3 sm:p-4
        bg-slate-800 rounded-xl border border-slate-700/50
        hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5
        transition-all duration-200 w-full max-w-full
        ${isCompleted ? 'opacity-50 grayscale-[0.5]' : ''}
      `}
    >
      {/* Checkbox */}
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => toggleStatus(task.id)}
          className="
            peer appearance-none w-5 h-5 
            border-2 border-slate-500 rounded-md 
            checked:bg-indigo-500 checked:border-indigo-500
            hover:border-indigo-400 cursor-pointer transition-colors
          "
        />
        <svg 
          className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
          viewBox="0 0 12 10" 
          fill="none"
        >
          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Task content */}
      <div className="flex-1 min-w-0 w-full overflow-hidden">
        <p className={`font-medium text-sm sm:text-base text-slate-200 break-all w-full line-clamp-3 md:line-clamp-none ${isCompleted ? 'line-through text-slate-500' : ''}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(task.category)}`}>
            {task.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">
            <Calendar className="w-3 h-3" />
            {formatDate(task.date)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={handleEditClick}
          className="
            p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10
            rounded-lg transition-all
          "
          aria-label="Edit task"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="
            p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10
            rounded-lg transition-all
          "
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
