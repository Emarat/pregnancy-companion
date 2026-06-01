import { useState } from 'react';
import { Pill, CheckCircle2, Plus, X, Trash2, Clock } from 'lucide-react';

const SUPPLEMENTS = [
  { key: 'folicAcid', labelKey: 'folicAcid', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { key: 'iron', labelKey: 'iron', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { key: 'calcium', labelKey: 'calcium', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
];

const TIMINGS = ['customSupplMorning', 'customSupplAfternoon', 'customSupplEvening'];

function AddCustomForm({ onAdd, onCancel, dict }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timing, setTiming] = useState('customSupplMorning');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), dosage: dosage.trim(), timing, startDate, endDate: endDate || '' });
    setName('');
    setDosage('');
    setTiming('customSupplMorning');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{dict.customSupplAdd}</span>
        <button type="button" onClick={onCancel} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          <X size={18} />
        </button>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={dict.customSupplName}
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        required
      />
      <div className="flex gap-2">
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder={dict.customSupplDosage}
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={timing}
          onChange={(e) => setTiming(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {TIMINGS.map(t => (
            <option key={t} value={t}>{dict[t]}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">{dict.customSupplStart}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">{dict.customSupplEnd}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50"
      >
        {dict.customSupplSave}
      </button>
    </form>
  );
}

export default function SupplementTracker({ supplements, onToggle, customSupplements, onToggleCustom, onAddCustom, onRemoveCustom, dict }) {
  const [showForm, setShowForm] = useState(false);

  const isCustomActive = (s) => {
    if (!s.startDate) return true;
    const today = new Date();
    const start = new Date(s.startDate + 'T00:00:00');
    const end = s.endDate ? new Date(s.endDate + 'T00:00:00') : null;
    return today >= start && (!end || today <= end);
  };

  const activeCustomSupps = customSupplements.filter(isCustomActive);

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
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-md">
          {dict.today || 'Today'}
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

      {activeCustomSupps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{dict.customSupplAdd}</p>
          {activeCustomSupps.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Clock size={14} className="text-gray-300 shrink-0" />
                <div className="min-w-0">
                  <span className={`font-medium text-sm block truncate ${item.takenToday ? 'text-emerald-600 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {item.dosage && `${item.dosage} · `}{dict[item.timing] || item.timing}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRemoveCustom(item.id)}
                  className="p-1.5 text-gray-300 hover:text-rose-500 transition"
                  title={dict.customSupplDelete}
                >
                  <Trash2 size={14} />
                </button>
                <label className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${item.takenToday ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-gray-500'}`}>
                  {item.takenToday && <CheckCircle2 size={14} className="text-white" />}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={item.takenToday}
                    onChange={() => onToggleCustom(item.id)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="mt-4">
          <AddCustomForm
            onAdd={(item) => { onAddCustom(item); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
            dict={dict}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-emerald-300 hover:text-emerald-600 transition font-medium"
        >
          <Plus size={16} />
          {dict.addCustomSuppl}
        </button>
      )}
    </section>
  );
}
