import React, { useState, useMemo } from 'react';
import rawSchedules from '../data/schedules.json';

export default function ScheduleView({ lang = 'en' }) {
  const [day, setDay] = useState('weekday'); // 'weekday' or 'weekend'
  const [direction, setDirection] = useState('Railway Station to HNLU'); // or 'HNLU to Railway Station'
  const [selectedRoute, setSelectedRoute] = useState('ALL');
  const [expandedTripId, setExpandedTripId] = useState(null);

  // Available routes for chosen day & direction
  const filteredTrips = useMemo(() => {
    return rawSchedules.filter(t => {
      if (t.service_type !== day) return false;
      if (direction && !t.direction.toLowerCase().includes(direction.toLowerCase().split(' ')[0])) {
        // Match direction loosely
        if (direction.startsWith('HNLU') && !t.direction.startsWith('HNLU')) return false;
        if (direction.startsWith('Railway') && !t.direction.startsWith('Railway')) return false;
      }
      if (selectedRoute !== 'ALL' && t.route_number !== selectedRoute) return false;
      return true;
    });
  }, [day, direction, selectedRoute]);

  const availableRoutes = useMemo(() => {
    const rSet = new Set();
    rawSchedules.forEach(t => {
      if (t.service_type === day) {
        if (direction.startsWith('HNLU') && t.direction.startsWith('HNLU')) rSet.add(t.route_number);
        if (direction.startsWith('Railway') && t.direction.startsWith('Railway')) rSet.add(t.route_number);
      }
    });
    return Array.from(rSet).sort();
  }, [day, direction]);

  const toggleTrip = (id) => {
    setExpandedTripId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 pb-28 pt-2">
      {/* Title & Service Selector */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] glow-green"></span>
            Official Bus Timetable
          </h2>
          <p className="text-xs text-gray-400">Tatpar BRT Lite Service</p>
        </div>
        
        {/* Day toggle */}
        <div className="flex gap-1 bg-[#161B22] p-1 rounded-xl border border-[#30363D]">
          <button
            onClick={() => { setDay('weekday'); setSelectedRoute('ALL'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${day === 'weekday' ? 'bg-[#FF2A54] text-white glow-red' : 'text-gray-400 hover:text-white'}`}
          >
            Weekday
          </button>
          <button
            onClick={() => { setDay('weekend'); setSelectedRoute('ALL'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${day === 'weekend' ? 'bg-[#FF2A54] text-white glow-red' : 'text-gray-400 hover:text-white'}`}
          >
            Weekend
          </button>
        </div>
      </div>

      {/* Direction selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => { setDirection('Railway Station to HNLU'); setSelectedRoute('ALL'); }}
          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${direction.startsWith('Railway') ? 'border-[#00F5D4] bg-[#00F5D4]/10 text-white shadow-[0_0_15px_rgba(0,245,212,0.15)]' : 'border-[#30363D] bg-[#161B22]/70 text-gray-400 hover:text-white'}`}
        >
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Up Route</span>
          <span>Railway Stn ➔ HNLU</span>
        </button>
        <button
          onClick={() => { setDirection('HNLU to Railway Station'); setSelectedRoute('ALL'); }}
          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${direction.startsWith('HNLU') ? 'border-[#00F5D4] bg-[#00F5D4]/10 text-white shadow-[0_0_15px_rgba(0,245,212,0.15)]' : 'border-[#30363D] bg-[#161B22]/70 text-gray-400 hover:text-white'}`}
        >
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Down Route</span>
          <span>HNLU ➔ Railway Stn</span>
        </button>
      </div>

      {/* Route Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <button
          onClick={() => setSelectedRoute('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${selectedRoute === 'ALL' ? 'bg-[#00F5D4] text-[#0D1117] border-[#00F5D4]' : 'bg-[#161B22] text-gray-400 border-[#30363D] hover:text-white'}`}
        >
          All Routes ({filteredTrips.length})
        </button>
        {availableRoutes.map(rNum => (
          <button
            key={rNum}
            onClick={() => setSelectedRoute(rNum)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${selectedRoute === rNum ? 'bg-[#00F5D4] text-[#0D1117] border-[#00F5D4]' : 'bg-[#161B22] text-gray-400 border-[#30363D] hover:text-white'}`}
          >
            Route {rNum}
          </button>
        ))}
      </div>

      {/* Trips list */}
      <div className="flex flex-col gap-3">
        {filteredTrips.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-gray-400">
            No scheduled departures found for this filter.
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const isExpanded = expandedTripId === trip.id;
            return (
              <div
                key={trip.id}
                className="glass-card rounded-2xl border border-[#30363D] overflow-hidden transition-all hover:border-[#00F5D4]/40"
              >
                {/* Trip Card Header */}
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleTrip(trip.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col items-center justify-center font-mono">
                      <span className="text-[9px] text-[#00F5D4] font-bold">BRT</span>
                      <span className="text-xs font-black text-white">{trip.route_number}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">{trip.departure_time}</span>
                        <span className="text-gray-500 text-xs">➔</span>
                        <span className="text-sm font-bold text-gray-300">{trip.arrival_time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {trip.origin} to {trip.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#00F5D4] block">{trip.duration_mins}m</span>
                      <span className="text-[10px] text-gray-500">{trip.stops?.length || 0} stops</span>
                    </div>
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

                {/* Expanded Stops Timeline */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 bg-[#0D1117]/60 border-t border-[#30363D]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Complete Stop Timetable
                    </p>
                    <div className="relative pl-5 border-l-2 border-[#30363D] ml-2 space-y-3">
                      {trip.stops.map((stop, sIdx) => {
                        const isFirst = sIdx === 0;
                        const isLast = sIdx === trip.stops.length - 1;
                        return (
                          <div key={sIdx} className="relative flex items-center justify-between text-xs">
                            {/* Bullet */}
                            <div
                              className={`absolute -left-[27px] w-3 h-3 rounded-full border-2 ${isFirst ? 'bg-[#00F5D4] border-[#0D1117] glow-green' : isLast ? 'bg-[#FF2A54] border-[#0D1117] glow-red' : 'bg-[#161B22] border-gray-600'}`}
                            ></div>
                            <span className={`font-medium ${isFirst || isLast ? 'text-white font-bold' : 'text-gray-300'}`}>
                              {stop.stop_name}
                            </span>
                            <span className="font-mono text-[11px] text-[#00F5D4]">
                              {stop.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
