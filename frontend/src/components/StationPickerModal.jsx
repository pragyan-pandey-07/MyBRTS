import React, { useState, useEffect, useMemo, useRef } from 'react';
import { t, getStationDisplayName, STATION_NAMES } from '../utils/translations';

export const ALL_STATIONS = [
  { name: 'Railway Station', subtitle: 'Main Rail Hub & Central Terminus', tag: 'Terminus', category: 'Hubs' },
  { name: 'DKS Bhawan', subtitle: 'City Center & Hospital Hub', tag: 'City', category: 'Govt' },
  { name: 'Telibandha', subtitle: 'Marine Drive & Major Interchange', tag: 'Hub', category: 'Hubs' },
  { name: 'Sector 15', subtitle: 'Nava Raipur Entrance Gateway', tag: 'Gate', category: 'Hubs' },
  { name: 'CBD', subtitle: 'Central Business District', tag: 'Commercial', category: 'Hubs' },
  { name: 'Ekatm Path', subtitle: 'Central Boulevard & Capitol Axis', tag: 'Axis', category: 'Hubs' },
  { name: 'North Block', subtitle: 'State Secretariat & Feeder Terminal', tag: 'Govt', category: 'Govt' },
  { name: 'Mahanadi Bhawan', subtitle: 'State Mantralaya Secretariat', tag: 'Govt', category: 'Govt' },
  { name: 'Indravati Bhawan', subtitle: 'State Directorate Complex', tag: 'Govt', category: 'Govt' },
  { name: 'South Block', subtitle: 'Administrative Zone', tag: 'Admin', category: 'Govt' },
  { name: 'Sector 27', subtitle: 'South Block & Residential Sector', tag: 'Sector', category: 'Sectors' },
  { name: 'Sector 29', subtitle: 'Institutional & Housing Sector', tag: 'Sector', category: 'Sectors' },
  { name: 'Sector 30', subtitle: 'Knowledge & Institutional Campus', tag: 'Campus', category: 'Colleges' },
  { name: 'IIM', subtitle: 'Indian Institute of Management', tag: 'Education', category: 'Colleges' },
  { name: 'Balco Medical Centre', subtitle: 'Specialty Cancer Hospital', tag: 'Medical', category: 'Colleges' },
  { name: 'HNLU', subtitle: 'Hidayatullah National Law University', tag: 'Terminus', category: 'Colleges' },
  { name: 'HNLU Gate', subtitle: 'Law University Entrance & North Gate', tag: 'Campus', category: 'Colleges' },
  { name: 'Jungle Safari', subtitle: "Asia's Largest Man-Made Safari & Zoo", tag: 'Tourism', category: 'Tourism' },
  { name: 'IIIT', subtitle: 'Intl Institute of Information Technology', tag: 'Education', category: 'Colleges' },
  { name: 'Muktangan', subtitle: 'Purkhouti Muktangan Cultural Heritage Park', tag: 'Tourism', category: 'Tourism' },
  { name: 'Nawagaon', subtitle: 'Feeder Transit Terminal & Interchange', tag: 'Feeder', category: 'Sectors' }
];

const CATEGORY_ITEMS = [
  { key: 'All', tKey: 'all' },
  { key: 'Hubs', tKey: 'hubs' },
  { key: 'Govt', tKey: 'govt' },
  { key: 'Colleges', tKey: 'colleges' },
  { key: 'Tourism', tKey: 'tourism' },
  { key: 'Sectors', tKey: 'sectors' }
];

const POPULAR_HUBS = ['Railway Station', 'Telibandha', 'CBD', 'Jungle Safari', 'IIIT', 'HNLU', 'Nawagaon'];

