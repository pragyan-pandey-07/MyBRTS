import React, { useState } from 'react';

export default function BottomSheet({ sheet, setSheet, lang }) {
  if (!sheet) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#0D1117]/80 backdrop-blur-sm z-[60] transition-opacity duration-300" onClick={() => setSheet(null)}></div>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-card z-[70] rounded-t-[2.5rem] border-t border-[#00F5D4]/40 transform transition-transform duration-300 p-6 pb-28 shadow-[0_-15px_50px_rgba(0,245,212,0.15)] max-h-[85vh] overflow-y-auto">
        <div className="w-14 h-1.5 bg-[#30363D] rounded-full mx-auto mb-8 cursor-pointer hover:bg-gray-500 transition-colors" onClick={() => setSheet(null)}></div>
        
        {sheet === 'ticket' && (
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">Book Express Ticket</h3>
            <div className="flex justify-between items-end w-full mb-8 px-2 border-b border-[#30363D] pb-6 mt-6">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Total Fare</span>
              <span className="text-4xl font-black text-white tracking-tighter">₹30</span>
            </div>
            <button className="w-full bg-gradient-to-r from-[#00F5D4] to-[#00E676] text-[#0D1117] font-black py-4 rounded-2xl shadow-[0_5px_20px_rgba(0,245,212,0.4)] flex justify-center items-center gap-2 text-lg hover:brightness-110 active:scale-[0.98] transition-all">
              <span>Pay instantly with UPI</span>
            </button>
          </div>
        )}
        
        {sheet === 'fare' && (
          <div>
            <h3 className="text-2xl font-black text-white mb-6">Fare Matrix</h3>
            {/* Fare table HTML here */}
          </div>
        )}
      </div>
    </>
  );
}
