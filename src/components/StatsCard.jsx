export default function StatsCard({ icon: Icon, label, value, color = 'primary', className = '', onClick, isActive }) {
  const styles = {
    primary: {
      wrapper: 'from-indigo-600 to-violet-600',
      shadow: 'shadow-indigo-500/25',
      text: 'text-indigo-100',
    },
    emerald: {
      wrapper: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25',
      text: 'text-emerald-100',
    },
    amber: {
      wrapper: 'from-amber-400 to-orange-500',
      shadow: 'shadow-amber-500/25',
      text: 'text-amber-100',
    },
    rose: {
      wrapper: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/25',
      text: 'text-rose-100',
    }
  };

  const style = styles[color];

  return (
    <div 
      onClick={onClick}
      className={`
      relative overflow-hidden
      bg-gradient-to-br ${style.wrapper}
      rounded-[20px] sm:rounded-3xl p-4 sm:p-6
      transition-all duration-300 ease-out
      group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl ${style.shadow}
      min-h-[80px] sm:min-h-[160px] flex flex-col justify-between
      w-full ${className}
      ${onClick ? 'cursor-pointer' : ''}
      ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-[1.02]' : ''}
    `}>
       {/* Decorative Background Elements */}
       <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 pointer-events-none" />
       
       {/* Massive Background Icon */}
       <Icon className="absolute -right-3 -bottom-3 w-20 h-20 sm:w-32 sm:h-32 text-white/10 rotate-12 group-hover:rotate-6 transition-transform duration-500 pointer-events-none" />

       {/* Label & Icon Header */}
       <div className="relative z-10 flex items-center justify-between">
         <span className={`text-[10px] sm:text-sm font-black tracking-widest uppercase ${style.text} opacity-80 backdrop-blur-md bg-black/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
            {label}
         </span>
         <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl text-white">
            <Icon className="w-3 px-0.5 h-3 sm:w-5 sm:h-5" />
         </div>
       </div>

       {/* Value */}
       <div className="relative z-10 mt-auto">
         <p className="text-3xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-md">
            {value}
         </p>
       </div>
    </div>
  );
}
