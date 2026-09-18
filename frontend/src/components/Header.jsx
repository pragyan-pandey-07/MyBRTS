import React from 'react';

export default function Header({ lang, setLang }) {
  return (
    <header className="sticky top-0 z-50 glass-card px-4 py-3 flex justify-between items-center rounded-b-2xl mb-4 shadow-lg mx-2 mt-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FF2A54] flex items-center justify-center glow-red border-2 border-[#0D1117]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide leading-tight">Tatpar BRT</h1>
          <p className="text-[10px] text-[#00F5D4] tracking-widest uppercase font-semibold">Nava Raipur</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[#0D1117] border border-[#30363D] text-xs py-1.5 px-3 rounded-full focus:outline-none focus:border-[#00F5D4] text-[#00F5D4] font-medium shadow-inner appearance-none pr-8 relative">
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="cg">छत्तीसगढ़ी</option>
        </select>
        <svg className="w-3 h-3 text-[#00F5D4] absolute right-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </div>
    </header>
  );
}
