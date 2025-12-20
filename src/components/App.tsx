import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './ControlPanel';
import DepartureBoard from './DepartureBoard';
import { Station } from '@/types/Station';
import { DepartureInfo } from '@/types/DepartureInfo';
import { fetchStationData } from '@/services/WienerLinienService';
import { REFRESH_INTERVAL_MS } from '@/constants/Api';

const App: React.FC = () => {
  // Main States
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [lineFilter, setLineFilter] = useState<string>('');
  const [departures, setDepartures] = useState<DepartureInfo[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to load data
  const loadData = useCallback(async () => {
    if (!selectedStation) return;

    setIsLoading(true);
    setError(false);

    try {
      const data = await fetchStationData(selectedStation.diva);
      setDepartures(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStation]);

  // Load data automatically when station changes
  useEffect(() => {
    if (selectedStation) {
      loadData();
      
      // Set automatic refresh interval every REFRESH_INTERVAL_MS
      const intervalId = setInterval(loadData, REFRESH_INTERVAL_MS);
      return () => clearInterval(intervalId);
    } else {
        setDepartures([]);
        setLastUpdated(null);
    }
  }, [selectedStation, loadData]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 flex flex-col items-center py-3 px-3 md:py-6 md:px-6 font-mono selection:bg-red-900 selection:text-white">
      
      <header className="w-full max-w-3xl mb-4 md:mb-10 flex items-center justify-between border-b-2 border-zinc-800 pb-3 md:pb-6">
        <div className="flex items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-red-600 rounded-none flex items-center justify-center font-bold text-white text-xl md:text-4xl border-2 border-white/10 shadow-sm">
                WM
            </div>
            <div>
                <h1 className="text-lg md:text-4xl font-bold tracking-tighter text-white leading-none uppercase">Wiener Minutes</h1>
                <p className="text-[10px] md:text-sm text-zinc-500 font-bold tracking-widest mt-0.5 md:mt-1">REALTIME TRANSPORT MONITOR</p>
            </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-green-500 font-bold text-[10px] md:text-sm tracking-widest uppercase">Online</span>
            <div className="h-2 w-2 md:h-3 md:w-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
        </div>
      </header>

      <main className="w-full max-w-3xl flex flex-col gap-4 md:gap-6">
        
        {/* Control Panel */}
        <ControlPanel 
          onStationSelect={setSelectedStation}
          onFilterChange={setLineFilter}
          onRefresh={loadData}
          isLoading={isLoading}
          selectedStation={selectedStation}
          lastUpdated={lastUpdated}
        />

        {/* Departure Monitor */}
        <DepartureBoard 
          departures={departures}
          isLoading={isLoading}
          hasError={error}
          isInitial={!selectedStation}
          lineFilter={lineFilter}
        />

      </main>

      <footer className="mt-8 md:mt-12 text-center text-zinc-400 text-[10px] md:text-sm tracking-widest uppercase border-t border-zinc-900 pt-4 w-full max-w-3xl">
        <p className="mb-1">
          WIENER MINUTES // SYSTEM VERSION 1.0.1
        </p>
        <p className="text-zinc-500">MADE WITH <a href="https://digitales.wien.gv.at/open-data/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition-colors">WIENER LINIEN OPEN DATA</a></p>
        
        <div className="mt-4 flex justify-center">
            <a href="https://github.com/omartrj/wminutes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors group">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 group-hover:text-zinc-300 transition-colors">
                     <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>by omartrj</span>
            </a>
        </div>
      </footer>
    </div>
  );
};

export default App;