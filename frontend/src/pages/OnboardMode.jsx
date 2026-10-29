import React, { useState, useEffect, useMemo } from 'react';
import rawSchedules from '../data/schedules.json';
import { ALL_STATIONS } from '../components/StationPickerModal';
import { t, getStationDisplayName } from '../utils/translations';
import SOSModal from '../components/SOSModal';

function timeToMins(tStr) {
  if (!tStr) return 0;
  const parts = tStr.trim().split(' ');
  if (parts.length < 2) return 0;
  const [h, m] = parts[0].split(':').map(Number);
  const isPM = parts[1].toUpperCase() === 'PM';
  let hours = h % 12;
  if (isPM) hours += 12;
  return hours * 60 + m;
}

function minsToTimeStr(mins) {
  const m = ((mins % (24 * 60)) + (24 * 60)) % (24 * 60);
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min} ${ampm}`;
}

export default function OnboardMode({ lang = 'en' }) {
  const [startStation, setStartStation] = useState('Railway Station');
  const [direction, setDirection] = useState('HNLU'); // or 'Railway Station'
  const [routeNumber, setRouteNumber] = useState('101');
  const [manualOffset, setManualOffset] = useState(0); // in minutes
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Default departure time to 15 mins ago
  const [departureTimeStr, setDepartureTimeStr] = useState(() => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes() - 15;
    return minsToTimeStr(nowMins);
  });

  const [currentClockMins, setCurrentClockMins] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Keep clock updated every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentClockMins(now.getHours() * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Find trips starting at startStation going towards destination
  const matchingTrip = useMemo(() => {
    const o = startStation.trim().toLowerCase();
    const d = direction.trim().toLowerCase();

    // Prefer routeNumber if matched
    const candidate = rawSchedules.find(trip => {
      const stops = trip.stops || [];
      let oIdx = -1;
      let dIdx = -1;
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i].stop_name.toLowerCase();
        if (oIdx === -1 && s.includes(o)) oIdx = i;
        if (oIdx !== -1 && s.includes(d)) {
          dIdx = i;
          break;
        }
      }
      return oIdx !== -1 && dIdx !== -1 && oIdx < dIdx && trip.route_number === routeNumber;
    });

    if (candidate) return candidate;

    // Fallback to any trip matching start -> dest
    return rawSchedules.find(trip => {
      const stops = trip.stops || [];
      let oIdx = -1;
      let dIdx = -1;
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i].stop_name.toLowerCase();
        if (oIdx === -1 && s.includes(o)) oIdx = i;
        if (oIdx !== -1 && s.includes(d)) {
          dIdx = i;
          break;
        }
      }
      return oIdx !== -1 && dIdx !== -1 && oIdx < dIdx;
    }) || rawSchedules[0];
  }, [startStation, direction, routeNumber]);

  // Compute stop sequence with relative offset times (in minutes from departure)
  const stopTimeline = useMemo(() => {
    if (!matchingTrip || !matchingTrip.stops || matchingTrip.stops.length === 0) return [];
    const stops = matchingTrip.stops;

    // Find start index
    let startIdx = stops.findIndex(s => s.stop_name.toLowerCase().includes(startStation.toLowerCase()));
    if (startIdx === -1) startIdx = 0;

    const baseMins = timeToMins(stops[startIdx].time);
    const depMins = timeToMins(departureTimeStr);

    return stops.slice(startIdx).map((st, idx) => {
      const schedMins = timeToMins(st.time);
      let diff = schedMins - baseMins;
      if (diff < 0) diff += 24 * 60;

      // Estimated real-world arrival time
      const estimatedArrivalMins = depMins + diff + manualOffset;

      return {
        stop_name: st.stop_name,
        offsetFromStart: diff,
        estimatedArrivalMins,
        estimatedTimeStr: minsToTimeStr(estimatedArrivalMins),
        scheduledTime: st.time,
        idx
      };
    });
  }, [matchingTrip, startStation, departureTimeStr, manualOffset]);

  // Determine current bus location along the timeline
  const liveLocation = useMemo(() => {
    if (stopTimeline.length === 0) {
      return {
        currentIndex: 0,
        currentStop: null,
        nextStop: null,
        minsToNext: 0,
        progressPercent: 0,
        hasCompleted: false
      };
    }

    const depMins = timeToMins(departureTimeStr);
    let elapsed = currentClockMins - depMins + manualOffset;
    if (elapsed < 0) elapsed = 0;

    let currentIndex = 0;
    for (let i = 0; i < stopTimeline.length; i++) {
      if (elapsed >= stopTimeline[i].offsetFromStart) {
        currentIndex = i;
      } else {
        break;
      }
    }

    const currentStop = stopTimeline[currentIndex];
    const isLast = currentIndex === stopTimeline.length - 1;
    const nextStop = !isLast ? stopTimeline[currentIndex + 1] : null;

    let minsToNext = 0;
    if (nextStop) {
      minsToNext = Math.max(1, nextStop.offsetFromStart - elapsed);
    }

    const totalDuration = stopTimeline[stopTimeline.length - 1].offsetFromStart || 1;
    const progressPercent = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    return {
      currentIndex,
      currentStop,
      nextStop,
      minsToNext,
      progressPercent,
      hasCompleted: elapsed >= totalDuration
    };
  }, [stopTimeline, currentClockMins, departureTimeStr, manualOffset]);

  return (
    <div className="max-w-md mx-auto w-full px-4 pb-28 pt-2">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-[#00F5D4] text-[#0D1117] px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,245,212,0.5)] text-xs font-black tracking-wide animate-bounce">
            {toastMsg}
          </div>
        </div>
      )}

      {/* Top Header Card with Emergency SOS Button */}
      <div className="glass-card rounded-2xl p-4 mb-4 flex items-center justify-between border-t border-t-[#00F5D4]/40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center text-xl">
            🚌
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              {t('onBusTitle', lang)}
            </h2>
            <p className="text-[10px] text-gray-400">
              {t('onBusSubtitle', lang)}
            </p>
          </div>
        </div>

        {/* SOS Emergency Trigger Button */}
        <button
          onClick={() => setIsSOSOpen(true)}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs flex items-center gap-1.5 glow-red animate-pulse active:scale-95 shadow-lg border border-red-400/50"
        >
          <span>🚨</span>
          <span>SOS</span>
        </button>
      </div>

      {/* Bus Setup Card: Start Station, Route & Departure Time */}
      <div className="glass-card rounded-3xl p-4 mb-4 shadow-xl border border-[#30363D]">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-3">
          {lang === 'hi' ? 'बस यात्रा विवरण दर्ज करें' : lang === 'cg' ? 'बस के विवरण दर्ज करव' : 'Configure Active Bus'}
        </span>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Starting Station Selector */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">
              {t('selectStartStation', lang)}
            </label>
            <select
              value={startStation}
              onChange={(e) => setStartStation(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00F5D4] cursor-pointer"
            >
              {ALL_STATIONS.map(s => (
                <option key={s.name} value={s.name}>
                  {getStationDisplayName(s.name, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Heading Towards */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">
              {lang === 'hi' ? 'गंतव्य की ओर' : lang === 'cg' ? 'कहाँ कोती' : 'Heading Towards'}
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00F5D4] cursor-pointer"
            >
              <option value="HNLU">HNLU / Naya Raipur</option>
              <option value="Railway Station">Raipur Railway Station</option>
              <option value="Nawagaon">Nawagaon Feeder</option>
            </select>
          </div>
        </div>

        {/* Departure Time Input & Quick Presets */}
        <div className="bg-[#0D1117] p-3 rounded-2xl border border-[#30363D]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-white">
              {t('busStartedAt', lang)}:
            </span>
            <input
              type="text"
              value={departureTimeStr}
              onChange={(e) => setDepartureTimeStr(e.target.value)}
              placeholder="e.g. 08:30 AM"
              className="bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#00F5D4] w-28 text-center focus:outline-none focus:border-[#00F5D4]"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[0, 10, 20, 30, 45].map(offset => (
              <button
                key={offset}
                onClick={() => {
                  const now = new Date();
                  const targetMins = now.getHours() * 60 + now.getMinutes() - offset;
                  setDepartureTimeStr(minsToTimeStr(targetMins));
                  setManualOffset(0);
                  showToast(`Bus departure set: ${offset === 0 ? 'Just Now' : `${offset}m ago`}`);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-[#00F5D4] text-[10px] font-bold text-gray-300 hover:text-white whitespace-nowrap transition-all"
              >
                {offset === 0 ? t('justNow', lang) : `-${offset}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Traffic Delay Calibrate Buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#30363D]/60 text-xs">
          <span className="text-[11px] text-gray-400 font-semibold">
            {t('delayAdjust', lang)}:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setManualOffset(prev => prev - 5);
                showToast('Adjusted: Bus running 5m faster');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#30363D] text-[10px] font-bold text-gray-300 hover:text-white"
            >
              {t('sub5m', lang)}
            </button>
            <button
              onClick={() => {
                setManualOffset(prev => prev + 5);
                showToast('Adjusted: +5m Traffic delay added');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#FF2A54]/50 text-[10px] font-bold text-[#FF2A54] hover:bg-[#FF2A54]/10"
            >
              {t('add5m', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Live Calculated Location Card */}
      <div className="glass-card rounded-3xl p-5 mb-4 shadow-2xl relative overflow-hidden border-l-4 border-l-[#00F5D4]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00F5D4]">
                {t('currentLocation', lang)}
              </span>
            </div>
            <h3 className="text-xl font-black text-white">
              {liveLocation.currentStop
                ? getStationDisplayName(liveLocation.currentStop.stop_name, lang)
                : getStationDisplayName(startStation, lang)}
            </h3>
            {liveLocation.nextStop && (
              <p className="text-xs text-gray-400 mt-1">
                {t('approaching', lang)}{' '}
                <span className="text-white font-bold">
                  {getStationDisplayName(liveLocation.nextStop.stop_name, lang)}
                </span>{' '}
                ({t('arrivingIn', lang)} ~{liveLocation.minsToNext} {t('mins', lang)})
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-xl bg-[#00F5D4]/15 border border-[#00F5D4]/50 text-[#00F5D4] text-xs font-black">
              BRT {matchingTrip.route_number}
            </span>
            <p className="text-[10px] text-gray-400 mt-1 font-mono">
              {liveLocation.progressPercent}% {t('journeyProgress', lang)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
          <div
            className="bg-gradient-to-r from-[#00F5D4] to-[#00E676] h-full transition-all duration-500"
            style={{ width: `${liveLocation.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual Stop-by-Stop Progression Timeline */}
      <div className="glass-card rounded-3xl p-5 shadow-xl border border-[#30363D]">
        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex justify-between items-center">
          <span>{lang === 'hi' ? 'स्टेशन प्रगति रेखा' : lang === 'cg' ? 'स्टेशन प्रगति' : 'Station Progression'}</span>
          <span className="text-[10px] text-gray-400 font-semibold lowercase">
            {liveLocation.currentIndex + 1} / {stopTimeline.length} {t('stopsCompleted', lang)}
          </span>
        </h4>

        <div className="relative pl-6 space-y-5 border-l-2 border-[#30363D] ml-3">
          {stopTimeline.map((st, idx) => {
            const isPassed = idx < liveLocation.currentIndex;
            const isCurrent = idx === liveLocation.currentIndex;
            const isFuture = idx > liveLocation.currentIndex;

            return (
              <div key={idx} className="relative flex items-center justify-between text-xs">
                {/* Visual Marker on Transit Line */}
                <div
                  className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'w-6 h-6 -left-[35px] bg-[#00F5D4] border-[#0D1117] shadow-[0_0_15px_rgba(0,245,212,0.8)] z-10'
                      : isPassed
                      ? 'bg-[#10B981] border-[#0D1117]'
                      : 'bg-[#161B22] border-gray-600'
                  }`}
                >
                  {isCurrent ? (
                    <span className="text-[10px]">🚌</span>
                  ) : isPassed ? (
                    <span className="text-[8px] text-[#0D1117] font-black">✓</span>
                  ) : null}
                </div>

                {/* Stop Name & Role */}
                <div className="min-w-0 pr-2">
                  <span
                    className={`font-bold block truncate ${
                      isCurrent
                        ? 'text-[#00F5D4] text-sm'
                        : isPassed
                        ? 'text-gray-400 line-through'
                        : 'text-white'
                    }`}
                  >
                    {getStationDisplayName(st.stop_name, lang)}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {st.offsetFromStart === 0 ? 'Departure Point' : `+${st.offsetFromStart} mins`}
                  </span>
                </div>

                {/* Arrival Time */}
                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isCurrent ? 'text-[#00F5D4]' : isPassed ? 'text-gray-500' : 'text-gray-300'
                    }`}
                  >
                    {st.estimatedTimeStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Emergency SOS Dialog Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentStopName={liveLocation.currentStop?.stop_name || startStation}
        startingStation={startStation}
        routeNumber={matchingTrip.route_number}
        lang={lang}
      />
    </div>
  );
}
