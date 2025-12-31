import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';

export default function SortableTaskItem({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: { task } });

  /* import { CSS } from '@dnd-kit/utilities'; (Already imported) */
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0 : 1, // Hide original completely while dragging to prevent ghosting
    height: isDragging ? 0 : 'auto', // Collapse height to avoid holes? No, usually we want holes.
    // Let's keep opacity 0 but keep space.
    visibility: isDragging ? 'hidden' : 'visible', // Better than opacity for screen readers sometimes, but mostly visual.
    touchAction: 'none' // Important for touch devices
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full max-w-full touch-none">
      <TaskItem task={task} />
    </div>
  );
}
