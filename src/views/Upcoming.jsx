import { useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import SortableTaskItem from '../components/SortableTaskItem';
import { DndContext, DragOverlay, defaultDropAnimationSideEffects, useSensor, useSensors, MouseSensor, TouchSensor, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

function FunctionalityDateGroupWrapper({ date, formattedDate, tasks, onAddTask }) {
  // Make the whole date group a drop target
  const { setNodeRef } = useDroppable({
    id: date,
  });

  return (
    <div ref={setNodeRef} className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-sm transition-colors hover:border-amber-500/30">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <CalendarClock className="w-5 h-5" />
            {formattedDate}
            </h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tasks.length} Tasks</span>
        </div>
        <div className="p-4 space-y-3 min-h-[100px]">
             <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {tasks.map(task => (
                    <SortableTaskItem key={task.id} task={task} />
                ))}
            </SortableContext>
            {tasks.length === 0 && (
                <div className="text-center py-4 text-slate-500 text-sm italic dashed-border border-slate-700 border border-dashed rounded-lg">
                    Drop to move to this date
                </div>
            )}
        </div>
    </div>
  );
}

export default function Upcoming() {
  const { getUpcomingTasks, getFilteredTasks, openModal, updateTaskDate } = useTasks();
  const upcomingTasks = getUpcomingTasks();
  const filteredTasks = getFilteredTasks(upcomingTasks);
  const [activeDragTask, setActiveDragTask] = useState(null);

  // Group tasks by date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = task.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  // Ensure we sort dates
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));

  const formatDateHeader = (dateString, dateObj = null) => {
    const date = dateObj || new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleAddTask = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    openModal(null, { date: dateStr });
  };

  const handleDragStart = (event) => {
    setActiveDragTask(event.active.data.current.task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
        setActiveDragTask(null);
        return;
    }

    const activeTask = active.data.current.task;
    let targetDate = null;

    // Check if over ID is a Date string (container)
    // We assume any string looking like YYYY-MM-DD is a date container
    // Or we check if it's in sortedDates.
    // However, over.id might be another task ID.
    
    if (Date.parse(over.id) && over.id.includes('-')) {
        targetDate = over.id;
    } else {
        // Find task with over.id
        const overTask = upcomingTasks.find(t => t.id === over.id);
        if (overTask) {
            targetDate = overTask.date;
        }
    }

    if (targetDate && targetDate !== activeTask.date) {
        updateTaskDate(activeTask.id, targetDate);
    }
    
    setActiveDragTask(null);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
    >
        <div className="space-y-8 pb-10">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex items-end justify-between">
            <div>
                <p className="text-amber-100 text-[10px] md:text-sm font-bold tracking-widest uppercase">Planning Ahead</p>
                <h2 className="text-2xl md:text-4xl font-black mt-1 tracking-tight">Upcoming Tasks</h2>
            </div>
            <button 
                onClick={handleAddTask}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white text-amber-600 font-bold rounded-xl shadow-xl hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all duration-200 text-xs md:text-base"
            >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add to Upcoming
            </button>
            </div>
        </div>

        {sortedDates.length > 0 ? (
            <div className="grid gap-6">
            {sortedDates.map((date) => (
                <FunctionalityDateGroupWrapper 
                    key={date} 
                    date={date} 
                    formattedDate={formatDateHeader(date)}
                    tasks={groupedTasks[date] || []}
                />
            ))}
            </div>
        ) : (
            <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-20 text-center border-dashed">
             <h3 className="text-2xl font-bold text-slate-200">No upcoming tasks</h3>
             <button onClick={handleAddTask} className="mt-4 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl">Plan a Task</button>
            </div>
        )}
        
        <DragOverlay>
           {activeDragTask ? <TaskItem task={activeDragTask} /> : null}
        </DragOverlay>
        </div>
    </DndContext>
  );
}
