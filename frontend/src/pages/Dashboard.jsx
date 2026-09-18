import { MapPin, Bus, Banknote } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-4 bg-white h-full">
      <header className="mb-6 mt-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">UrbanTransit</h1>
        <div className="flex items-center text-blue-900 font-medium">
          <MapPin size={18} className="mr-1" />
          <span>New Raipur, CG</span>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl shadow-sm text-left transition">
          <Bus size={32} className="mb-2" />
          <h2 className="text-lg font-bold mb-1">Nearest<br/>Bus Stop</h2>
          <p className="text-sm text-blue-100">Sector 27 - 2 mins walk</p>
        </button>
        <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl shadow-sm text-left transition">
          <Banknote size={32} className="mb-2" />
          <h2 className="text-lg font-bold mb-1">Fare<br/>Chart</h2>
          <p className="text-sm text-emerald-100">View rates, passes & zones</p>
        </button>
      </div>

      {/* Current Routes Preview */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Routes</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">Route 101</span>
                <span className="font-bold text-lg">HNLU to Railway Stn</span>
              </div>
              <MapPin size={24} className="text-blue-500" />
            </div>
            <p className="text-gray-600">4 stops • 6 mins away</p>
          </div>
          
          <div className="border-b pb-4">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">Route 102</span>
                <span className="font-bold text-lg">Sector 27 to DKS</span>
              </div>
              <MapPin size={24} className="text-emerald-500" />
            </div>
            <p className="text-gray-600">7 stops • 11 mins away</p>
          </div>
        </div>
      </div>
    </div>
  );
}
