import { useState } from 'react';
import { FolderKanban, Plus, Briefcase, User, Dumbbell, Code } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import SortableTaskItem from '../components/SortableTaskItem';
import { DndContext, DragOverlay, defaultDropAnimationSideEffects, useSensor, useSensors, MouseSensor, TouchSensor, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskItem from '../components/TaskItem';

// Map icons to names
const getIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('work')) return Code;
  if (n.includes('personal')) return User;
  if (n.includes('health') || n.includes('gym')) return Dumbbell;
  return Briefcase;
};

// Sortable Container (Column)
function SortableColumn({ category, tasks, onAddTask }) {
  const Icon = getIcon(category.name);

  return (
    <div className="flex flex-col h-full bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-lg">
      {/* Column Header */}
      <div className={`p-5 border-b border-slate-700/50 ${category.bg || 'bg-slate-700/20'} backdrop-blur-sm relative z-10`}>
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${category.color || 'bg-slate-600'} text-white shadow-lg`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-slate-900/50 ${category.text || 'text-slate-400'}`}>
              {tasks.length}
            </span>
        </div>
        <h3 className="text-lg font-bold text-white capitalize tracking-tight">{category.name}</h3>
      </div>

      {/* Sortable Tasks List */}
      <div className="p-4 flex-1 space-y-3 min-h-[150px]">
        {/* We use SortableContext to enable reordering within this container */}
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
                <SortableTaskItem key={task.id} task={task} />
            ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 opacity-30">
            <p className="text-sm text-slate-400 font-medium dashed-border rounded-lg p-4 border border-slate-600 border-dashed">
              Drop tasks here
            </p>
          </div>
        )}
      </div>

      {/* Footer Add Button */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <button
          onClick={() => onAddTask(category.id)}
          className={`
            w-full py-2.5 rounded-xl flex items-center justify-center gap-2
            border border-dashed border-slate-600 hover:border-slate-500
            text-slate-400 hover:text-white hover:bg-slate-700/50
            transition-all duration-200 font-medium text-sm
          `}
        >
          <Plus className="w-4 h-4" />
          Add {category.name}
        </button>
      </div>
    </div>
  );
}

export default function Projects() {
  const { tasks, categories, openModal, updateTaskCategory } = useTasks();
  const [activeDragTask, setActiveDragTask] = useState(null);

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    const cat = task.category || 'project';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

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
    
    // Find which category the dropped task belongs to now
    // If over.id is a Task ID, we find that task's category.
    // If over.id is a Container ID (we aren't using droppable containers directly now, 
    // but the SortableContext works by items. If we drop on a container that has no items, 
    // we need to make the container itself droppable or handle it specifically).
    
    // HOWEVER, with SortableContext, usually the "over" is another item.
    // We need to map item IDs back to their categories to know where it landed.
    
    // Let's iterate categories to find where the 'over' ID resides
    let targetCategoryId = null;

    // Check if over.id is a category itself (if we made containers droppable?)
    // In this code, SortableColumn is NOT a droppable itself, which is a problem if empty.
    // We should probably make the column droppable too.
    
    // Simplification: We will trust the user drops on an item. If empty, we need a droppable area.
    // Let's actually wrap the column content in a Droppable as well to handle empty states? 
    // Or just check if over.id is in a known group.
    
    // Use collision detection to find the container?
    // dnd-kit `closestCorners` helps.
    
    // Let's try to deduce target category
    if (categories.some(c => c.id === over.id)) {
        targetCategoryId = over.id;
    } else {
        // Find task with over.id
        const overTask = tasks.find(t => t.id === over.id);
        if (overTask) {
            targetCategoryId = overTask.category;
        }
    }

    if (targetCategoryId && targetCategoryId !== activeTask.category) {
        updateTaskCategory(activeTask.id, targetCategoryId);
    }
    
    setActiveDragTask(null);
  };

  // We need to make the *containers* droppable so we can drop into empty columns.
  // Ideally we use a custom collision detection or ensure the container is a drop target.
  // For simplicity here, let's use the provided refs to make the whole column a droppable zone
  // but give it a unique ID from the items.
  // Actually, SortableContext doesn't make the container droppable.
  
  // Let's modify SortableColumn to use `useDroppable` as well for the container ID.
  // But wait, in the loop below we didn't import useDroppable.
  
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
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-8 text-white shadow-lg shadow-violet-500/20 relative overflow-hidden group">
           <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10">
            <p className="text-violet-200 text-[10px] md:text-sm font-bold tracking-widest uppercase">Organization</p>
            <h2 className="text-2xl md:text-4xl font-black mt-1 tracking-tight">Projects</h2>
          </div>
        </div>

        {/* Project Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
             <ProjectColumnWrapper 
                key={category.id} 
                category={category} 
                tasks={tasksByCategory[category.id] || []} 
                onAddTask={openModal} 
             />
          ))}
        </div>

        <DragOverlay>
           {activeDragTask ? <TaskItem task={activeDragTask} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

// Separate component to hook into useDroppable
import { useDroppable } from '@dnd-kit/core';

function ProjectColumnWrapper({ category, tasks, onAddTask }) {
    const { setNodeRef } = useDroppable({
        id: category.id, 
    });

    return (
        <div ref={setNodeRef} className="h-full">
            <SortableColumn category={category} tasks={tasks} onAddTask={(catId) => onAddTask(null, { category: catId })} />
        </div>
    );
}
