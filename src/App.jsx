import { useState, useEffect, useMemo } from 'react';
import { Baby } from 'lucide-react';
import { t } from './i18n/translations';
import { getLocalYYYYMMDD, calculatePregnancyData } from './utils/date';
import Header from './components/Header';
import TabBar from './components/TabBar';
import ProgressOverview from './components/ProgressOverview';
import SupplementTracker from './components/SupplementTracker';
import TimelineSection from './components/TimelineSection';
import AICompanion from './components/AICompanion';
import SymptomLogger from './components/SymptomLogger';
import FoodSuggestions from './components/FoodSuggestions';
import ProviderFinder from './components/ProviderFinder';
import CareTabs from './components/CareTabs';
import Onboarding from './components/Onboarding';
import EmergencyFab from './components/EmergencyFab';
import NotificationSettings from './components/NotificationSettings';
import { useNotifications } from './hooks/useNotifications';
import Footer from './components/Footer';

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return localStorage.getItem('preg_onboarding') === 'true';
  });
  const [lang, setLang] = useState('en');
  const [lmp, setLmp] = useState('');
  const [supplements, setSupplements] = useState({ date: getLocalYYYYMMDD(), folicAcid: false, iron: false, calcium: false });
  const [vaccinations, setVaccinations] = useState({ tt1: false, tt2: false });
  const [customSupplements, setCustomSupplements] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('preg_dark') === 'true');
  const [activeTab, setActiveTab] = useState('home');
  const [careMode, setCareMode] = useState('ask');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('preg_dark', darkMode ? 'true' : '');
  }, [darkMode]);

  useEffect(() => {
    const savedLang = localStorage.getItem('preg_lang');
    if (savedLang) setLang(savedLang);

    const savedLmp = localStorage.getItem('preg_lmp');
    if (savedLmp) setLmp(savedLmp);

    const savedVaccines = localStorage.getItem('preg_vaccines');
    if (savedVaccines) setVaccinations(JSON.parse(savedVaccines));

    const savedSupplements = localStorage.getItem('preg_supplements');
    if (savedSupplements) {
      const parsed = JSON.parse(savedSupplements);
      if (parsed.date !== getLocalYYYYMMDD()) {
        const freshSupplements = { date: getLocalYYYYMMDD(), folicAcid: false, iron: false, calcium: false };
        setSupplements(freshSupplements);
        localStorage.setItem('preg_supplements', JSON.stringify(freshSupplements));
      } else {
        setSupplements(parsed);
      }
    }

    const savedCustom = localStorage.getItem('preg_custom_supplements');
    if (savedCustom) {
      setCustomSupplements(JSON.parse(savedCustom));
    }
  }, []);

  useEffect(() => { localStorage.setItem('preg_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('preg_lmp', lmp); }, [lmp]);
  useEffect(() => { localStorage.setItem('preg_vaccines', JSON.stringify(vaccinations)); }, [vaccinations]);
  useEffect(() => { localStorage.setItem('preg_supplements', JSON.stringify(supplements)); }, [supplements]);
  useEffect(() => { localStorage.setItem('preg_custom_supplements', JSON.stringify(customSupplements)); }, [customSupplements]);

  const todayStr = getLocalYYYYMMDD();

  useEffect(() => {
    setCustomSupplements(prev => prev.map(s => ({
      ...s,
      takenToday: s.takenDate === todayStr ? s.takenToday : false
    })));
  }, [todayStr]);

  const addCustomSupplement = (item) => {
    setCustomSupplements(prev => [...prev, { ...item, id: Date.now().toString(), takenToday: false, takenDate: '' }]);
  };

  const removeCustomSupplement = (id) => {
    setCustomSupplements(prev => prev.filter(s => s.id !== id));
  };

  const toggleCustomSupplement = (id) => {
    setCustomSupplements(prev => prev.map(s =>
      s.id === id ? { ...s, takenToday: !s.takenToday, takenDate: !s.takenToday ? todayStr : '' } : s
    ));
  };

  const { prefs: notifPrefs, setPrefs: setNotifPrefs, scheduleSupplements, cancelAll, capAvailable, permStatus, requestPermission, openSettings } = useNotifications();

  useEffect(() => {
    if (capAvailable && notifPrefs.enabled) {
      scheduleSupplements(supplements, customSupplements);
    }
  }, [supplements, customSupplements, notifPrefs.enabled, notifPrefs.time, notifPrefs.suppReminders, capAvailable]);

  const pregData = useMemo(() => calculatePregnancyData(lmp, lang), [lmp, lang]);

  const toggleSupplement = (key) => {
    setSupplements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleVaccine = (key) => {
    setVaccinations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    if (window.confirm(lang === 'en' ? "Are you sure you want to delete all data?" : "আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা মুছতে চান?")) {
      setOnboardingComplete(false);
      setLmp('');
      setSupplements({ date: getLocalYYYYMMDD(), folicAcid: false, iron: false, calcium: false });
      setCustomSupplements([]);
      setVaccinations({ tt1: false, tt2: false });
      localStorage.removeItem('preg_onboarding');
      localStorage.removeItem('preg_lmp');
      localStorage.removeItem('preg_supplements');
      localStorage.removeItem('preg_custom_supplements');
      localStorage.removeItem('preg_vaccines');
    }
  };

  const handleNavigate = (tab, mode) => {
    if (mode) setCareMode(mode);
    setActiveTab(tab);
  };

  const handleTabChange = (tab) => {
    if (tab !== 'care') setCareMode('ask');
    setActiveTab(tab);
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    localStorage.setItem('preg_onboarding', 'true');
  };

  const dict = t[lang];

  if (!onboardingComplete) {
    return (
      <Onboarding
        lang={lang}
        setLang={setLang}
        lmp={lmp}
        setLmp={setLmp}
        notifPrefs={notifPrefs}
        setNotifPrefs={setNotifPrefs}
        onComplete={handleOnboardingComplete}
        dict={dict}
      />
    );
  }

  const tabContent = {
    home: (
      <div className="space-y-6">
        <ProgressOverview
          lmp={lmp}
          setLmp={setLmp}
          pregData={pregData}
          dict={dict}
          onNavigate={handleNavigate}
        />
        {pregData && (
          <>
            <SupplementTracker
              supplements={supplements}
              onToggle={toggleSupplement}
              customSupplements={customSupplements}
              onToggleCustom={toggleCustomSupplement}
              onAddCustom={addCustomSupplement}
              onRemoveCustom={removeCustomSupplement}
              dict={dict}
            />
          </>
        )}
      </div>
    ),
    guide: (
      <div className="space-y-6">
        {pregData ? (
          <>
            <TimelineSection
              pregData={pregData}
              vaccinations={vaccinations}
              onToggleVaccine={toggleVaccine}
              dict={dict}
              lang={lang}
            />
            <FoodSuggestions dict={dict} lang={lang} />
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Baby size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">{dict.selectDate}</p>
          </div>
        )}
      </div>
    ),
    care: (
      <div className="space-y-6">
        {pregData ? (
          <CareTabs dict={dict} lang={lang} initialMode={careMode} />
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Baby size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">{dict.selectDate}</p>
          </div>
        )}
      </div>
    ),
    more: (
      <div className="space-y-6">
        {pregData && <ProviderFinder dict={dict} lang={lang} />}
        {!pregData && (
          <div className="text-center py-16 text-gray-400">
            <Baby size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">{dict.selectDate}</p>
          </div>
        )}
        <NotificationSettings
          prefs={notifPrefs}
          setPrefs={setNotifPrefs}
          capAvailable={capAvailable}
          permStatus={permStatus}
          requestPermission={requestPermission}
          openSettings={openSettings}
          dict={dict}
        />
        <Footer onReset={handleReset} dict={dict} />
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans selection:bg-emerald-100 pb-20">
      <Header lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} dict={dict} />

      <main className="max-w-md mx-auto px-4 mt-6">
        {tabContent[activeTab]}
      </main>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} dict={dict} />
      <EmergencyFab dict={dict} />
    </div>
  );
}
