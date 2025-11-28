import React, { useMemo } from 'react';
import { DepartureInfo } from '@/types/DepartureInfo';
import { LINE_COLORS, TRANSPORT_TYPE_COLORS, DEFAULT_LINE_COLOR } from '@/constants/Colors';

interface DepartureBoardProps {
  departures: DepartureInfo[];
  isLoading: boolean;
  hasError: boolean;
  isInitial: boolean;
  lineFilter: string;
}

// Helper function to get line color class
const getLineColorClass = (lineName: string, type: string): string => {
  const name = lineName.toUpperCase().replace(/\s/g, '');
  
  if (LINE_COLORS[name]) return LINE_COLORS[name];
  if (TRANSPORT_TYPE_COLORS[type]) return TRANSPORT_TYPE_COLORS[type];
  
  return DEFAULT_LINE_COLOR;
};

const DepartureBoard: React.FC<DepartureBoardProps> = ({ 
  departures, 
  isLoading, 
  hasError, 
  isInitial,
  lineFilter 
}) => {
  
  // Client-side filter for line (optional)
  const filteredDepartures = useMemo(() => departures.filter(dep => 
    lineFilter 
      ? dep.lineName.toLowerCase().includes(lineFilter.toLowerCase()) // Loose match for text input
      : true
  ), [departures, lineFilter]);

  if (isInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 bg-black font-mono">
        <div className="text-center space-y-1">
          <p className="text-zinc-500 text-lg tracking-widest uppercase">[ SYSTEM STANDBY ]</p>
          <p className="text-zinc-700 text-xs">SELECT STATION TO INITIALIZE</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-red-900 bg-black font-mono">
        <div className="text-center text-red-600">
          <p className="font-bold text-lg mb-1 uppercase tracking-widest">CONNECTION ERROR</p>
          <p className="text-xs">DATA STREAM INTERRUPTED.</p>
        </div>
      </div>
    );
  }

  if (isLoading && departures.length === 0) {
    return (
      <div className="space-y-1.5 font-mono">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-zinc-900 border-l-2 border-zinc-800 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (filteredDepartures.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-zinc-800 bg-black font-mono">
        <p className="text-zinc-600 uppercase text-sm">NO DEPARTURES FOUND.</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-zinc-800 bg-black font-mono shadow-xl">
      {/* Board Header */}
      <div className="flex bg-zinc-900 border-b-2 border-zinc-800 p-2 text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">
        <div className="w-12 md:w-16 text-center">LINE</div>
        <div className="flex-grow flex justify-between px-2 md:px-3 border-l border-zinc-700 ml-1">
            <span>DESTINATION</span>
            <span>TIME</span>
        </div>
      </div>

      {/* Departures List */}
      <div className="divide-y divide-zinc-800/50">
        {filteredDepartures.map((dep) => (
          <div 
            key={dep.id} 
            className="flex flex-row p-2 items-center hover:bg-zinc-900/30 transition-colors group"
          >
            {/* Line Badge */}
            <div className="w-12 md:w-16 flex-shrink-0 flex justify-center items-center">
              <span className={`${getLineColorClass(dep.lineName, dep.lineType)}
                font-bold px-1 py-0.5 text-base md:text-lg min-w-[36px] md:min-w-[42px] text-center
                border border-black/20 shadow-sm leading-none
              `}>
                {dep.lineName}
              </span>
            </div>

            {/* Destination and Time Container */}
            <div className="flex-grow flex items-center justify-between pl-2 md:pl-3 border-l border-zinc-800 border-dashed min-w-0 h-full py-1 ml-1">                
                {/* Destination */}
                <div className="flex-1 min-w-0 pr-2">
                    <div className="truncate font-bold text-zinc-300 text-base md:text-lg leading-tight group-hover:text-white transition-colors uppercase tracking-tight block w-full">
                        {dep.destination}
                    </div>
                </div>
                
                {/* Time */}
                <div className="flex-shrink-0 text-right font-mono flex flex-col items-end justify-center whitespace-nowrap pl-2 min-w-[80px] md:min-w-[90px]">
                    <div className="flex items-center justify-end w-full">
                        <div className="hidden md:block border-b border-zinc-800 border-dotted w-8 lg:w-16 mr-2 opacity-30"></div>
                        {dep.countdown <= 0 ? (
                            <span className="text-red-500 font-bold animate-pulse text-sm md:text-base border border-red-500 px-1 py-px inline-block leading-none">
                                NOW
                            </span>
                        ) : (
                            <span className="text-zinc-400 font-bold text-xl md:text-2xl leading-none">
                                {dep.countdown}<span className="text-xs md:text-sm text-zinc-600 ml-1 align-baseline">MIN</span>
                            </span>
                        )}
                    </div>
                    {/* Next Arrival */}
                    {dep.nextCountdown !== undefined && (
                        <span className="text-[11px] md:text-xs text-zinc-600 uppercase mt-0.5 font-bold leading-none">
                            NEXT IN {dep.nextCountdown} MIN
                        </span>
                    )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartureBoard;