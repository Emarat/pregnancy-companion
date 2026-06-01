import { useState, useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const SCHEDULE_KEY = 'preg_notif_schedule';
const DEFAULT_TIME = '09:00';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useNotifications() {
  const [prefs, setPrefs] = useState(() => {
    const saved = loadPrefs();
    return saved || { enabled: true, time: DEFAULT_TIME, suppReminders: true, vaccineReminders: true };
  });
  const [capAvailable, setCapAvailable] = useState(false);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    const init = async () => {
      try {
        try {
          await LocalNotifications.deleteChannel({ id: 'preg_reminders' });
        } catch {}
        await LocalNotifications.createChannel({
          id: 'preg_reminders',
          name: 'Supplement Reminders',
          description: 'Daily supplement and medication reminders',
          importance: 5,
          visibility: 0,
          lightColor: '#10B981',
          vibration: true,
        });
        const perm = await LocalNotifications.checkPermissions();
        setCapAvailable(true);
        if (perm.display === 'prompt' && prefs.enabled) {
          await LocalNotifications.requestPermissions();
        }
      } catch {
        setCapAvailable(false);
      }
    };
    init();
  }, [prefs.enabled]);

  const scheduleSupplements = useCallback(async (supplements, customSupplements) => {
    if (!capAvailable || !prefs.enabled || !prefs.suppReminders) return;

    const [h, m] = (prefs.time || DEFAULT_TIME).split(':').map(Number);
    const nextFire = new Date();
    nextFire.setHours(h, m, 0, 0);
    if (nextFire <= new Date()) {
      nextFire.setDate(nextFire.getDate() + 1);
    }

    const notifications = [];

    for (const [key, taken] of Object.entries(supplements)) {
      if (key === 'date') continue;
      if (!taken) {
        const names = { folicAcid: 'Folic Acid', iron: 'Iron', calcium: 'Calcium' };
        notifications.push({
          title: 'Supplement Reminder',
          body: `Don't forget to take your ${names[key] || key} today!`,
          id: key === 'folicAcid' ? 101 : key === 'iron' ? 102 : 103,
          schedule: { at: nextFire.toISOString(), repeats: true, allowWhileIdle: true },
          smallIcon: 'ic_stat_notification',
          iconColor: '#10B981',
          channelId: 'preg_reminders',
        });
      }
    }

    customSupplements.forEach((s, i) => {
      if (!s.takenToday) {
        notifications.push({
          title: 'Medicine Reminder',
          body: `Time to take ${s.name}${s.dosage ? ` (${s.dosage})` : ''}`,
          id: 200 + i,
          schedule: { at: nextFire.toISOString(), repeats: true, allowWhileIdle: true },
          smallIcon: 'ic_stat_notification',
          iconColor: '#10B981',
          channelId: 'preg_reminders',
        });
      }
    });

    try {
      await LocalNotifications.cancel({ notifications: notifications.map(n => ({ id: n.id })) });
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch {
      // silently fail — Capacitor plugin not available in browser
    }
  }, [capAvailable, prefs]);

  const cancelAll = useCallback(async () => {
    if (!capAvailable) return;
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id })),
        });
      }
    } catch {
      // silently fail
    }
  }, [capAvailable]);

  return { prefs, setPrefs, scheduleSupplements, cancelAll, capAvailable };
}
