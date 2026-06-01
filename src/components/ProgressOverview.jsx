import { Calendar, Baby, HeartPulse, MessageCircle, BookHeart } from 'lucide-react';

export default function ProgressOverview({ lmp, setLmp, pregData, dict, onNavigate }) {
  const weekGuide = pregData?.weeks ? pregData.weeks <= 40 ? pregData.weeks : 'postpartum' : null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50">
      <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
        <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
        {dict.lmpLabel}
      </label>
      <input
        type="date"
        value={lmp}
        onChange={(e) => setLmp(e.target.value)}
        className="w-full bg-emerald-50/50 dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
      />

      {!pregData && (
        <div className="mt-4 text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
          <Baby size={48} className="mx-auto mb-3 opacity-20" />
          <p>{dict.selectDate}</p>
        </div>
      )}

      {pregData && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">
              {pregData.weeks <= 12 ? '🌱' : pregData.weeks <= 27 ? '🍊' : '👶'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {dict.weekNavLabel} {pregData.weeks}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  {dict.trimesters[pregData.trimesterIndex]}
                </span>
                <span>{pregData.days} {dict.days}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${pregData.progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">{dict.eddLabel}</p>
              <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm mt-0.5">{pregData.eddFormatted}</p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/30 rounded-xl p-3">
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium uppercase tracking-wide">{dict.progressLabel}</p>
              <p className="font-bold text-rose-900 dark:text-rose-200 text-sm mt-0.5">{Math.round(pregData.progressPercent)}%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('care', 'symptom')}
              className="flex-1 flex items-center justify-center gap-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 py-2.5 rounded-xl text-xs font-medium hover:bg-rose-100 dark:hover:bg-rose-900/50 transition active:scale-[0.98]"
            >
              <HeartPulse size={14} />
              {dict.homeQuickSymptom}
            </button>
            <button
              onClick={() => onNavigate('care', 'ask')}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 py-2.5 rounded-xl text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition active:scale-[0.98]"
            >
              <MessageCircle size={14} />
              {dict.homeQuickAsk}
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 py-2.5 rounded-xl text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition active:scale-[0.98]"
            >
              <BookHeart size={14} />
              {dict.homeQuickGuide}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
