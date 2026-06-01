import { useState, useEffect } from 'react';
import { MessageCircle, HeartPulse } from 'lucide-react';
import AICompanion from './AICompanion';
import SymptomLogger from './SymptomLogger';

export default function CareTabs({ dict, lang, initialMode }) {
  const [mode, setMode] = useState(initialMode || 'ask');

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        <button
          onClick={() => setMode('ask')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
            mode === 'ask'
              ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <MessageCircle size={14} />
          {dict.careAsk}
        </button>
        <button
          onClick={() => setMode('symptom')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
            mode === 'symptom'
              ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <HeartPulse size={14} />
          {dict.careLog}
        </button>
      </div>

      {mode === 'ask' ? (
        <AICompanion dict={dict} lang={lang} />
      ) : (
        <SymptomLogger dict={dict} lang={lang} />
      )}
    </div>
  );
}