export default function StationPickerModal({
  isOpen,
  type = 'from', // 'from' or 'to'
  currentValue,
  otherValue,
  onSelect,
  onClose,
  lang = 'en'
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef(null);

  const isOrigin = type === 'from';
  const themeColor = isOrigin ? '#00F5D4' : '#FF2A54';
  const titleText = isOrigin ? t('selectDepTitle', lang) : t('selectArrTitle', lang);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedCategory('All');
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen, type]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredStations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ALL_STATIONS.filter(st => {
      const translatedName = getStationDisplayName(st.name, lang).toLowerCase();
      const matchesSearch =
        !query ||
        st.name.toLowerCase().includes(query) ||
        translatedName.includes(query) ||
        st.subtitle.toLowerCase().includes(query) ||
        st.tag.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === 'All' || st.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory, lang]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal / Sheet Container */}
      <div className="relative w-full max-w-lg bg-[#161B22] border-t sm:border border-[#30363D] rounded-t-[2rem] sm:rounded-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Top Header bar with decorative neon accent */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
        />

        {/* Header */}
        <div className="p-4 pb-2 border-b border-[#30363D]/70 bg-[#0D1117]/90">
          {/* Mobile Handle */}
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-3 sm:hidden" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  isOrigin ? 'border-[#00F5D4] bg-[#00F5D4]/20' : 'border-[#FF2A54] bg-[#FF2A54]/20'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isOrigin ? 'bg-[#00F5D4]' : 'bg-[#FF2A54]'}`} />
              </div>
              <h3 className="text-base font-black text-white">{titleText}</h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#161B22] border border-[#30363D] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder', lang)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-xl pl-10 pr-9 py-2.5 text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5D4] transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 text-gray-400 hover:text-white p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Hubs Shortcuts */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex-shrink-0 mr-1">
              {t('popularHubs', lang)}
            </span>
            {POPULAR_HUBS.map(hub => {
              const displayName = getStationDisplayName(hub, lang);
              return (
                <button
                  key={hub}
                  type="button"
                  onClick={() => onSelect(hub)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap transition-all ${
                    hub === currentValue
                      ? isOrigin
                        ? 'border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4]'
                        : 'border-[#FF2A54] bg-[#FF2A54]/20 text-[#FF2A54]'
                      : 'border-[#30363D] bg-[#161B22] text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {displayName.replace('रायपुर ', '').split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_ITEMS.map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`text-[10px] font-bold px-3 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-[#30363D] text-white border-gray-500 shadow-sm'
                    : 'bg-transparent text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                {t(cat.tKey, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Station List */}
        <div className="overflow-y-auto divide-y divide-[#30363D]/40 p-2 max-h-[55vh]">
          {filteredStations.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              {t('noStationsFound', lang).replace('{search}', search)}
            </div>
          ) : (
            filteredStations.map(station => {
              const isSelected = station.name === currentValue;
              const isOpposite = station.name === otherValue;
              const displayName = getStationDisplayName(station.name, lang);

              return (
                <button
                  key={station.name}
                  type="button"
                  onClick={() => onSelect(station.name)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group my-0.5 ${
                    isSelected
                      ? isOrigin
                        ? 'bg-[#00F5D4]/15 border border-[#00F5D4]/50 text-white shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                        : 'bg-[#FF2A54]/15 border border-[#FF2A54]/50 text-white shadow-[0_0_15px_rgba(255,42,84,0.15)]'
                      : 'hover:bg-[#0D1117] border border-transparent text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Station Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-105 ${
                        isSelected
                          ? isOrigin
                            ? 'bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4]'
                            : 'bg-[#FF2A54]/20 border-[#FF2A54] text-[#FF2A54]'
                          : 'bg-[#0D1117] border-[#30363D] text-gray-400 group-hover:text-white group-hover:border-gray-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold truncate ${
                            isSelected ? 'text-white' : 'text-gray-100 group-hover:text-white'
                          }`}
                        >
                          {displayName}
                        </span>
                        {isOpposite && (
                          <span className="text-[9px] font-bold text-gray-400 bg-[#0D1117] px-1.5 py-0.5 rounded border border-[#30363D]">
                            {t('opposite', lang)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {lang !== 'en' ? station.name : station.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D]">
                      {station.tag}
                    </span>

                    {isSelected && (
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                          isOrigin ? 'bg-[#00F5D4] text-[#0D1117]' : 'bg-[#FF2A54] text-white'
                        }`}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0D1117] border-t border-[#30363D]/60 flex items-center justify-between text-[11px] text-gray-400">
          <span>
            {t('showingOf', lang)
              .replace('{count}', filteredStations.length)
              .replace('{total}', ALL_STATIONS.length)}
          </span>
          <button
            onClick={onClose}
            className="text-white hover:text-[#00F5D4] font-bold transition-colors"
          >
            {t('cancel', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
