import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Baby, Send, Loader2, AlertCircle, Key, ExternalLink } from 'lucide-react';

const LS_KEY = 'preg_gemini_key';
const MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash-preview', 'gemini-2.0-flash'];

export default function AICompanion({ dict, lang }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '');
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [keyInputValue, setKeyInputValue] = useState(apiKey);
  const [aiInput, setAiInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAiLoading]);

  const saveApiKey = () => {
    const trimmed = keyInputValue.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    localStorage.setItem(LS_KEY, trimmed);
    setShowKeyInput(false);
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem(LS_KEY);
    setKeyInputValue('');
    setShowKeyInput(true);
  };

  const handleAskAI = async () => {
    if (!aiInput.trim() || isAiLoading || !apiKey) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsAiLoading(true);

    let lastError = '';
    for (const model of MODELS) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            ...chatHistory.map(msg => ({
              role: msg.role === 'ai' ? 'model' : 'user',
              parts: [{ text: msg.text }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          system_instruction: {
            parts: [{
              text: "You are a warm, empathetic, and knowledgeable virtual pregnancy companion. You answer general questions about pregnancy, nutrition, and common symptoms. CRITICAL: You are NOT a doctor. Keep your answers concise, reassuring, and formatting clean (no heavy markdown). You MUST respond in the language the user is speaking (English or Bengali). Always gently remind the user to consult their healthcare provider if they mention pain, bleeding, or serious concerns."
            }]
          }
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.error) {
          lastError = result.error.message || JSON.stringify(result.error);
          continue;
        }

        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
          const aiResponseText = result.candidates[0].content.parts[0].text;
          setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText }]);
          setIsAiLoading(false);
          return;
        }

        lastError = JSON.stringify(result).slice(0, 200);
      } catch (error) {
        lastError = error.message;
        continue;
      }
    }

    setChatHistory(prev => [...prev, {
      role: 'ai',
      text: `${lang === 'en' ? 'All models unavailable' : 'কোনো মডেল কাজ করছে না'}: ${lastError}`
    }]);
    setIsAiLoading(false);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50 animate-in fade-in slide-in-from-bottom-5 duration-500 flex flex-col h-[450px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
          <MessageCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 leading-tight">{dict.aiTitle}</h2>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">{dict.aiSubtitle}</p>
        </div>
        {apiKey && !showKeyInput && (
          <button
            onClick={() => { setShowKeyInput(true); setKeyInputValue(apiKey); }}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition flex items-center gap-1"
            title={dict.aiApiKeyChange}
          >
            <Key size={14} />
          </button>
        )}
      </div>

      {showKeyInput ? (
        <div className="flex-1 flex flex-col justify-center items-center px-2">
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
          <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-700/50 rounded-xl p-3 mt-3 mb-3 border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
            {chatHistory.length === 0 ? (
              <div className="m-auto text-center text-gray-400 dark:text-gray-500 text-sm flex flex-col items-center">
                <Baby size={32} className="opacity-20 mb-2" />
                <p>{dict.aiPlaceholder}</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-white self-end rounded-tr-sm'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 self-start rounded-tl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              ))
            )}
            {isAiLoading && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 self-start p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">{dict.aiThinking}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mb-2 px-2 flex items-center justify-center gap-1">
            <AlertCircle size={10} /> {dict.aiDisclaimer}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              placeholder={dict.aiPlaceholder}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              disabled={isAiLoading}
            />
            <button
              onClick={handleAskAI}
              disabled={!aiInput.trim() || isAiLoading}
              className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
