import React, { useState, useMemo } from 'react';
import rawSchedules from '../data/schedules.json';
import StationPickerModal, { ALL_STATIONS } from '../components/StationPickerModal';
import { t, getStationDisplayName } from '../utils/translations';

const ALL_STOPS = [
  'Railway Station',
  'DKS Bhawan',
  'Telibandha',
  'Sector 15',
  'CBD',
  'Ekatm Path',
  'North Block',
  'Mahanadi Bhawan',
  'Indravati Bhawan',
  'South Block',
  'Sector 27',
  'Sector 29',
  'Sector 30',
  'IIM',
  'Balco Medical Centre',
  'HNLU',
  'HNLU Gate',
  'Jungle Safari',
  'IIIT',
  'Muktangan',
  'Nawagaon'
];

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

export default function LiveTracking({ view = 'linear', lang = 'en' }) {
  const [from, setFrom] = useState('Railway Station');
  const [to, setTo] = useState('HNLU');
  const [activePicker, setActivePicker] = useState(null); // 'from' | 'to' | null
  const [day, setDay] = useState('weekday');
  const [isOnboard, setIsOnboard] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const fromDetail = useMemo(
    () => ALL_STATIONS.find(s => s.name === from) || { name: from, subtitle: 'BRTS Departure Stop', tag: 'Stop' },
    [from]
  );
  const toDetail = useMemo(
    () => ALL_STATIONS.find(s => s.name === to) || { name: to, subtitle: 'BRTS Arrival Stop', tag: 'Stop' },
    [to]
  );

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Find matching trips that pass through origin and then destination
  const matchingTrips = useMemo(() => {
    const o = from.trim().toLowerCase();
    const d = to.trim().toLowerCase();
    const results = [];

    rawSchedules.forEach(trip => {
      if (trip.service_type !== day) return;

      const stops = trip.stops || [];
      let origIdx = -1;
      let destIdx = -1;

      for (let i = 0; i < stops.length; i++) {
        const sName = stops[i].stop_name.trim().toLowerCase();
        if (origIdx === -1 && sName === o) {
          origIdx = i;
        } else if (origIdx !== -1 && sName === d) {
          destIdx = i;
          break;
        }
      }

      if (origIdx !== -1 && destIdx !== -1 && origIdx < destIdx) {
        const depTime = stops[origIdx].time;
        const arrTime = stops[destIdx].time;
        const depMins = timeToMins(depTime);
        let arrMins = timeToMins(arrTime);
        let dur = arrMins - depMins;
        if (dur < 0) dur += 24 * 60;

        results.push({
          id: trip.trip_id,
          route_number: trip.route_number,
          depTime,
          arrTime,
          depMins,
          duration: dur,
          stopsCount: destIdx - origIdx,
          intermediateStops: stops.slice(origIdx, destIdx + 1),
          direction: trip.direction
        });
      }
    });

    results.sort((a, b) => a.depMins - b.depMins);
    return results;
  }, [from, to, day]);

  const nextBus = matchingTrips.length > 0 ? matchingTrips[0] : null;

  if (view === 'map') {
    return (
      <div className="max-w-md mx-auto w-full px-4 pb-24 pt-2">
        <div className="glass-card rounded-3xl p-5 border border-[#30363D] text-center">
          <div className="w-16 h-16 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white mb-1">
            {lang === 'hi' ? 'रायपुर-नवा रायपुर बीआरटीएस कॉरिडोर' : lang === 'cg' ? 'रायपुर-नवा रायपुर बीआरटीएस रूट नक्सा' : 'Raipur - Nava Raipur BRTS Corridor'}
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            {lang === 'hi' ? '21 समर्पित स्टेशन • मुख्य एक्सप्रेस व फीडर नेटवर्क' : lang === 'cg' ? '21 स्टेशन • सीधा एक्सप्रेस अउ फीडर बस' : '21 Dedicated Stations • Arterial Express & Feeder Network'}
          </p>

          <div className="space-y-3 text-left">
            <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D]">
              <span className="text-[10px] text-[#00F5D4] font-bold uppercase tracking-wider block">Main Express Corridor</span>
              <p className="text-xs font-bold text-white mt-0.5">Raipur Railway Station ➔ Telibandha ➔ CBD ➔ Indravati ➔ HNLU</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Routes 101, 102, 105, 201, 202, 203, 204, 205</p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-xl border border-[#30363D]">
              <span className="text-[10px] text-[#FF2A54] font-bold uppercase tracking-wider block">Feeder Link</span>
              <p className="text-xs font-bold text-white mt-0.5">North Block ➔ Indravati ➔ Sector 27 ➔ Muktangan ➔ Nawagaon</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Feeder Route F-01</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full pb-24">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-[#00F5D4] text-[#0D1117] px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,245,212,0.5)] text-xs font-black tracking-wide animate-bounce">
            {toastMsg}
          </div>
        </div>
      )}

      {/* Origin & Destination Search Card */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-2xl p-4 relative shadow-xl border-t border-t-[#30363D]/50">
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(#00F5D4_1px,transparent_1px),linear-gradient(90deg,#00F5D4_1px,transparent_1px)] bg-[size:15px_15px]"></div>
          
          <div className="relative z-10 flex flex-col gap-4">
            {/* Day Toggle Bar */}
            <div className="flex justify-between items-center pb-2 border-b border-[#30363D]/60">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {t('serviceDay', lang)}
              </span>
              <div className="day-pill-container">
                <button
                  type="button"
                  onClick={() => setDay('weekday')}
                  className={`px-3 py-1.5 text-xs transition-all ${
                    day === 'weekday' ? 'day-pill-active' : 'day-pill-inactive'
                  }`}
                >
                  {day === 'weekday' && lang !== 'en' ? 'सोम-शुक्र' : t('weekday', lang)}
                </button>
                <button
                  type="button"
                  onClick={() => setDay('weekend')}
                  className={`px-3 py-1.5 text-xs transition-all ${
                    day === 'weekend' ? 'day-pill-active' : 'day-pill-inactive'
                  }`}
                >
                  {day === 'weekend' && lang !== 'en' ? 'शनि-रवि' : t('weekend', lang)}
                </button>
              </div>
            </div>

            {/* Inputs with Aesthetic Station Trigger Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-2.5">
                {/* Departure Button */}
                <button
                  type="button"
                  onClick={() => setActivePicker('from')}
                  className="w-full text-left bg-[#0D1117]/90 hover:bg-[#161B22] border border-[#30363D] hover:border-[#00F5D4] rounded-2xl p-3 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00F5D4] bg-[#00F5D4]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {t('fromOrigin', lang)}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-[#161B22] px-1.5 py-0.2 rounded border border-[#30363D]">
                          {fromDetail.tag}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white block truncate mt-0.5">
                        {getStationDisplayName(fromDetail.name, lang)}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {lang !== 'en' ? fromDetail.name : fromDetail.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#00F5D4] pl-2 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase hidden sm:inline">{t('change', lang)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Arrival Button */}
                <button
                  type="button"
                  onClick={() => setActivePicker('to')}
                  className="w-full text-left bg-[#0D1117]/90 hover:bg-[#161B22] border border-[#30363D] hover:border-[#FF2A54] rounded-2xl p-3 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FF2A54] bg-[#FF2A54]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A54]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {t('toDestination', lang)}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-[#161B22] px-1.5 py-0.2 rounded border border-[#30363D]">
                          {toDetail.tag}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white block truncate mt-0.5">
                        {getStationDisplayName(toDetail.name, lang)}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {lang !== 'en' ? toDetail.name : toDetail.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#FF2A54] pl-2 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase hidden sm:inline">{t('change', lang)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Aesthetic Neon Swap Button */}
              <button
                type="button"
                className="bg-[#161B22] border border-[#30363D] p-3.5 rounded-2xl hover:border-[#00F5D4] transition-all z-20 shadow-lg active:scale-90 flex-shrink-0 flex items-center justify-center hover:bg-[#0D1117] group"
                onClick={swap}
                title={t('swap', lang)}
              >
                <svg className="w-4 h-4 text-[#00F5D4] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>{matchingTrips.length} {t('scheduledBuses', lang)}</span>
              {matchingTrips.length > 0 && (
                <span className="text-[#00F5D4] font-bold">{t('firstAt', lang)} {matchingTrips[0].depTime}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Stop Radar */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-xl p-3 flex items-center gap-3 border-l-[3px] border-l-[#00F5D4] bg-gradient-to-r from-[#00F5D4]/10 to-transparent">
          <div className="w-9 h-9 rounded-full bg-[#00F5D4]/20 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border border-[#00F5D4] animate-ping opacity-50"></div>
            <svg className="w-4 h-4 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.078 2.027-.231 3.021M15.328 15.328A9.125 9.125 0 0112 18a9.125 9.125 0 01-3.328-2.672M12 18V21M12 3a9 9 0 00-9 9m9-9a9 9 0 019 9" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{t('nearestRadar', lang)}</p>
            <p className="text-xs font-bold text-white">{t('nearestStopName', lang)}</p>
            <p className="text-[#00F5D4] text-[11px] font-medium">{t('nearestStopWalk', lang)}</p>
          </div>
        </div>
      </div>

      {/* Live Route & Onboard Card */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-3xl p-5 relative shadow-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'सक्रिय बस सेवा' : lang === 'cg' ? 'चालू बस सेवा' : 'Active Service'}
              </p>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                BRT {nextBus ? nextBus.route_number : '101'}
                <span className="bg-[#00F5D4]/10 text-[#00F5D4] text-[10px] px-2 py-0.5 rounded-full border border-[#00F5D4]/30 uppercase tracking-widest font-bold">
                  Express
                </span>
              </h3>
            </div>

            {/* Crowdsourced GPS Toggle */}
            <button
              onClick={() => {
                const nextState = !isOnboard;
                setIsOnboard(nextState);
                showToast(nextState ? t('onboardToastOn', lang) : t('onboardToastOff', lang));
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-2 transition-all ${isOnboard ? 'border-[#00F5D4] bg-[#00F5D4]/20 text-white shadow-[0_0_12px_rgba(0,245,212,0.3)]' : 'border-[#30363D] bg-[#0D1117] text-gray-400 hover:text-white'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnboard ? 'bg-[#00F5D4] animate-ping' : 'bg-gray-500'}`}></div>
              <span>{isOnboard ? t('onboardMode', lang) : (lang === 'hi' ? 'सवार मोड' : lang === 'cg' ? 'सवार मोड' : 'Onboard Mode')}</span>
            </button>
          </div>

          {/* Departure Summary */}
          {nextBus ? (
            <div className="flex justify-between items-end pb-4 border-b border-[#30363D] mb-4">
              <div>
                <p className="text-xs text-gray-400">
                  {lang === 'hi' ? 'प्रस्थान समय' : lang === 'cg' ? 'छूटे के समै' : 'Scheduled Departure'}
                </p>
                <p className="text-2xl font-black text-white">{nextBus.depTime}</p>
                <p className="text-xs text-[#00F5D4] mt-0.5">
                  {lang === 'hi' ? 'अनुमानित आगमन' : lang === 'cg' ? 'पहुंचे के समै' : 'Est. Arrival'}: {nextBus.arrTime}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-[#FF2A54]/10 border border-[#FF2A54]/40 rounded-lg text-[#FF2A54] text-xs font-black animate-pulse">
                  {nextBus.duration} {t('mins', lang)}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">
                  {nextBus.stopsCount} {t('intermediateStops', lang)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400 text-xs">
              {t('noBusesFound', lang)}
            </div>
          )}

          {/* Destination Alarm Action */}
          <div className="flex justify-between items-center bg-[#0D1117]/60 p-3 rounded-2xl border border-[#30363D]">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${alarmActive ? 'bg-[#FF2A54] text-white glow-red' : 'bg-[#161B22] text-gray-400'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t('destAlarm', lang)}</p>
                <p className="text-[10px] text-gray-400">{t('destAlarmDesc', lang)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextAlarm = !alarmActive;
                setAlarmActive(nextAlarm);
                showToast(nextAlarm ? `${t('alarmSetToast', lang)} ${getStationDisplayName(to, lang)}` : t('alarmOffToast', lang));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${alarmActive ? 'bg-[#FF2A54] text-white glow-red' : 'bg-[#161B22] border border-[#30363D] text-gray-300 hover:border-[#00F5D4]'}`}
            >
              {alarmActive ? (lang === 'hi' ? 'सक्रिय' : lang === 'cg' ? 'चालू' : 'Active') : (lang === 'hi' ? 'चालू करें' : lang === 'cg' ? 'चालू करव' : 'Enable')}
            </button>
          </div>
        </div>
      </div>

      {/* Matching Buses List */}
      <div className="px-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>
            {lang === 'hi' ? `सभी निर्धारित फेरे (${matchingTrips.length})` : lang === 'cg' ? `जम्मो फेरा (${matchingTrips.length})` : `All Scheduled Departures (${matchingTrips.length})`}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold lowercase">
            {lang === 'hi' ? 'स्टॉप देखने हेतु टैप करें' : lang === 'cg' ? 'स्टॉप देखे बर टैप करव' : 'tap to expand stops'}
          </span>
        </h3>

        <div className="flex flex-col gap-2.5">
          {matchingTrips.map((trip, idx) => {
            const isExpanded = expandedTripId === trip.id;
            const isNext = idx === 0;

            return (
              <div
                key={trip.id}
                className={`glass-card rounded-2xl border transition-all overflow-hidden ${isNext ? 'border-[#00F5D4]/60 bg-[#00F5D4]/5' : 'border-[#30363D]'}`}
              >
                <div
                  className="p-3.5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedTripId(prev => prev === trip.id ? null : trip.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col items-center justify-center font-mono">
                      <span className="text-[8px] text-[#00F5D4] font-bold">BRT</span>
                      <span className="text-xs font-black text-white">{trip.route_number}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white">{trip.depTime}</span>
                        <span className="text-gray-500 text-xs">➔</span>
                        <span className="text-xs font-bold text-gray-300">{trip.arrTime}</span>
                        {isNext && (
                          <span className="bg-[#00F5D4] text-[#0D1117] text-[9px] font-black px-1.5 py-0.5 rounded ml-1">
                            {lang === 'hi' ? 'अगली बस' : lang === 'cg' ? 'अगली बस' : 'NEXT'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {trip.duration} {t('mins', lang)} • {trip.stopsCount} {t('intermediateStops', lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="text-xs font-bold text-[#00F5D4]">
                      {isExpanded ? t('hideStops', lang) : t('showStops', lang)}
                    </button>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180 text-[#00F5D4]' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Stop by Stop Expansion */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-[#0D1117]/80 border-t border-[#30363D]">
                    <div className="relative pl-5 border-l-2 border-[#30363D] ml-2 space-y-2 mt-2">
                      {trip.intermediateStops.map((st, sIdx) => {
                        const isStart = sIdx === 0;
                        const isEnd = sIdx === trip.intermediateStops.length - 1;
                        return (
                          <div key={sIdx} className="relative flex justify-between items-center text-xs">
                            <div
                              className={`absolute -left-[27px] w-3 h-3 rounded-full border-2 ${isStart ? 'bg-[#00F5D4] border-[#0D1117]' : isEnd ? 'bg-[#FF2A54] border-[#0D1117]' : 'bg-[#161B22] border-gray-600'}`}
                            ></div>
                            <span className={isStart || isEnd ? 'text-white font-bold' : 'text-gray-300'}>
                              {getStationDisplayName(st.stop_name, lang)}
                            </span>
                            <span className="font-mono text-[11px] text-[#00F5D4] font-semibold">
                              {st.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Station Selection Modal */}
      <StationPickerModal
        isOpen={activePicker !== null}
        type={activePicker || 'from'}
        currentValue={activePicker === 'from' ? from : to}
        otherValue={activePicker === 'from' ? to : from}
        onSelect={(stationName) => {
          if (activePicker === 'from') setFrom(stationName);
          else setTo(stationName);
          setActivePicker(null);
        }}
        onClose={() => setActivePicker(null)}
        lang={lang}
      />
    </div>
  );
}
