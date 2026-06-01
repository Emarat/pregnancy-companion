import { HeartPulse, Languages, Moon, Sun } from 'lucide-react';

export default function Header({ lang, setLang, darkMode, setDarkMode, dict }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-rose-500" size={28} />
          <h1 className="font-bold text-lg text-emerald-900 dark:text-emerald-300 leading-tight">{dict.appTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title={dict.darkMode}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
          >
            <Languages size={16} />
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
}
