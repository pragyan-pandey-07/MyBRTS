import { MapPin, Search } from 'lucide-react';

export default function Schedule() {
  const scheduleData = [
    { id: 1, route: '101', dest: 'Railway Station', time: '5 min', absoluteTime: '07:33 AM', stop: 'Sector 27' },
    { id: 2, route: '102', dest: 'DKS Bhawan', time: '11 min', absoluteTime: '08:25 AM', stop: 'Sector 29' },
    { id: 3, route: '101', dest: 'Railway Station', time: '17 min', absoluteTime: '09:03 AM', stop: 'Sector 27' },
    { id: 4, route: '101', dest: 'Railway Station', time: '23 min', absoluteTime: '09:33 AM', stop: 'Sector 27' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#102a36] text-white">
      {/* Header */}
      <header className="p-4 bg-[#0d6e5d] text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={24} />
            <h1 className="text-2xl font-bold">New Raipur Hub</h1>
          </div>
        </div>
        
        {/* Next Bus Alert */}
        <div className="bg-[#24587c] p-4 rounded-lg flex flex-col shadow-md">
          <span className="text-sm font-bold tracking-wider text-blue-200 mb-2">NEXT BUS ARRIVES IN 5 MIN</span>
          <div className="flex justify-between items-end">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">101</span>
              <span className="text-lg text-blue-100 mb-1">Railway Stn</span>
            </div>
            <span className="text-sm text-blue-200">Est. 07:33 AM</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-[#163645]">
        <button className="flex-1 py-3 text-center text-gray-400 font-medium">Details</button>
        <button className="flex-1 py-3 text-center text-white border-b-2 border-white font-medium">Schedule</button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Upcoming Departures</h2>
        
        <div className="space-y-0">
          {scheduleData.map((item, idx) => (
            <div key={item.id} className={`flex justify-between py-4 ${idx !== scheduleData.length - 1 ? 'border-b border-gray-700' : ''}`}>
              <div>
                <div className="text-lg font-bold text-green-400 mb-1">[{item.route}]</div>
                <div className="text-gray-300">{item.dest} - {item.stop}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold mb-1">
                  <span className={item.time.includes('5') ? 'text-green-400' : item.time.includes('17') || item.time.includes('23') ? 'text-orange-400' : 'text-green-400'}>
                    {item.time}
                  </span>
                  <span className="text-gray-400 mx-2">|</span> 
                  {item.absoluteTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
