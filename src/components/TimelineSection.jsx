import { useState } from 'react';
import { Activity, ChevronRight, Syringe, ChevronLeft, ChevronDown, ChevronUp, Stethoscope, Lightbulb, HeartPulse } from 'lucide-react';
import { WEEKLY_GUIDE } from '../utils/weeklyGuide';

export default function TimelineSection({ pregData, vaccinations, onToggleVaccine, dict, lang }) {
  const [browseWeek, setBrowseWeek] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const currentWeek = Math.min(pregData.weeks, 40);
  const displayWeek = browseWeek !== null ? browseWeek : currentWeek;
  const isViewingCurrent = displayWeek === currentWeek;
  const isPostpartum = displayWeek === 41;
  const guide = WEEKLY_GUIDE[lang || 'en'] || WEEKLY_GUIDE.en;
  const weekData = isPostpartum ? guide.postpartum : guide[displayWeek];

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navigateWeek = (direction) => {
    const maxWeek = 41;
    const next = displayWeek + direction;
    if (next < 1) return;
    if (next > maxWeek) return;
    setBrowseWeek(next);
  };

  const goToCurrentWeek = () => {
    setBrowseWeek(null);
  };

  const sectionBtn = (key, icon, label, count) => {
    const isOpen = expandedSections[key];
    const Icon = icon;
    return (
      <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <span className="flex items-center gap-2">
            <Icon size={16} className="text-emerald-500" />
            {label}
            {count > 0 && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">{count}</span>
            )}
          </span>
          {isOpen ? <ChevronUp size={16} className="text-gray-400 dark:text-gray-500" /> : <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />}
        </button>
        {isOpen && (
          <div className="px-3 pb-3 space-y-2">
            {key === 'development' && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{weekData.development}</p>
            )}
            {key === 'symptoms' && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{weekData.symptoms}</p>
            )}
            {key === 'tips' && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{weekData.tips}</p>
            )}
            {key === 'discussion' && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{weekData.discussion}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTests = () => {
    if (!weekData.tests || weekData.tests.length === 0) {
      return <li className="text-sm text-gray-400 dark:text-gray-500 italic px-2">{dict.noTests}</li>;
    }
    return weekData.tests.map((test, idx) => {
      const label = test === 'scanNT' ? dict.scanNT : test === 'scanAnomaly' ? dict.scanAnomaly : test === 'testGTT' ? dict.testGTT : test;
      return (
        <li key={idx} className="flex items-start gap-2 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-200">
          <ChevronRight size={16} className="text-emerald-500 mt-0.5 shrink-0" /> {label}
        </li>
      );
    });
  };

  const renderVaccines = () => {
    const weekVaccines = weekData.vaccines || [];
    const showVaccines = displayWeek >= 20 || weekVaccines.length > 0;

    if (!showVaccines) return null;

    return (
      <div className="mt-3">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-1">
          <Syringe size={16} className="text-purple-500" />
          {dict.vaccinationLabel}
        </h3>
        <div className="space-y-2">
          {weekVaccines.includes('tt1') && (
            <label className={`flex items-center gap-3 p-3 rounded-lg border ${vaccinations.tt1 ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700'} transition cursor-pointer`}>
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 dark:text-purple-400 rounded focus:ring-purple-500"
                checked={vaccinations.tt1}
                onChange={() => onToggleVaccine('tt1')}
              />
              <span className={`text-sm ${vaccinations.tt1 ? 'text-purple-900 dark:text-purple-200 font-medium' : 'text-amber-800 dark:text-amber-200'}`}>{dict.tt1}</span>
              {!vaccinations.tt1 && <span className="text-[10px] text-amber-500 ml-auto font-medium">{dict.vaccineDue}</span>}
            </label>
          )}
          {weekVaccines.includes('tt2') && (
            <label className={`flex items-center gap-3 p-3 rounded-lg border ${vaccinations.tt2 ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' : vaccinations.tt1 ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-700 border-transparent'} transition cursor-pointer`}>
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 dark:text-purple-400 rounded focus:ring-purple-500"
                checked={vaccinations.tt2}
                onChange={() => onToggleVaccine('tt2')}
                disabled={!vaccinations.tt1}
              />
              <span className={`text-sm ${vaccinations.tt2 ? 'text-purple-900 dark:text-purple-200 font-medium' : vaccinations.tt1 ? 'text-amber-800 dark:text-amber-200' : 'text-gray-400 dark:text-gray-500'} ${!vaccinations.tt1 ? 'opacity-50' : ''}`}>{dict.tt2}</span>
              {!vaccinations.tt2 && vaccinations.tt1 && <span className="text-[10px] text-amber-500 ml-auto font-medium">{dict.vaccineDue}</span>}
            </label>
          )}
          {weekVaccines.length === 0 && displayWeek >= 20 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">{dict.noVaccinesDue}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Activity size={20} className="text-rose-500" />
          {isPostpartum ? dict.postpartum : `${dict.weekNavLabel} ${displayWeek}`}
        </h2>
        {!isViewingCurrent && (
          <button
            onClick={goToCurrentWeek}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            {dict.weekNavCurrent}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateWeek(-1)}
          disabled={displayWeek <= 1}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={dict.weekNavPrev}
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl border border-amber-100 flex-1 mx-2">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-lg shadow-sm shrink-0">
            {weekData?.emoji || '🌱'}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold uppercase tracking-wide">{dict.babySizeLabel}</p>
            <p className="font-bold text-amber-900 dark:text-amber-200 text-sm truncate">
              {dict.fruits[weekData?.fruitKey] || '—'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateWeek(1)}
          disabled={displayWeek >= 41}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={dict.weekNavNext}
        >
          <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {Array.from({ length: 40 }, (_, i) => i + 1).map(w => (
          <button
            key={w}
            onClick={() => setBrowseWeek(w)}
            className={`w-7 h-7 rounded-full text-[10px] font-medium shrink-0 transition ${
              w === displayWeek
                ? 'bg-emerald-500 text-white'
                : w === currentWeek && isViewingCurrent
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                : w === currentWeek
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {w}
          </button>
        ))}
        <button
          onClick={() => setBrowseWeek(41)}
          className={`w-7 h-7 rounded-full text-[10px] font-medium shrink-0 transition flex items-center justify-center ${
            41 === displayWeek
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          👶
        </button>
      </div>

      {weekData && (
        <div className="space-y-2 mb-4">
          {sectionBtn('development', HeartPulse, dict.developmentLabel)}
          {sectionBtn('symptoms', Activity, dict.symptomsLabel)}
          {sectionBtn('tips', Lightbulb, dict.tipsLabel)}
          {sectionBtn('discussion', Stethoscope, dict.discussionLabel)}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">{dict.recommendedTestsLabel}</h3>
        <ul className="space-y-2">
          {renderTests()}
        </ul>
      </div>

      {renderVaccines()}
    </section>
  );
}
