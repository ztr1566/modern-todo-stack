import { useState, useEffect } from 'react';
import { X, Calendar, Tag, Type, Plus, Check } from 'lucide-react';
import { useTasks, getTodayDate } from '../context/TaskContext';

const colorPresets = [
  { name: 'Blue', color: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  { name: 'Emerald', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  { name: 'Purple', color: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  { name: 'Rose', color: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
  { name: 'Amber', color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
  { name: 'Cyan', color: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
];

export default function TaskModal({ isOpen, onClose, taskToEdit = null }) {
  const { addTask, updateTask, initialTaskValues, categories, addCategory } = useTasks();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [category, setCategory] = useState(categories[0]?.id || 'project');
  
  // New Category State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(colorPresets[0]);

  useEffect(() => {
    if (!isOpen) {
        setIsCreatingCategory(false);
        return;
    }

    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDate(taskToEdit.date);
      setCategory(taskToEdit.category);
    } else if (initialTaskValues) {
      setTitle(initialTaskValues.title || '');
      setDate(initialTaskValues.date || getTodayDate());
      setCategory(initialTaskValues.category || categories[0]?.id || 'project');
    } else {
      setTitle('');
      setDate(getTodayDate());
      setCategory(categories[0]?.id || 'project');
    }
  }, [taskToEdit, initialTaskValues, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, { title: title.trim(), date, category });
    } else {
      addTask({ title: title.trim(), date, category });
    }
    onClose();
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatColor);
    // Find the newly added category (simple approximation since addCategory is sync but state update async)
    // We'll trust React to update, and user can select it. Or we could select it automatically if we had the ID.
    // For now, reset new cat state.
    setNewCatName('');
    setIsCreatingCategory(false);
  };

  if (!isOpen) return null;
  const isEdit = !!taskToEdit;
  const selectedCategoryObj = categories.find(c => c.id === category) || categories[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/5 relative z-10">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-400" />
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Type className="w-3.5 h-3.5" /> Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
              />
            </div>

            {/* Current Category Display (Read-Onlyish) */}
            <div className="flex flex-col">
               <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" /> Category
              </label>
               <div className={`h-[46px] flex items-center px-4 bg-slate-900/30 border border-slate-700/50 rounded-xl ${selectedCategoryObj?.text || 'text-slate-400'} text-sm font-medium`}>
                  {selectedCategoryObj?.name || 'Select...'}
               </div>
            </div>
          </div>

          {/* Category Selection Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Category</label>
              <button 
                type="button" 
                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wide flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> {isCreatingCategory ? 'Cancel' : 'New'}
              </button>
            </div>
            
            {!isCreatingCategory ? (
                <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 border
                            ${category === cat.id
                            ? `${cat.bg} ${cat.border} ${cat.text} shadow-lg ring-1 ring-offset-1 ring-offset-slate-800 ${cat.text.replace('text-', 'ring-')}/50` 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            }
                        `}
                    >
                    {cat.name}
                    </button>
                ))}
                </div>
            ) : (
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 space-y-3">
                    <input 
                        type="text" 
                        value={newCatName} 
                        onChange={e => setNewCatName(e.target.value)} 
                        placeholder="Category Name"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {colorPresets.map(preset => (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => setNewCatColor(preset)}
                                className={`w-6 h-6 rounded-full ${preset.color} flex items-center justify-center transition-transform hover:scale-110 ${newCatColor.name === preset.name ? 'ring-2 ring-white' : ''}`}
                            >
                                {newCatColor.name === preset.name && <Check className="w-3 h-3 text-white" />}
                            </button>
                        ))}
                    </div>
                    <button 
                        type="button"
                        onClick={handleCreateCategory}
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                        Create Category
                    </button>
                </div>
            )}
          </div>

          <button
            type="submit"
            className="
              w-full py-4 mt-4
              bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
              text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25
              transition-all duration-200 active:scale-[0.98] transform
            "
          >
             {isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
