import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LiveTracking from './pages/LiveTracking';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import BottomSheet from './components/BottomSheet';

function App() {
  const [lang, setLang] = useState('en');
  const [sheet, setSheet] = useState(null); // 'ticket', 'fare', or null
  const [view, setView] = useState('linear'); // 'linear' or 'map'

  return (
    <Router>
      <div className="antialiased min-h-screen relative text-slate-200">
        {/* Background decorative elements */}
        <div className="leaf-bg">
          <svg className="absolute top-20 left-10 opacity-5 text-[#00E676]" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16 5.9 16C11 16 14 13 16 10L17 8Z"/><path d="M14.3 11.7C12.3 13.7 9 15 5.9 16C5.9 16 8 10 17 8C17 8 16 10 14.3 11.7Z"/>
          </svg>
          <svg className="absolute bottom-40 right-10 opacity-[0.03] text-[#00F5D4]" width="120" height="120" viewBox="0 0 24 24" fill="currentColor" style={{transform: 'rotate(45deg)'}}>
            <path d="M17 8C8 10 5.9 16 5.9 16C11 16 14 13 16 10L17 8Z"/><path d="M14.3 11.7C12.3 13.7 9 15 5.9 16C5.9 16 8 10 17 8C17 8 16 10 14.3 11.7Z"/>
          </svg>
        </div>

        <Header lang={lang} setLang={setLang} />
        
        <main className="pb-24">
          <LiveTracking view={view} lang={lang} />
        </main>
        
        <BottomNav setSheet={setSheet} view={view} setView={setView} lang={lang} />
        
        <BottomSheet sheet={sheet} setSheet={setSheet} lang={lang} />
      </div>
    </Router>
  );
}

export default App;
