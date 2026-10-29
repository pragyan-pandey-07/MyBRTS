import React, { useState, useEffect, useRef } from 'react';
import { t, getStationDisplayName } from '../utils/translations';

export default function SOSModal({
  isOpen,
  onClose,
  currentStopName,
  startingStation,
  routeNumber,
  lang = 'en'
}) {
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const timerRef = useRef(null);

  // Stop siren when modal closes
  useEffect(() => {
    if (!isOpen && isSirenPlaying) {
      stopSiren();
    }
  }, [isOpen]);

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;

      let high = true;
      timerRef.current = setInterval(() => {
        if (oscRef.current && ctx.state === 'running') {
          oscRef.current.frequency.setValueAtTime(high ? 960 : 770, ctx.currentTime);
          high = !high;
        }
      }, 350);

      setIsSirenPlaying(true);
    } catch (err) {
      console.error('Audio siren error:', err);
    }
  };

  const stopSiren = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    setIsSirenPlaying(false);
  };

  if (!isOpen) return null;

  const currentStopDisplay = getStationDisplayName(currentStopName || 'Raipur BRTS Corridor', lang);
  const startStopDisplay = getStationDisplayName(startingStation || 'Origin', lang);

  const sosMessage = `🚨 EMERGENCY SOS ALERT:
I am traveling on Raipur BRTS Bus (Route ${routeNumber || '101'}).
Boarded at: ${startStopDisplay}
Estimated Current Location: Near ${currentStopDisplay}.
Please assist or send help immediately!`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(sosMessage)}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-red-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div className="relative w-full max-w-md bg-[#161B22] border-t sm:border border-[#FF2A54] rounded-t-[2.5rem] sm:rounded-3xl shadow-[0_-15px_60px_rgba(255,42,84,0.4)] overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Pulsing Emergency Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF2A54] via-[#00F5D4] to-[#FF2A54] animate-pulse" />

        <div className="p-5 overflow-y-auto">
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-3 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FF2A54]/20 border border-[#FF2A54] flex items-center justify-center glow-red animate-bounce">
                <span className="text-xl">🚨</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-wide">
                  {t('sosButton', lang)}
                </h3>
                <p className="text-[11px] text-[#FF2A54] font-semibold">
                  {t('sosSubtitle', lang)}
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

          {/* Current Bus Status Info Pill */}
          <div className="bg-[#0D1117] p-3 rounded-2xl border border-[#30363D] mb-4 text-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              {lang === 'hi' ? 'सवारी विवरण (लोकेशन)' : lang === 'cg' ? 'लोकेशन विवरण' : 'Live Journey Telemetry'}
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              BRT {routeNumber || '101'} • {startStopDisplay} ➔ {currentStopDisplay}
            </p>
            <p className="text-[11px] text-[#00F5D4] mt-0.5 font-medium">
              📍 {currentStopDisplay}
            </p>
          </div>

          {/* Loud Emergency Siren Button */}
          <div className="mb-4">
            <button
              onClick={isSirenPlaying ? stopSiren : startSiren}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                isSirenPlaying
                  ? 'bg-[#FF2A54] text-white glow-red animate-pulse'
                  : 'bg-[#0D1117] border border-[#FF2A54]/60 text-[#FF2A54] hover:bg-[#FF2A54]/10'
              }`}
            >
              <span className="text-lg">{isSirenPlaying ? '🔊' : '📢'}</span>
              <span>{isSirenPlaying ? t('stopSiren', lang) : t('soundSiren', lang)}</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-1">
              {t('sirenWarning', lang)}
            </p>
          </div>

          {/* Instant Call Emergency Numbers */}
          <div className="space-y-2 mb-4">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block px-1">
              {lang === 'hi' ? 'सीधा आपातकालीन कॉल' : lang === 'cg' ? 'तुरते फोन लगाओ' : 'One-Tap Emergency Calling'}
            </span>

            {/* 112 Police */}
            <a
              href="tel:112"
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-red-600/20 to-transparent border border-red-500/40 hover:border-red-500 transition-all text-white group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow">
                  112
                </div>
                <div>
                  <p className="text-xs font-bold">{t('policeHelpline', lang)}</p>
                  <p className="text-[10px] text-gray-400">National Unified Emergency</p>
                </div>
              </div>
              <span className="text-xs font-black text-red-400 group-hover:translate-x-1 transition-transform">
                CALL ➔
              </span>
            </a>

            {/* 1091 Women Safety */}
            <a
              href="tel:1091"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0D1117] border border-[#30363D] hover:border-[#00F5D4] transition-all text-white group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow">
                  1091
                </div>
                <div>
                  <p className="text-xs font-bold">{t('womenHelpline', lang)}</p>
                  <p className="text-[10px] text-gray-400">24x7 Women Passenger Safety</p>
                </div>
              </div>
              <span className="text-xs font-black text-purple-400 group-hover:translate-x-1 transition-transform">
                CALL ➔
              </span>
            </a>

            {/* 108 Ambulance */}
            <a
              href="tel:108"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0D1117] border border-[#30363D] hover:border-[#00F5D4] transition-all text-white group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow">
                  108
                </div>
                <div>
                  <p className="text-xs font-bold">{t('ambulance', lang)}</p>
                  <p className="text-[10px] text-gray-400">Ambulance & Trauma Service</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-400 group-hover:translate-x-1 transition-transform">
                CALL ➔
              </span>
            </a>

            {/* Raipur BRTS Control Room */}
            <a
              href="tel:07712422000"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0D1117] border border-[#30363D] hover:border-[#00F5D4] transition-all text-white group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-[10px] shadow">
                  BRTS
                </div>
                <div>
                  <p className="text-xs font-bold">Raipur BRTS Control Room</p>
                  <p className="text-[10px] text-gray-400">0771-2422000</p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-400 group-hover:translate-x-1 transition-transform">
                CALL ➔
              </span>
            </a>
          </div>

          {/* WhatsApp Emergency Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
          >
            <span>💬</span>
            <span>{t('shareLocationWhatsapp', lang)}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
