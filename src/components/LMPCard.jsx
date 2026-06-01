import { Calendar, Baby } from 'lucide-react';

export default function LMPCard({ lmp, setLmp, pregData, dict }) {
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
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">{dict.eddLabel}</p>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">{pregData.eddFormatted}</p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/30 rounded-xl p-3">
              <p className="text-xs text-rose-600 font-medium mb-1">{dict.trimester}</p>
              <p className="font-bold text-rose-900 dark:text-rose-200">{dict.trimesters[pregData.trimesterIndex]}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{dict.progressLabel}</p>
              <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                {pregData.weeks} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{dict.weeks}</span>
                {' '}{pregData.days} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{dict.days}</span>
              </p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pregData.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
