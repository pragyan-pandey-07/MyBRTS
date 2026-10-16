import React from 'react';

export default function BottomSheet({ sheet, setSheet, lang = 'en' }) {
  if (!sheet) return null;

  const handleClose = () => {
    setSheet(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[#0D1117]/80 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={handleClose}
      ></div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-card z-[70] rounded-t-[2.5rem] border-t border-[#00F5D4]/40 transform transition-transform duration-300 p-6 pb-28 shadow-[0_-15px_50px_rgba(0,245,212,0.15)] max-h-[85vh] overflow-y-auto">
        {/* Drag Handle */}
        <div
          className="w-14 h-1.5 bg-[#30363D] rounded-full mx-auto mb-6 cursor-pointer hover:bg-gray-500 transition-colors"
          onClick={handleClose}
        ></div>

        {/* Fare Matrix Modal */}
        {sheet === 'fare' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#161B22] border border-[#30363D] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Official Fare Matrix</h3>
                <p className="text-xs text-gray-400">Standard BRTS Tariff</p>
              </div>
            </div>

            <div className="w-full bg-[#0D1117] rounded-2xl border border-[#30363D] overflow-hidden shadow-xl">
              <table className="w-full text-xs text-left text-gray-300">
                <thead className="text-[10px] text-[#00F5D4] uppercase bg-[#161B22] border-b border-[#30363D] tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-bold">Route Segment</th>
                    <th className="px-4 py-3 text-right font-bold">Fare (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/50">
                  <tr className="hover:bg-[#161B22] transition-colors">
                    <td className="px-4 py-3 font-medium">Railway Station <span className="text-gray-500 mx-1">➔</span> Telibandha</td>
                    <td className="px-4 py-3 text-right font-black text-white">₹15</td>
                  </tr>
                  <tr className="hover:bg-[#161B22] transition-colors">
                    <td className="px-4 py-3 font-medium">Railway Station <span className="text-gray-500 mx-1">➔</span> Sector 15</td>
                    <td className="px-4 py-3 text-right font-black text-white">₹20</td>
                  </tr>
                  <tr className="hover:bg-[#161B22] transition-colors">
                    <td className="px-4 py-3 font-medium">Railway Station <span className="text-gray-500 mx-1">➔</span> CBD</td>
                    <td className="px-4 py-3 text-right font-black text-white">₹25</td>
                  </tr>
                  <tr className="hover:bg-[#161B22] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#00F5D4]">Railway Station <span className="text-gray-500 mx-1">➔</span> HNLU</td>
                    <td className="px-4 py-3 text-right font-black text-[#00F5D4]">₹30</td>
                  </tr>
                  <tr className="bg-[#161B22]/50">
                    <td className="px-4 py-3 text-gray-400 italic text-[11px]">
                      Inter-Sector (Within Nava Raipur)
                    </td>
                    <td className="px-4 py-3 text-right font-black text-white">₹10</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-4">
              Tickets are issued by conductors onboard buses or at designated BRTS station counters.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
