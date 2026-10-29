import React from 'react';

export const THEME_PRESETS = [
  {
    id: 'neon',
    name: { en: 'Cyber Neon', hi: 'साइबर नियॉन', cg: 'साइबर नियॉन' },
    desc: { en: 'High-tech cyan & rose neon accents', hi: 'चमकदार नीला और गुलाबी नियॉन', cg: 'चमकदार नीला अउ गुलाबी' },
    color1: '#00F5D4',
    color2: '#FF2A54'
  },
  {
    id: 'emerald',
    name: { en: 'Eco Emerald', hi: 'इको एमराल्ड', cg: 'हरियर एमराल्ड' },
    desc: { en: 'Green nature Raipur eco-corridor', hi: 'रायपुर हरित पर्यावरण थीम', cg: 'हरियर रायपुर थीम' },
    color1: '#10B981',
    color2: '#A3E635'
  },
  {
    id: 'sunset',
    name: { en: 'Atal Sunset', hi: 'अटल सनसेट', cg: 'अटल सनसेट' },
    desc: { en: 'Warm golden amber & coral dusk', hi: 'नवा रायपुर गोधूलि वेला थीम', cg: 'संजौहा सुनहला धूप' },
    color1: '#F59E0B',
    color2: '#F43F5E'
  },
  {
    id: 'metro',
    name: { en: 'Capital Metro', hi: 'कैपिटल मेट्रो', cg: 'कैपिटल मेट्रो' },
    desc: { en: 'Clean sapphire & electric blue', hi: 'नीला मेट्रो और आधुनिक रेल थीम', cg: 'नीला मेट्रो रेल थीम' },
    color1: '#38BDF8',
    color2: '#818CF8'
  }
];

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  mode,
  setMode,
  colorTheme,
  setColorTheme,
  lang = 'en'
}) {
  if (!isOpen) return null;

  const isLight = mode === 'light';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#161B22] border-t sm:border border-[#30363D] rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 p-5">
        
        {/* Handle for mobile */}
        <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-sm">
              🎨
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {lang === 'hi' ? 'थीम और रंग रूप' : lang === 'cg' ? 'थीम अउ रंग रूप' : 'Theme & Appearance'}
              </h3>
              <p className="text-[11px] text-gray-400">
                {lang === 'hi' ? 'डार्क/लाइट मोड और रंग चुनें' : lang === 'cg' ? 'डार्क/लाइट अउ रंग चुनव' : 'Customize mode & color palette'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 1. Mode Switcher (Dark vs Light) */}
        <div className="mb-5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            {lang === 'hi' ? 'प्रदर्शन मोड' : lang === 'cg' ? 'मोड' : 'Display Mode'}
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#0D1117] p-1.5 rounded-2xl border border-[#30363D]">
            <button
              onClick={() => setMode('dark')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                !isLight
                  ? 'bg-[#161B22] text-white border border-[#30363D] shadow-[0_0_12px_rgba(0,0,0,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🌙</span>
              <span>{lang === 'hi' ? 'डार्क मोड' : lang === 'cg' ? 'रात मोड (डार्क)' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={() => setMode('light')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isLight
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>☀️</span>
              <span>{lang === 'hi' ? 'लाइट मोड' : lang === 'cg' ? 'दिन मोड (लाइट)' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        {/* 2. Color Palettes */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            {lang === 'hi' ? 'रंग पैलेट' : lang === 'cg' ? 'रंग' : 'Color Palette'}
          </label>
          <div className="space-y-2">
            {THEME_PRESETS.map((tItem) => {
              const isSelected = colorTheme === tItem.id;

              return (
                <button
                  key={tItem.id}
                  onClick={() => setColorTheme(tItem.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-[#00F5D4] bg-[#00F5D4]/10 shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                      : 'border-[#30363D] bg-[#0D1117]/80 hover:bg-[#0D1117] text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Color Swatch Dot */}
                    <div className="flex -space-x-1.5 flex-shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-[#161B22] shadow"
                        style={{ backgroundColor: tItem.color1 }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-[#161B22] shadow"
                        style={{ backgroundColor: tItem.color2 }}
                      />
                    </div>

                    <div>
                      <span className="text-sm font-bold text-white block">
                        {tItem.name[lang] || tItem.name.en}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {tItem.desc[lang] || tItem.desc.en}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#00F5D4] text-[#0D1117] font-black text-xs flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-5 bg-[#00F5D4] text-[#0D1117] font-black py-3 rounded-xl hover:brightness-110 active:scale-[0.99] transition-all text-xs"
        >
          {lang === 'hi' ? 'पूर्ण' : lang === 'cg' ? 'हो गे' : 'Done'}
        </button>
      </div>
    </div>
  );
}
