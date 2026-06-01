import { useState, useEffect } from 'react';
import { AlertTriangle, HeartPulse, Activity, Loader2, AlertCircle, Trash2, ChevronDown, ChevronUp, Key, ExternalLink } from 'lucide-react';

const LS_KEY = 'preg_gemini_key';
const LS_SYMPTOM_HISTORY = 'preg_symptom_history';
const MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash-preview', 'gemini-2.0-flash'];

const DURATIONS = [
  'symptomDurationOpt1',
  'symptomDurationOpt2',
  'symptomDurationOpt3',
  'symptomDurationOpt4',
  'symptomDurationOpt5',
];

const SEVERITY_LEVELS = [
  { value: 1, label: 'symptomMild', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200' },
  { value: 3, label: 'symptomModerate', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200' },
  { value: 5, label: 'symptomSevere', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-200' },
];

function SeveritySelector({ value, onChange, dict }) {
  return (
    <div className="flex gap-2">
      {SEVERITY_LEVELS.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
            value === level.value
              ? `${level.bg} ${level.border} ${level.color}`
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-gray-300'
          }`}
        >
          {dict[level.label]}
        </button>
      ))}
    </div>
  );
}

function ResultCard({ result, dict }) {
  if (!result) return null;

  const isUrgent = result.triage === 'urgent';
  const isRest = result.triage === 'rest';
  const isMonitor = result.triage === 'monitor';

  const colors = isUrgent
    ? { bg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-700', icon: 'text-rose-500 dark:text-rose-400', title: 'text-rose-700 dark:text-rose-300', text: 'text-rose-900 dark:text-rose-200' }
    : isRest
    ? { bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-700', icon: 'text-amber-500 dark:text-amber-400', title: 'text-amber-700 dark:text-amber-300', text: 'text-amber-900 dark:text-amber-200' }
    : { bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-700', icon: 'text-emerald-500 dark:text-emerald-400', title: 'text-emerald-700 dark:text-emerald-300', text: 'text-emerald-900 dark:text-emerald-200' };

  const Icon = isUrgent ? AlertTriangle : isRest ? HeartPulse : Activity;

  const actionLabel = isUrgent ? dict.symptomActionUrgent : isRest ? dict.symptomActionRest : dict.symptomActionMonitor;
  const actionDesc = isUrgent ? dict.symptomActionUrgentDesc : isRest ? dict.symptomActionRestDesc : dict.symptomActionMonitorDesc;

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 space-y-3`}>
      <div className="flex items-center gap-2">
        <Icon size={20} className={colors.icon} />
        <span className={`font-bold text-sm ${colors.title}`}>{dict.symptomResult}</span>
      </div>
      <div className={`${colors.text} text-sm font-bold`}>{actionLabel}</div>
      <p className="text-sm text-gray-700 dark:text-gray-200">{actionDesc}</p>
      {result.explanation && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{result.explanation}</p>
      )}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 pt-1">
        <AlertCircle size={10} /> {dict.symptomDisclaimer}
      </p>
    </div>
  );
}

export default function SymptomLogger({ dict, lang }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '');
  const [showKeyPrompt, setShowKeyPrompt] = useState(!apiKey);
  const [keyInputValue, setKeyInputValue] = useState(apiKey);
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(1);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_SYMPTOM_HISTORY) || '[]'); }
    catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_SYMPTOM_HISTORY, JSON.stringify(history));
  }, [history]);

  const saveApiKey = () => {
    const trimmed = keyInputValue.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    localStorage.setItem(LS_KEY, trimmed);
    setShowKeyPrompt(false);
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem(LS_KEY);
    setKeyInputValue('');
    setShowKeyPrompt(true);
  };

  const handleSubmit = async () => {
    if (!symptom.trim() || loading || !apiKey) {
      if (!apiKey) setShowKeyPrompt(true);
      return;
    }

    setLoading(true);
    setResult(null);

    const userDesc = `Symptom: ${symptom.trim()}\nSeverity (1-5): ${severity}\nDuration: ${dict[duration]}\nAdditional notes: ${notes || 'None'}`;

    try {
      const promptText = lang === 'en'
        ? `You are a pregnancy symptom triage assistant. CRITICAL: You are NOT a doctor. You MUST respond in JSON format only with NO markdown formatting, NO code blocks.

Analyze the following pregnancy symptom and return ONE of these triage levels:
- "monitor" — mild symptoms, safe to monitor at home
- "rest" — concerning symptoms, rest and consult provider
- "urgent" — red-flag symptoms, seek immediate care

Return JSON: {"triage": "monitor|rest|urgent", "explanation": "brief 1-2 sentence explanation in plain text"}

Guidelines for triage:
- Monitor: mild discomfort, no pain, no bleeding, normal pregnancy symptoms
- Rest: moderate pain, persistent symptoms, swelling, headache, fever
- Urgent: severe pain, bleeding, loss of fluid, decreased fetal movement, severe headache, vision changes, chest pain, difficulty breathing

Symptom to analyze:\n${userDesc}`
        : `আপনি একজন গর্ভাবস্থার লক্ষণ ট্রায়াজ সহায়ক। গুরুত্বপূর্ণ: আপনি ডাক্তার নন। আপনি শুধুমাত্র JSON ফরম্যাটে উত্তর দেবেন, কোনো মার্কডাউন বা কোড ব্লক ছাড়া।

নিম্নলিখিত গর্ভাবস্থার লক্ষণ বিশ্লেষণ করুন এবং এই ট্রায়াজ স্তরগুলির মধ্যে একটি ফেরত দিন:
- "monitor" — হালকা লক্ষণ, বাড়িতে মনিটর করা নিরাপদ
- "rest" — উদ্বেগজনক লক্ষণ, বিশ্রাম ও ডাক্তারের সাথে পরামর্শ
- "urgent" — লাল পতাকা লক্ষণ, অবিলম্বে চিকিৎসা নিন

JSON ফেরত দিন: {"triage": "monitor|rest|urgent", "explanation": "সংক্ষিপ্ত ১-২ বাক্যের ব্যাখ্যা সাধারণ টেক্সটে"}

নির্দেশিকা:
- Monitor: হালকা অস্বস্তি, ব্যথা নেই, রক্তপাত নেই, সাধারণ গর্ভাবস্থার লক্ষণ
- Rest: মাঝারি ব্যথা, স্থায়ী লক্ষণ, ফোলা, মাথাব্যথা, জ্বর
- Urgent: তীব্র ব্যথা, রক্তপাত, তরল নির্গমন, ভ্রূণের নড়াচড়া কমে যাওয়া, তীব্র মাথাব্যথা, দৃষ্টি পরিবর্তন, বুকে ব্যথা, শ্বাসকষ্ট

বিশ্লেষণ করার লক্ষণ:\n${userDesc}`;

      let lastError = '';
      let success = false;

      for (const model of MODELS) {
        if (success) break;
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: promptText }] }],
              }),
            }
          );

          const data = await response.json();

          if (data.error) {
            lastError = data.error.message || JSON.stringify(data.error);
            continue;
          }

          let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (!text) {
            lastError = `${lang === 'en' ? 'Empty response' : 'খালি উত্তর'}`;
            continue;
          }

          text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          const parsed = JSON.parse(text);

          const triageResult = {
            triage: parsed.triage || 'rest',
            explanation: parsed.explanation || '',
          };

          setResult(triageResult);
          setHistory(prev => [{
            id: Date.now().toString(),
            symptom: symptom.trim(),
            severity,
            duration: dict[duration],
            triage: triageResult.triage,
            date: new Date().toLocaleString(),
          }, ...prev].slice(0, 20));

          success = true;
        } catch (err) {
          lastError = err.message;
        }
      }

      if (!success) {
        setResult({ triage: 'rest', explanation: `${lang === 'en' ? 'All models unavailable' : 'কোনো মডেল কাজ করছে না'}: ${lastError}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LS_SYMPTOM_HISTORY);
  };

  const triageColors = {
    monitor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    rest: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-rose-100 dark:bg-rose-900/40 p-2 rounded-full">
          <HeartPulse size={20} className="text-rose-500 dark:text-rose-400" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100">{dict.symptomTitle}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{dict.symptomSubtitle}</p>
        </div>
      </div>

      {showKeyPrompt ? (
        <div className="flex-1 flex flex-col items-center px-2 py-4">
          <Key size={40} className="text-gray-300 mb-4" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">{dict.aiApiKeyLabel}</p>
          <input
            type="password"
            value={keyInputValue}
            onChange={(e) => setKeyInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
            placeholder={dict.aiApiKeyPlaceholder}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition mb-2"
          />
          <div className="flex gap-2 w-full">
            <button
              onClick={saveApiKey}
              disabled={!keyInputValue.trim()}
              className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {dict.aiApiKeySave}
            </button>
            {apiKey && (
              <button
                onClick={clearApiKey}
                className="px-4 py-2.5 rounded-xl text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition font-medium"
              >
                {dict.resetBtn}
              </button>
            )}
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mt-3 flex items-center gap-1"
          >
            {dict.aiApiKeyHelp} <ExternalLink size={12} />
          </a>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Key size={12} /> {dict.aiApiKeySet}
            </p>
            <button
              onClick={() => { setShowKeyPrompt(true); setKeyInputValue(apiKey); }}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              {dict.aiApiKeyChange}
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder={dict.symptomName}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{dict.symptomSeverity}</label>
              <SeveritySelector value={severity} onChange={setSeverity} dict={dict} />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{dict.symptomDuration}</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                {DURATIONS.map(d => (
                  <option key={d} value={d}>{dict[d]}</option>
                ))}
              </select>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={dict.symptomNotes}
              rows={2}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={!symptom.trim() || loading}
              className="w-full bg-rose-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {dict.symptomChecking}</>
              ) : (
                dict.symptomSubmit
              )}
            </button>
          </div>

          {result && (
            <div className="mt-4">
              <ResultCard result={result} dict={dict} />
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 transition"
              >
                <span>{dict.symptomLogTitle} ({history.length})</span>
                {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showHistory && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2.5 rounded-lg">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{h.symptom}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{h.date}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${triageColors[h.triage] || 'bg-gray-100 text-gray-600 dark:text-gray-300'}`}>
                        {h.triage}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 mt-1"
                  >
                    <Trash2 size={12} /> {dict.symptomClear}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
