import { Pill, CheckCircle2 } from 'lucide-react';

const SUPPLEMENTS = [
  { key: 'folicAcid', labelKey: 'folicAcid', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { key: 'iron', labelKey: 'iron', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { key: 'calcium', labelKey: 'calcium', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
];

export default function SupplementTracker({ supplements, onToggle, dict }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Pill size={20} className="text-blue-500" />
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100">{dict.medicinesTitle}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">{dict.supplementsSub}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {SUPPLEMENTS.map((item) => (
          <label
            key={item.key}
            className={`flex items-center justify-between p-3 rounded-xl border ${supplements[item.key] ? item.bg + ' ' + item.border : 'border-gray-100 dark:border-gray-700'} transition cursor-pointer active:scale-[0.98]`}
          >
            <span className={`font-medium ${supplements[item.key] ? item.color : 'text-gray-600 dark:text-gray-300'}`}>{dict[item.labelKey]}</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${supplements[item.key] ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-gray-500'}`}>
              {supplements[item.key] && <CheckCircle2 size={16} className="text-white" />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={supplements[item.key]}
              onChange={() => onToggle(item.key)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
