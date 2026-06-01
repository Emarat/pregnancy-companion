import { useState, useMemo } from 'react';
import { Stethoscope, Search, MapPin, Phone, X } from 'lucide-react';
import { PROVIDERS, SERVICE_OPTIONS, COST_BANDS } from '../utils/providerData';

export default function ProviderFinder({ dict, lang }) {
  const [search, setSearch] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);

  const toggleService = (key) => {
    setSelectedServices(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const toggleCost = (key) => {
    setSelectedCosts(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedServices([]);
    setSelectedCosts([]);
  };

  const filtered = useMemo(() => {
    return PROVIDERS.filter(p => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q) || p.bnName.includes(q);
        if (!nameMatch) return false;
      }
      if (selectedServices.length > 0) {
        const hasService = selectedServices.every(s => p.services.includes(s));
        if (!hasService) return false;
      }
      if (selectedCosts.length > 0) {
        if (!selectedCosts.includes(p.cost)) return false;
      }
      return true;
    });
  }, [search, selectedServices, selectedCosts]);

  const hasFilters = search.trim() || selectedServices.length > 0 || selectedCosts.length > 0;

  const costColors = { low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' };
  const costLabels = { low: dict.costLabelLow, medium: dict.costLabelMedium, high: dict.costLabelHigh };
  const getServiceName = (s) => {
    const opt = SERVICE_OPTIONS.find(o => o.key === s);
    return opt ? (lang === 'bn' ? opt.labelBn : opt.labelEn) : s;
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-50">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2.5 rounded-xl">
          <Stethoscope size={22} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">{dict.providerTitle}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{dict.providerSubtitle}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.providerSearchPlaceholder}
          className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {SERVICE_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => toggleService(opt.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
              selectedServices.includes(opt.key)
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            }`}
          >
            {lang === 'bn' ? opt.labelBn : opt.labelEn}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {COST_BANDS.map(band => (
          <button
            key={band.key}
            onClick={() => toggleCost(band.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
              selectedCosts.includes(band.key)
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            }`}
          >
            {lang === 'bn' ? band.labelBn : band.labelEn}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-rose-500 mb-4 transition"
        >
          <X size={12} />
          {dict.providerClearFilters}
        </button>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Search size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">{dict.providerNoResults}</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="bg-gray-50 dark:bg-gray-700/70 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg shrink-0">🏥</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {lang === 'bn' ? p.bnName : p.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                    <MapPin size={11} className="text-gray-300 dark:text-gray-500 shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.address}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ml-2 ${costColors[p.cost]}`}>
                  {costLabels[p.cost]}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {p.services.map(s => (
                  <span key={s} className="text-[10px] bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600">
                    {getServiceName(s)}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${p.phone}`}
                  className="flex items-center justify-center gap-1.5 flex-1 bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-medium hover:bg-emerald-600 transition active:scale-[0.98] shadow-sm"
                >
                  <Phone size={13} />
                  {dict.providerCall}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-[0.98]"
                >
                  <MapPin size={13} />
                  {dict.providerMap}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mt-4">
        {dict.providerDisclaimer}
      </p>
    </section>
  );
}
