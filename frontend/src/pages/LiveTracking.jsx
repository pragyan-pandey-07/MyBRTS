import React, { useState, useMemo } from 'react';
import rawSchedules from '../data/schedules.json';
import StationPickerModal, { ALL_STATIONS } from '../components/StationPickerModal';

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
        const sName = stops[i].stop_name.toLowerCase();
        if (origIdx === -1 && sName.includes(o)) {
          origIdx = i;
        } else if (origIdx !== -1 && sName.includes(d)) {
          destIdx = i;
          break;
        }
      }

      if (origIdx !== -1 && destIdx !== -1 && origIdx < destIdx) {
        const depTime = stops[origIdx].time;
        const arrTime = stops[destIdx].time;
        const depMins = timeToMins(depTime);
        const arrMins = timeToMins(arrTime);
        let duration = arrMins - depMins;
        if (duration < 0) duration += 24 * 60;

        results.push({
          id: trip.id,
          route_number: trip.route_number,
          direction: trip.direction,
          depTime,
          arrTime,
          depMins,
          duration,
          intermediateStops: stops.slice(origIdx, destIdx + 1),
          stopsCount: destIdx - origIdx
        });
      }
    });

    results.sort((a, b) => a.depMins - b.depMins);
    return results;
  }, [from, to, day]);

  // Featured upcoming bus
  const nextBus = matchingTrips.length > 0 ? matchingTrips[0] : null;

  if (view === 'map') {
    return (
      <div className="fixed inset-0 z-40 bg-[#0D1117] pt-20">
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at center, #161B22 0%, #0D1117 100%)' }}>
          <div className="absolute inset-0 bg-[linear-gradient(#30363D_1px,transparent_1px),linear-gradient(90deg,#30363D_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        </div>

        <svg className="absolute inset-0 w-full h-full max-w-md mx-auto" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid meet">
          <path d="M 100 150 C 200 200 250 400 150 600 S 300 700 350 750" fill="none" stroke="#30363D" strokeWidth="5" strokeDasharray="10 10" />
          <path d="M 100 150 C 200 200 250 400 190 480" fill="none" stroke="#00F5D4" strokeWidth="7" className="glow-green" strokeLinecap="round" />

          <circle cx="100" cy="150" r="10" fill="#30363D" stroke="#0D1117" strokeWidth="4" />
          <circle cx="215" cy="400" r="12" fill="#FF2A54" stroke="#0D1117" strokeWidth="4" className="glow-red animate-pulse" />
          <circle cx="150" cy="600" r="10" fill="#0D1117" stroke="#00F5D4" strokeWidth="4" className="glow-green" />
          <circle cx="350" cy="750" r="10" fill="#0D1117" stroke="#30363D" strokeWidth="4" />

          <text x="120" y="155" fill="#9CA3AF" fontSize="14" fontWeight="600" fontFamily="sans-serif">Railway Station</text>
          <text x="235" y="405" fill="#FF2A54" fontSize="18" fontWeight="bold" fontFamily="sans-serif" filter="drop-shadow(0 0 8px #FF2A54)">Telibandha</text>
          <text x="170" y="605" fill="#00F5D4" fontSize="14" fontWeight="600" fontFamily="sans-serif">Sector 15</text>
          <text x="290" y="755" fill="#9CA3AF" fontSize="14" fontWeight="600" fontFamily="sans-serif">HNLU</text>

          <g transform="translate(170, 440)">
            <circle cx="20" cy="20" r="25" fill="#FF2A54" fillOpacity="0.2" className="animate-[ping_2s_infinite]" />
            <circle cx="20" cy="20" r="12" fill="#FF2A54" />
            <path d="M20 8 L28 25 L12 25 Z" fill="#fff" transform="rotate(30 20 20)" />
          </g>
        </svg>

        <div className="absolute top-20 left-4 right-4 z-50 max-w-md mx-auto">
          <div className="glass-card rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-t border-t-[#00F5D4]/30">
            <div>
              <p className="text-white font-black text-lg">BRT {nextBus ? nextBus.route_number : '04'}</p>
              <p className="text-[#00F5D4] text-xs font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse"></span>
                {nextBus ? `Next Dep: ${nextBus.depTime}` : 'Arriving at Telibandha'}
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
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Day</span>
              <div className="flex gap-1 bg-[#0D1117] p-1 rounded-lg border border-[#30363D]">
                <button
                  onClick={() => setDay('weekday')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${day === 'weekday' ? 'bg-[#30363D] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Weekday
                </button>
                <button
                  onClick={() => setDay('weekend')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${day === 'weekend' ? 'bg-[#30363D] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Weekend
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
                          Departure Station
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-[#161B22] px-1.5 py-0.2 rounded border border-[#30363D]">
                          {fromDetail.tag}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white block truncate mt-0.5">
                        {fromDetail.name}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {fromDetail.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#00F5D4] pl-2 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase hidden sm:inline">Change</span>
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
                          Arrival Station
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-[#161B22] px-1.5 py-0.2 rounded border border-[#30363D]">
                          {toDetail.tag}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white block truncate mt-0.5">
                        {toDetail.name}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {toDetail.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#FF2A54] pl-2 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase hidden sm:inline">Change</span>
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
                title="Swap Origin and Destination"
              >
                <svg className="w-4 h-4 text-[#00F5D4] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>{matchingTrips.length} scheduled buses available</span>
              {matchingTrips.length > 0 && (
                <span className="text-[#00F5D4] font-bold">First at {matchingTrips[0].depTime}</span>
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
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Nearest Bus Radar</p>
            <p className="text-xs font-bold text-white">Sector 27 South Block Stop</p>
            <p className="text-[#00F5D4] text-[11px] font-medium">250m • 3 min walk</p>
          </div>
        </div>
      </div>

      {/* Live Route & Onboard Card */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-3xl p-5 relative shadow-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Service</p>
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
                showToast(nextState ? 'Onboard GPS Broadcast Active 🛰️' : 'Onboard Tracking Deactivated');
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-2 transition-all ${isOnboard ? 'border-[#00F5D4] bg-[#00F5D4]/20 text-white shadow-[0_0_12px_rgba(0,245,212,0.3)]' : 'border-[#30363D] bg-[#0D1117] text-gray-400 hover:text-white'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnboard ? 'bg-[#00F5D4] animate-ping' : 'bg-gray-500'}`}></div>
              <span>{isOnboard ? "I'm Inside This Bus" : "Onboard Mode"}</span>
            </button>
          </div>

          {/* Departure Summary */}
          {nextBus ? (
            <div className="flex justify-between items-end pb-4 border-b border-[#30363D] mb-4">
              <div>
                <p className="text-xs text-gray-400">Scheduled Departure</p>
                <p className="text-2xl font-black text-white">{nextBus.depTime}</p>
                <p className="text-xs text-[#00F5D4] mt-0.5">Est. Arrival: {nextBus.arrTime}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-[#FF2A54]/10 border border-[#FF2A54]/40 rounded-lg text-[#FF2A54] text-xs font-black animate-pulse">
                  {nextBus.duration} min ride
                </span>
                <p className="text-[10px] text-gray-400 mt-1">{nextBus.stopsCount} intermediate stops</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400 text-xs">
              No direct buses found between "{from}" and "{to}" on {day}s. Try swapping stops.
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
                <p className="text-xs font-bold text-white">Destination Wake-up Alarm</p>
                <p className="text-[10px] text-gray-400">Ring 1 stop before arriving</p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextAlarm = !alarmActive;
                setAlarmActive(nextAlarm);
                showToast(nextAlarm ? 'Alarm Set: 1 Stop Before Arrival 🔔' : 'Alarm Cancelled');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${alarmActive ? 'bg-[#FF2A54] text-white glow-red' : 'bg-[#161B22] border border-[#30363D] text-gray-300 hover:border-[#00F5D4]'}`}
            >
              {alarmActive ? 'Active' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Matching Buses List */}
      <div className="px-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>All Scheduled Departures ({matchingTrips.length})</span>
          <span className="text-[10px] text-gray-400 font-semibold lowercase">tap to expand stops</span>
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
                            NEXT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {trip.duration} mins • {trip.stopsCount} stops
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="text-xs font-bold text-[#00F5D4]">
                      {isExpanded ? 'Hide' : 'Stops'}
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
                              {st.stop_name}
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
      />
    </div>
  );
}
