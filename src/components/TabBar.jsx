import { Home, BookHeart, HeartPulse, Settings } from 'lucide-react';

const TABS = [
  { key: 'home', icon: Home, labelKey: 'tabHome' },
  { key: 'guide', icon: BookHeart, labelKey: 'tabGuide' },
  { key: 'care', icon: HeartPulse, labelKey: 'tabCare' },
  { key: 'more', icon: Settings, labelKey: 'tabMore' },
];

export default function TabBar({ activeTab, onTabChange, dict }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div className="max-w-md mx-auto flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 transition active:scale-95 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={22} className={isActive ? 'fill-emerald-100 dark:fill-emerald-900/40' : ''} />
              <span className="text-[10px] font-medium mt-0.5">{dict[tab.labelKey]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
