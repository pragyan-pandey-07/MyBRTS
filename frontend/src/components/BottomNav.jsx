import React from 'react';

export default function BottomNav({ setSheet, view, setView, lang }) {
  const isLive = view === 'linear';
  const isMap = view === 'map';

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 max-w-md mx-auto">
      <div className="glass-card rounded-2xl p-1.5 flex justify-between items-center shadow-[0_-5px_25px_rgba(0,0,0,0.5)] bg-[#161B22]/90">
        <button className={`flex-1 flex flex-col items-center p-2.5 rounded-xl transition-colors ${isLive ? 'text-[#FF2A54]' : 'text-gray-400 hover:text-[#00F5D4] hover:bg-[#0D1117]/50'}`} onClick={() => setView('linear')}>
          <svg className={`w-6 h-6 mb-1 ${isLive ? 'drop-shadow-[0_0_8px_rgba(255,42,84,0.8)]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span className="text-[10px] font-bold tracking-wide">Live</span>
        </button>
        <button className="flex-1 flex flex-col items-center p-2.5 text-gray-400 hover:text-[#00F5D4] rounded-xl hover:bg-[#0D1117]/50 transition-colors" onClick={() => setSheet('ticket')}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
          <span className="text-[10px] font-bold tracking-wide">Ticket</span>
        </button>
        <button className="flex-1 flex flex-col items-center p-2.5 text-gray-400 hover:text-[#00F5D4] rounded-xl hover:bg-[#0D1117]/50 transition-colors" onClick={() => setSheet('fare')}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          <span className="text-[10px] font-bold tracking-wide">Fare</span>
        </button>
        <button className={`flex-1 flex flex-col items-center p-2.5 rounded-xl transition-colors ${isMap ? 'text-[#FF2A54]' : 'text-gray-400 hover:text-[#00F5D4] hover:bg-[#0D1117]/50'}`} onClick={() => setView('map')}>
          <svg className={`w-6 h-6 mb-1 ${isMap ? 'drop-shadow-[0_0_8px_rgba(255,42,84,0.8)]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          <span className="text-[10px] font-bold tracking-wide">Map</span>
        </button>
      </div>
    </div>
  );
}
