import { useState } from 'react';
import { Apple, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { FOODS, MEAL_TABS } from '../utils/foodData';

const NUTRIENT_COLORS = {
  protein: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  fiber: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  iron: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  calcium: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  vitamins: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  omega3: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  probiotics: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  potassium: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  zinc: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  b12: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'healthy fats': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  hydration: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  energy: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  carbs: 'bg-stone-100 text-stone-700 dark:bg-stone-900/40 dark:text-stone-300',
  antioxidants: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  vitaminD: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

function CategoryCard({ cat, dict, lang }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {lang === 'bn' ? cat.categoryBn : cat.category}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {cat.nutrients.map(n => (
              <span key={n} className={`text-[10px] px-1.5 py-0.5 rounded-full ${NUTRIENT_COLORS[n] || 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}`}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{cat.benefit}</p>

      <div className="space-y-1">
        {cat.examples.map((ex, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>{lang === 'bn' ? ex.bnName : ex.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FoodSuggestions({ dict, lang }) {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [showAvoid, setShowAvoid] = useState(false);

  const categories = FOODS[activeTab] || [];
  const tab = MEAL_TABS.find(t => t.key === activeTab);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50 dark:border-emerald-900 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
          <Apple size={20} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100">{dict.foodTitle}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{dict.foodSubtitle}</p>
        </div>
      </div>

      <div className="flex gap-1 mt-4 mb-4 overflow-x-auto pb-1">
        {MEAL_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              activeTab === t.key
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{t.icon}</span>
            <span>{lang === 'bn' ? t.labelBn : t.labelEn}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} cat={cat} dict={dict} lang={lang} />
        ))}
      </div>

      <button
        onClick={() => setShowAvoid(!showAvoid)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-amber-200 dark:border-amber-700 text-sm text-amber-600 dark:text-amber-400 hover:border-amber-300 dark:hover:border-amber-600 transition font-medium"
      >
        <AlertTriangle size={16} />
        {showAvoid ? dict.foodHide : dict.foodAvoid}
      </button>

      {showAvoid && (
        <div className="mt-3 space-y-2">
          {FOODS.avoid.map((item, idx) => (
            <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {lang === 'bn' ? item.bnName : item.name}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5">{item.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-4">
        {dict.foodTip}: {dict.foodWashTip}
      </p>
    </section>
  );
}
