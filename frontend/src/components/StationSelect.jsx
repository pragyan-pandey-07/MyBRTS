import React, { useState, useRef, useEffect } from 'react';

const STATION_DETAILS = [
  { name: 'Railway Station', subtitle: 'Main Rail Hub & Terminus', tag: 'Terminus' },
  { name: 'DKS Bhawan', subtitle: 'City Center & Hospital Hub', tag: 'City' },
  { name: 'Telibandha', subtitle: 'Marine Drive & Major Interchange', tag: 'Hub' },
  { name: 'Sector 15', subtitle: 'Nava Raipur Entrance Gateway', tag: 'Gate' },
  { name: 'CBD', subtitle: 'Central Business District', tag: 'Commercial' },
  { name: 'Ekatm Path', subtitle: 'Central Boulevard & Capitol Axis', tag: 'Axis' },
  { name: 'North Block', subtitle: 'State Secretariat & Feeder Hub', tag: 'Govt' },
  { name: 'Mahanadi Bhawan', subtitle: 'State Mantralaya Secretariat', tag: 'Govt' },
  { name: 'Indravati Bhawan', subtitle: 'State Directorate Complex', tag: 'Govt' },
  { name: 'South Block', subtitle: 'Administrative Zone', tag: 'Admin' },
  { name: 'Sector 27', subtitle: 'South Block & Residential Sector', tag: 'Sector' },
  { name: 'Sector 29', subtitle: 'Institutional & Housing Sector', tag: 'Sector' },
  { name: 'Sector 30', subtitle: 'Knowledge & Institutional Campus', tag: 'Campus' },
  { name: 'IIM', subtitle: 'Indian Institute of Management', tag: 'Education' },
  { name: 'Balco Medical Centre', subtitle: 'Specialty Cancer Hospital', tag: 'Medical' },
  { name: 'HNLU', subtitle: 'Hidayatullah National Law University Terminus', tag: 'Terminus' },
  { name: 'HNLU Gate', subtitle: 'Law University Entrance & North Gate', tag: 'Campus' },
  { name: 'Jungle Safari', subtitle: "Asia's Largest Man-Made Safari & Zoo", tag: 'Tourism' },
  { name: 'IIIT', subtitle: 'Intl Institute of Information Technology', tag: 'Education' },
  { name: 'Muktangan', subtitle: 'Purkhouti Muktangan Cultural Heritage Park', tag: 'Tourism' },
  { name: 'Nawagaon', subtitle: 'Feeder Transit Terminal & Interchange', tag: 'Feeder' }
];

const POPULAR_HUBS = ['Railway Station', 'Telibandha', 'CBD', 'Jungle Safari', 'IIIT', 'HNLU', 'Nawagaon'];

export default function StationSelect({
  label = 'Station',
  value,
  onChange,
  accent = 'teal', // 'teal' or 'pink'
  otherSelected
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const isTeal = accent === 'teal';
  const accentColor = isTeal ? '#00F5D4' : '#FF2A54';
  const glowClass = isTeal ? 'glow-green' : 'glow-red';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredStations = STATION_DETAILS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    s.tag.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (stationName) => {
    onChange(stationName);
    setIsOpen(false);
    setSearch('');
  };

  const selectedDetail = STATION_DETAILS.find(s => s.name === value) || {
    name: value,
    subtitle: 'BRTS Stop',
    tag: 'Stop'
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-[#0D1117]/90 hover:bg-[#161B22] rounded-xl border p-2.5 transition-all flex items-center justify-between group ${
          isOpen
            ? isTeal
              ? 'border-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.25)]'
              : 'border-[#FF2A54] shadow-[0_0_15px_rgba(255,42,84,0.25)]'
            : 'border-[#30363D] hover:border-gray-500'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Glowing Pin Marker */}
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-transform group-hover:scale-110 ${
              isTeal
                ? 'border-[#00F5D4] bg-[#00F5D4]/20'
                : 'border-[#FF2A54] bg-[#FF2A54]/20'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isTeal ? 'bg-[#00F5D4]' : 'bg-[#FF2A54]'
              }`}
            />
          </div>

          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block -mb-0.5">
              {label}
            </span>
            <span className="text-sm font-bold text-white block truncate">
              {selectedDetail.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#161B22] border border-[#30363D] text-gray-400 uppercase tracking-wider hidden sm:inline-block">
            {selectedDetail.tag}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : 'group-hover:text-gray-300'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Floating Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#161B22]/95 backdrop-blur-xl border border-[#30363D] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
          {/* Neon Top Glow line */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
            }}
          />

          {/* Search Bar Inside Dropdown */}
          <div className="p-3 border-b border-[#30363D]/70 bg-[#0D1117]/80">
            <div className="relative flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none"
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
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search station or landmark..."
                className="w-full bg-[#161B22] border border-[#30363D] rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5D4] transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 text-gray-400 hover:text-white p-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Quick Hub Chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex-shrink-0">
                Hubs:
              </span>
              {POPULAR_HUBS.map(hub => (
                <button
                  key={hub}
                  type="button"
                  onClick={() => handleSelect(hub)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap transition-all ${
                    hub === value
                      ? isTeal
                        ? 'border-[#00F5D4] bg-[#00F5D4]/20 text-white'
                        : 'border-[#FF2A54] bg-[#FF2A54]/20 text-white'
                      : 'border-[#30363D] bg-[#161B22] text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {hub.replace('Station', 'Stn')}
                </button>
              ))}
            </div>
          </div>

          {/* Station List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-[#30363D]/40 p-1.5">
            {filteredStations.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                No matching stops found for "{search}"
              </div>
            ) : (
              filteredStations.map(station => {
                const isSelected = station.name === value;
                const isOther = station.name === otherSelected;

                return (
                  <button
                    key={station.name}
                    type="button"
                    onClick={() => handleSelect(station.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                      isSelected
                        ? isTeal
                          ? 'bg-[#00F5D4]/15 border border-[#00F5D4]/40 text-white'
                          : 'bg-[#FF2A54]/15 border border-[#FF2A54]/40 text-white'
                        : 'hover:bg-[#0D1117]/80 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                          isSelected
                            ? isTeal
                              ? 'bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4]'
                              : 'bg-[#FF2A54]/20 border-[#FF2A54] text-[#FF2A54]'
                            : 'bg-[#0D1117] border-[#30363D] text-gray-400 group-hover:text-white group-hover:border-gray-500'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                            }`}
                          >
                            {station.name}
                          </span>
                          {isOther && (
                            <span className="text-[9px] text-gray-500 bg-[#0D1117] px-1.5 py-0.2 rounded border border-[#30363D]">
                              Opposite
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">
                          {station.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#0D1117] border border-[#30363D]">
                        {station.tag}
                      </span>
                      {isSelected && (
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isTeal ? 'bg-[#00F5D4] text-[#0D1117]' : 'bg-[#FF2A54] text-white'
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
