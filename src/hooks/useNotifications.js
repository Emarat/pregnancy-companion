import { useState, useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

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
  const [permStatus, setPermStatus] = useState(null);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        await LocalNotifications.createChannel({
          id: 'preg_reminders',
          name: 'Pregnancy Reminders',
          description: 'Daily supplement, medicine, and vaccine reminders',
          importance: 5,
          visibility: 0,
          lightColor: '#10B981',
          vibration: true,
        });
        const perm = await LocalNotifications.checkPermissions();
        if (!cancelled) {
          setCapAvailable(true);
          setPermStatus(perm.display);
        }
      } catch {
        if (!cancelled) setCapAvailable(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display === 'granted') {
        setPermStatus('granted');
        return true;
      }
      if (perm.display === 'denied') {
        await App.openSettings();
        return false;
      }
      const result = await LocalNotifications.requestPermissions();
      setPermStatus(result.display);
      if (result.display !== 'granted') {
        await App.openSettings();
        return false;
      }
      return true;
    } catch {
      try {
        await App.openSettings();
      } catch {}
      return false;
    }
  }, []);

  const openSettings = useCallback(async () => {
    try {
      await App.openSettings();
    } catch {}
  }, []);

  const scheduleSupplements = useCallback(async (supplements) => {
    if (!capAvailable || !prefs.enabled || !prefs.suppReminders) return;

    const [h, m] = (prefs.time || DEFAULT_TIME).split(':').map(Number);
    const schedule = { on: { hour: h, minute: m }, repeats: true, allowWhileIdle: true };

    const notifications = [];

    for (const [key, taken] of Object.entries(supplements)) {
      if (key === 'date') continue;
      if (!taken) {
        const names = { folicAcid: 'Folic Acid', iron: 'Iron', calcium: 'Calcium' };
        notifications.push({
          title: 'Supplement Reminder',
          body: `Don't forget to take your ${names[key] || key} today!`,
          id: key === 'folicAcid' ? 101 : key === 'iron' ? 102 : 103,
          schedule,
          smallIcon: 'ic_stat_notification',
          iconColor: '#10B981',
          channelId: 'preg_reminders',
        });
      }
    }

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

  return { prefs, setPrefs, scheduleSupplements, cancelAll, capAvailable, permStatus, requestPermission, openSettings };
}
