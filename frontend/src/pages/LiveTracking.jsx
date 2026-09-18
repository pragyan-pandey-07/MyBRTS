import React, { useState } from 'react';

export default function LiveTracking({ view }) {
  const [from, setFrom] = useState('Railway Station');
  const [to, setTo] = useState('HNLU');

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  if (view === 'map') {
    return (
      <div className="fixed inset-0 z-40 bg-[#0D1117] pt-20">
        <div className="absolute inset-0 opacity-40" style={{background: 'radial-gradient(circle at center, #161B22 0%, #0D1117 100%)'}}>
          <div className="absolute inset-0 bg-[linear-gradient(#30363D_1px,transparent_1px),linear-gradient(90deg,#30363D_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        </div>
        
        <svg className="absolute inset-0 w-full h-full max-w-md mx-auto" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid meet">
          <path d="M 100 150 C 200 200 250 400 150 600 S 300 700 350 750" fill="none" stroke="#30363D" strokeWidth="5" strokeDasharray="10 10"/>
          <path d="M 100 150 C 200 200 250 400 190 480" fill="none" stroke="#00F5D4" strokeWidth="7" className="glow-green" strokeLinecap="round"/>
          
          <circle cx="100" cy="150" r="10" fill="#30363D" stroke="#0D1117" strokeWidth="4"/>
          <circle cx="215" cy="400" r="12" fill="#FF2A54" stroke="#0D1117" strokeWidth="4" className="glow-red animate-pulse"/>
          <circle cx="150" cy="600" r="10" fill="#0D1117" stroke="#00F5D4" strokeWidth="4" className="glow-green"/>
          <circle cx="350" cy="750" r="10" fill="#0D1117" stroke="#30363D" strokeWidth="4"/>
          
          <text x="120" y="155" fill="#9CA3AF" fontSize="14" fontWeight="600" fontFamily="sans-serif">Railway Station</text>
          <text x="235" y="405" fill="#FF2A54" fontSize="18" fontWeight="bold" fontFamily="sans-serif" filter="drop-shadow(0 0 8px #FF2A54)">Telibandha</text>
          <text x="170" y="605" fill="#00F5D4" fontSize="14" fontWeight="600" fontFamily="sans-serif">Sector 15</text>
          <text x="290" y="755" fill="#9CA3AF" fontSize="14" fontWeight="600" fontFamily="sans-serif">HNLU</text>
          
          <g transform="translate(170, 440)">
            <circle cx="20" cy="20" r="25" fill="#FF2A54" fillOpacity="0.2" className="animate-[ping_2s_infinite]"/>
            <circle cx="20" cy="20" r="12" fill="#FF2A54" />
            <path d="M20 8 L28 25 L12 25 Z" fill="#fff" transform="rotate(30 20 20)"/>
          </g>
        </svg>
        
        <div className="absolute top-20 left-4 right-4 z-50 max-w-md mx-auto">
          <div className="glass-card rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-t border-t-[#00F5D4]/30">
            <div>
              <p className="text-white font-black text-lg">BRT 04</p>
              <p className="text-[#00F5D4] text-xs font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse"></span>
                Arriving at Telibandha
              </p>
            </div>
            <div className="text-right bg-[#0D1117] px-3 py-1.5 rounded-xl border border-[#30363D]">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">ETA</p>
              <p className="text-white font-bold text-xl">4 <span className="text-xs font-normal text-gray-400">min</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="px-4 mb-5">
        <div className="glass-card rounded-2xl p-4 relative overflow-hidden shadow-xl border-t border-t-[#30363D]/50">
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(#00F5D4_1px,transparent_1px),linear-gradient(90deg,#00F5D4_1px,transparent_1px)] bg-[size:15px_15px]"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center">
              <div className="flex flex-col items-center mr-4 w-4">
                <div className="w-3 h-3 rounded-full border-[2.5px] border-[#00F5D4] bg-[#0D1117] relative z-10"></div>
                <div className="w-[2px] h-10 bg-[#30363D] my-1 border-dashed"></div>
                <div className="w-3 h-3 rounded-full border-[2.5px] border-[#FF2A54] bg-[#0D1117] relative z-10"></div>
              </div>
              <div className="flex-1 flex flex-col gap-3 relative">
                <input type="text" value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-[#0D1117]/50 rounded-lg border border-[#30363D] px-3 py-2.5 text-white focus:outline-none focus:border-[#00F5D4] focus:bg-[#161B22] transition-colors text-sm font-medium" placeholder="Origin" />
                <input type="text" value={to} onChange={e => setTo(e.target.value)} className="w-full bg-[#0D1117]/50 rounded-lg border border-[#30363D] px-3 py-2.5 text-white focus:outline-none focus:border-[#FF2A54] focus:bg-[#161B22] transition-colors text-sm font-medium" placeholder="Destination" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#161B22] border border-[#30363D] p-2 rounded-full hover:border-[#00F5D4] transition z-20 shadow-md" onClick={swap}>
                  <svg className="w-3.5 h-3.5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                </button>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-[#FF2A54] to-[#E63946] text-white py-3 rounded-xl font-bold shadow-[0_4px_15px_rgba(255,42,84,0.3)] flex justify-center items-center gap-2 active:scale-[0.98] transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span>Find Buses</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Nearest Stop Radar & Live Track elements can be easily added here... */}
    </div>
  );
}
