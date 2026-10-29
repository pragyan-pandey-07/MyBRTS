import React from 'react';
import { t } from '../utils/translations';

export default function BottomNav({ setSheet, view, setView, lang = 'en' }) {
  const isLive = view === 'linear';
  const isOnboard = view === 'onboard';
  const isSchedule = view === 'schedule';

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 z-50 max-w-md mx-auto">
      <div className="glass-card rounded-2xl p-1.5 flex justify-between items-center shadow-[0_-5px_25px_rgba(0,0,0,0.5)] bg-[#161B22]/95 border border-[#30363D]">
        {/* 1. Live Tracking */}
        <button
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${isLive ? 'text-[#00F5D4]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => { setView('linear'); setSheet(null); }}
        >
          <svg className={`w-5 h-5 mb-1 ${isLive ? 'drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-[10px] font-bold tracking-wide">{t('live', lang)}</span>
        </button>

        {/* 2. Onboard Live Bus Mode */}
        <button
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${isOnboard ? 'text-[#FF2A54]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => { setView('onboard'); setSheet(null); }}
        >
          <div className="relative">
            <svg className={`w-5 h-5 mb-1 ${isOnboard ? 'drop-shadow-[0_0_8px_rgba(255,42,84,0.8)]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF2A54] animate-ping" />
          </div>
          <span className="text-[10px] font-bold tracking-wide">{t('onBus', lang)}</span>
        </button>

        {/* 3. Official Timetable Schedule */}
        <button
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${isSchedule ? 'text-[#00F5D4]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => { setView('schedule'); setSheet(null); }}
        >
          <svg className={`w-5 h-5 mb-1 ${isSchedule ? 'drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold tracking-wide">{t('schedule', lang)}</span>
        </button>

        {/* 4. Official Fare Matrix */}
        <button
          className="flex-1 flex flex-col items-center py-2 px-1 text-gray-400 hover:text-[#00F5D4] rounded-xl transition-all"
          onClick={() => setSheet('fare')}
        >
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold tracking-wide">{t('fare', lang)}</span>
        </button>
      </div>
    </div>
  );
}
