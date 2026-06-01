import { useState } from 'react';
import { HeartPulse, Baby, Bell, ShieldCheck, Sparkles, ChevronRight, ChevronLeft, Languages, Calendar, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const STEPS = ['welcome', 'language', 'lmp', 'notifications', 'disclaimer', 'complete'];

function StepWelcome({ onNext, dict }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-8">
      <div className="bg-emerald-100 dark:bg-emerald-900/40 p-4 rounded-full mb-6">
        <HeartPulse size={48} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{dict.onboardingWelcome}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{dict.onboardingWelcomeDesc}</p>
      <button
        onClick={onNext}
        className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-600 transition active:scale-[0.98] flex items-center gap-2"
      >
        {dict.onboardingStart} <ChevronRight size={18} />
      </button>
    </div>
  );
}

function StepLanguage({ lang, setLang, onNext, onBack, dict }) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Languages size={20} className="text-emerald-500" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{dict.onboardingLanguage}</h2>
      </div>
      <div className="space-y-3">
        {[
          { value: 'en', label: 'English', sub: 'Continue in English' },
          { value: 'bn', label: 'বাংলা', sub: 'বাংলায় চালিয়ে যান' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => { setLang(opt.value); }}
            className={cn(
              'w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between',
              lang === opt.value
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300'
            )}
          >
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{opt.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{opt.sub}</p>
            </div>
            {lang === opt.value && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">{dict.onboardingBack}</button>
        <button onClick={onNext} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition">{dict.onboardingNext}</button>
      </div>
    </div>
  );
}

function StepLmp({ lmp, setLmp, lmpError, onNext, onBack, onSkip, dict }) {
  const today = new Date().toISOString().split('T')[0];
  const maxLmp = new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={20} className="text-rose-500" />
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{dict.onboardingLmp}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{dict.onboardingLmpDesc}</p>
        </div>
      </div>
      <input
        type="date"
        value={lmp}
        onChange={(e) => setLmp(e.target.value)}
        max={today}
        min={maxLmp}
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition mb-2"
      />
      {lmpError && <p className="text-xs text-rose-500 mt-1">{lmpError}</p>}
      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">{dict.onboardingBack}</button>
        <button onClick={onNext} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition">{dict.onboardingNext}</button>
      </div>
      <button onClick={onSkip} className="w-full text-center text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mt-4 transition">{dict.onboardingSkip}</button>
    </div>
  );
}

function StepNotifications({ notifEnabled, setNotifEnabled, onNext, onBack, dict }) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell size={20} className="text-blue-500" />
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{dict.onboardingNotif}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{dict.onboardingNotifDesc}</p>
        </div>
      </div>
      <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{dict.notifEnable}</span>
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notifEnabled}
            onChange={(e) => setNotifEnabled(e.target.checked)}
          />
          <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
        </div>
      </label>
      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">{dict.onboardingBack}</button>
        <button onClick={onNext} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition">{dict.onboardingNext}</button>
      </div>
    </div>
  );
}

function StepDisclaimer({ accepted, setAccepted, onNext, onBack, dict }) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={20} className="text-amber-500" />
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{dict.onboardingDisclaimer}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{dict.onboardingDisclaimerDesc}</p>
        </div>
      </div>
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{dict.onboardingDisclaimerDesc}</p>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-400"
        />
        <span className="text-sm text-gray-700 dark:text-gray-200">{dict.onboardingAccept}</span>
      </label>
      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">{dict.onboardingBack}</button>
        <button
          onClick={onNext}
          disabled={!accepted}
          className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50"
        >
          {dict.onboardingNext}
        </button>
      </div>
    </div>
  );
}

function StepComplete({ onComplete, dict }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-8">
      <div className="bg-emerald-100 dark:bg-emerald-900/40 p-4 rounded-full mb-6">
        <Sparkles size={48} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{dict.onboardingComplete}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{dict.onboardingCompleteDesc}</p>
      <button
        onClick={onComplete}
        className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-600 transition active:scale-[0.98] flex items-center gap-2"
      >
        <Baby size={20} /> {dict.onboardingStart}
      </button>
    </div>
  );
}

export default function Onboarding({ lang, setLang, lmp, setLmp, notifPrefs, setNotifPrefs, onComplete, dict }) {
  const [step, setStep] = useState('welcome');
  const [accepted, setAccepted] = useState(false);
  const [lmpError, setLmpError] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(notifPrefs.enabled);

  const stepIndex = STEPS.indexOf(step);
  const totalSteps = STEPS.length;

  const goNext = () => {
    if (step === 'lmp') {
      if (lmp && !lmpError) {
        setStep('notifications');
      } else if (!lmp) {
        setStep('notifications');
      } else {
        return;
      }
    } else if (step === 'language') {
      setStep('lmp');
    } else {
      const idx = STEPS.indexOf(step);
      if (idx < totalSteps - 1) setStep(STEPS[idx + 1]);
    }
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleComplete = () => {
    setNotifPrefs(prev => ({ ...prev, enabled: notifEnabled }));
    onComplete();
  };

  const validateLmp = (value) => {
    if (!value) { setLmpError(''); return; }
    const date = new Date(value);
    const today = new Date();
    if (date > today) { setLmpError('LMP date cannot be in the future'); return; }
    const maxPast = new Date();
    maxPast.setDate(maxPast.getDate() - 294);
    if (date < maxPast) { setLmpError('LMP date seems too far in the past'); return; }
    setLmpError('');
  };

  const handleLmpChange = (value) => {
    setLmp(value);
    validateLmp(value);
  };

  const stepLabels = [
    dict.onboardingWelcome,
    dict.onboardingLanguage,
    dict.lmpLabel,
    dict.notifTitle,
    dict.onboardingDisclaimer,
    dict.onboardingComplete,
  ];

  const showProgress = step !== 'welcome' && step !== 'complete';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 dark:from-emerald-950 to-white dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-emerald-100 dark:border-emerald-900 overflow-hidden">
          {showProgress && (
            <div className="px-6 pt-5 pb-2">
              <div className="flex gap-1 mb-2">
                {STEPS.slice(1, -1).map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1 flex-1 rounded-full transition',
                      STEPS.indexOf(step) > i + 1 ? 'bg-emerald-400' :
                      STEPS.indexOf(step) === i + 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                {stepLabels[STEPS.indexOf(step)] || ''}
              </p>
            </div>
          )}

          <div className="px-6 pb-6">
            {step === 'welcome' && <StepWelcome onNext={() => setStep('language')} dict={dict} />}
            {step === 'language' && (
              <StepLanguage
                lang={lang} setLang={setLang}
                onNext={goNext} onBack={goBack} dict={dict}
              />
            )}
            {step === 'lmp' && (
              <StepLmp
                lmp={lmp} setLmp={handleLmpChange} lmpError={lmpError}
                onNext={goNext} onBack={goBack}
                onSkip={() => setStep('notifications')} dict={dict}
              />
            )}
            {step === 'notifications' && (
              <StepNotifications
                notifEnabled={notifEnabled} setNotifEnabled={setNotifEnabled}
                onNext={goNext} onBack={goBack} dict={dict}
              />
            )}
            {step === 'disclaimer' && (
              <StepDisclaimer
                accepted={accepted} setAccepted={setAccepted}
                onNext={goNext} onBack={goBack} dict={dict}
              />
            )}
            {step === 'complete' && (
              <StepComplete onComplete={handleComplete} dict={dict} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
