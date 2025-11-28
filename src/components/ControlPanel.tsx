import React, { useState, useEffect, useRef } from 'react';
import { Station } from '@/types/Station';

interface ControlPanelProps {
  onStationSelect: (station: Station) => void;
  onFilterChange: (filter: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  selectedStation: Station | null;
  lastUpdated: Date | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onStationSelect,
  onFilterChange,
  onRefresh,
  isLoading,
  selectedStation,
  lastUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lineFilter, setLineFilter] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Stations loaded from public JSON
  const [stations, setStations] = useState<Station[]>([]);

  // Load stations from public/data/stations.json
  useEffect(() => {
    let cancelled = false;
    // Build URL using BASE_URL so it works on GH Pages subpaths
    // import.meta.env typing can vary; cast to any to be safe in TS
    const baseUrl = ((import.meta as any).env && (import.meta as any).env.BASE_URL) || '/';
    const stationsUrl = `${baseUrl}data/stations.json`;

    fetch(stationsUrl, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stations.json');
        return res.json();
      })
      .then((data: Station[]) => {
        if (!cancelled) setStations(data);
      })
      .catch((err) => {
        console.error('Error loading stations.json', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavs = localStorage.getItem('wienCountdownFavorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error("Error parsing favorites", e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  const updateFavorites = (newFavs: number[]) => {
    setFavorites(newFavs);
    localStorage.setItem('wienCountdownFavorites', JSON.stringify(newFavs));
  };

  const toggleFavorite = (e: React.MouseEvent, diva: number) => {
    e.stopPropagation(); // Prevent triggering station selection
    if (favorites.includes(diva)) {
      updateFavorites(favorites.filter(id => id !== diva));
    } else {
      updateFavorites([...favorites, diva]);
    }
  };

  // Logic to filter and sort stations
  const getFilteredStations = (term: string, currentFavorites: number[]) => {
    const trimmedTerm = term.trim().toLowerCase();
    
    // If search is empty, show only favorites
    if (!trimmedTerm) {
      return stations.filter(s => currentFavorites.includes(s.diva));
    }

    // Filter by name
    const matches = stations.filter(s => 
      s.name.toLowerCase().includes(trimmedTerm)
    );

    // Sort: Favorites first
    return matches.sort((a, b) => {
      const aFav = currentFavorites.includes(a.diva);
      const bFav = currentFavorites.includes(b.diva);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  };

  // Update suggestions when favorites change (if list is open)
  useEffect(() => {
    if (showSuggestions) {
      setSuggestions(getFilteredStations(searchTerm, favorites));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);


  // Handle click outside component to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = getFilteredStations(value, favorites);
    setSuggestions(filtered);
    
    // Show suggestions if we have matches OR if input is empty but we have favorites
    if (filtered.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    const filtered = getFilteredStations(searchTerm, favorites);
    if (filtered.length > 0) {
        setSuggestions(filtered);
        setShowSuggestions(true);
    }
  };

  const handleSelectStation = (station: Station) => {
    setSearchTerm(station.name);
    setShowSuggestions(false);
    onStationSelect(station);
    // Reset line filter when changing station
    setLineFilter('');
    onFilterChange('');
  };
  
  const handleLineFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLineFilter(value);
      onFilterChange(value);
  };

  const handleManualRefresh = () => {
    onRefresh();
  };

  return (
    <div className="bg-[#050505] p-4 md:p-6 border-2 border-zinc-700 mb-6 font-mono shadow-[3px_3px_0px_0px_rgba(50,50,50,0.5)]">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-end">
        
          {/* Station Search */}
        <div className="relative w-full md:w-1/2" ref={wrapperRef}>
          <label className="block text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2">
            STATION
          </label>
          <div className="relative group">
            <span className="absolute left-2.5 top-2.5 md:top-3.5 text-zinc-500 text-xs md:text-sm">{'>'}</span>
            <input
              type="text"
              className="w-full bg-zinc-900 text-zinc-100 border-b-2 border-zinc-700 pl-6 p-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-red-600 transition-colors placeholder-zinc-700 uppercase"
              placeholder="SEARCH STATION..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onClick={handleInputFocus}
            />
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-0 bg-zinc-900 border-x-2 border-b-2 border-zinc-700 max-h-64 overflow-y-auto shadow-lg">
              {suggestions.map((station) => {
                const isFav = favorites.includes(station.diva);
                return (
                  <div
                    key={station.diva}
                    className="w-full flex items-center justify-between px-3 py-3 md:py-4 text-xs md:text-base text-zinc-300 hover:bg-red-900/30 hover:text-white transition-colors border-b border-zinc-800 last:border-0 font-mono uppercase cursor-pointer group"
                    onClick={() => handleSelectStation(station)}
                  >
                    <span className={isFav ? 'text-white font-bold' : ''}>{station.name}</span>
                    <button 
                        onClick={(e) => toggleFavorite(e, station.diva)}
                        className="p-2 text-zinc-600 hover:text-yellow-500 focus:outline-none transition-colors"
                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFav ? (
                            // Filled Star
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-5 md:h-5 text-yellow-500">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // Outline Star
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-5 md:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.326 1.163l-4.304 3.753a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.304-3.753a.562.562 0 01.326-1.163l5.518.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Line Filter Input */}
        <div className="relative w-full md:w-1/4">
          <label className="block text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2">
            FILTER LINE
          </label>
           <div className="relative">
             <input
              type="text"
              className={`w-full bg-zinc-900 border-b-2 border-zinc-700 p-2 md:p-3 text-sm md:text-base focus:outline-none focus:border-red-600 transition-colors placeholder-zinc-700 uppercase
                  ${!selectedStation ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-100'}`}
              placeholder="E.G. U3, 13A"
              value={lineFilter}
              onChange={handleLineFilterChange}
              disabled={!selectedStation}
             />
           </div>
        </div>

        {/* Refresh Button */}
        <div className="w-full md:w-1/4 flex flex-col justify-end">
             {lastUpdated && (
                <span className="text-[10px] md:text-xs text-zinc-500 text-right mb-1 hidden md:block uppercase tracking-widest">
                    UPDATED: {lastUpdated.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
            )}
          <button
            onClick={handleManualRefresh}
            disabled={!selectedStation || isLoading}
            className={`w-full py-2 px-3 md:py-3 md:px-5 text-sm md:text-base font-bold uppercase tracking-widest transition-all border-2
              ${!selectedStation 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed' 
                : isLoading 
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-400 cursor-wait'
                  : 'bg-zinc-100 border-zinc-100 text-black active:translate-y-0.5'
              }`}
          >
            {isLoading ? 'LOADING...' : 'SEARCH'}
          </button>
        </div>
      </div>
       {/* Mobile timestamp */}
       {lastUpdated && (
            <div className="mt-2 text-right md:hidden">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">
                    UPDATED: {lastUpdated.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
            </div>
        )}
    </div>
  );
};

export default ControlPanel;