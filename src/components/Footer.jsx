import { Trash2, AlertCircle } from 'lucide-react';

export default function Footer({ onReset, dict }) {
  return (
    <footer className="max-w-md mx-auto px-4 mt-10 space-y-6">
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-semibold transition active:scale-[0.98]"
      >
        <Trash2 size={18} />
        {dict.resetBtn}
      </button>

      <div className="bg-gray-100/80 dark:bg-gray-700/80 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600 flex items-start gap-3">
        <AlertCircle className="text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left">
          {dict.disclaimer}
        </p>
      </div>
    </footer>
  );
}
