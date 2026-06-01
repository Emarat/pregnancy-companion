import { Bell, BellOff, Clock, ExternalLink } from 'lucide-react';

export default function NotificationSettings({ prefs, setPrefs, capAvailable, permStatus, requestPermission, openSettings, dict }) {
  const update = (patch) => setPrefs(prev => ({ ...prev, ...patch }));

  const handleToggle = async (checked) => {
    update({ enabled: checked });
    if (checked && permStatus !== 'granted') {
      await requestPermission();
    }
  };

  if (!capAvailable) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={20} className="text-gray-300" />
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{dict.notifTitle}</h2>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
          <BellOff size={12} /> {dict.notifNotAvailable}
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50">
      {permStatus && permStatus !== 'granted' && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-2">
            {dict.notifPermissionNeeded}
          </p>
          <button
            onClick={openSettings}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <ExternalLink size={12} />
            {dict.notifOpenSettings}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-emerald-500" />
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{dict.notifTitle}</h2>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={prefs.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
        </label>
      </div>

      {prefs.enabled && (
        <div className="space-y-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{dict.notifTime}</span>
            </div>
            <input
              type="time"
              value={prefs.time || '09:00'}
              onChange={(e) => update({ time: e.target.value })}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-200">{dict.notifSupplements}</span>
            <input
              type="checkbox"
              className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              checked={prefs.suppReminders}
              onChange={(e) => update({ suppReminders: e.target.checked })}
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-200">{dict.notifVaccines}</span>
            <input
              type="checkbox"
              className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              checked={prefs.vaccineReminders}
              onChange={(e) => update({ vaccineReminders: e.target.checked })}
            />
          </label>

          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {dict.notifScheduled} {prefs.time || '09:00'}
          </p>
        </div>
      )}
    </section>
  );
}
