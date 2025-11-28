import { API_BASE_URL, API_PARAMS, PROXY_URL } from '@/constants/Api';
import { WLMonitorResponse } from '@/types/WLMonitorResponse';
import { DepartureInfo } from '@/types/DepartureInfo';

/**
 * Retreives real-time data for a specific station (diva ID).
 */
export const fetchStationData = async (divaId: number): Promise<DepartureInfo[]> => {
  // Construct query
  const queryString = `diva=${divaId}&${API_PARAMS}`;
  const targetUrl = `${API_BASE_URL}?${queryString}`;
  
  // Use proxy to avoid CORS
  const finalUrl = `${PROXY_URL}${encodeURIComponent(targetUrl)}`;

  try {
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json: WLMonitorResponse = await response.json();

    if (!json.data || !json.data.monitors) {
      // No monitor data available
      return [];
    }

    // Parsing and flattening complex response into a simple list
    const allDepartures: DepartureInfo[] = [];

    json.data.monitors.forEach((monitor, monitorIndex) => {
      // Consider only the first line ([0]) within each monitor
      if (monitor.lines && monitor.lines.length > 0) {
        const line = monitor.lines[0];
        
        // Take the first departure (departure[0]) for the main display
        if (line.departures && line.departures.departure && line.departures.departure.length > 0) {
           const dep = line.departures.departure[0];
           
           // Check if there is a next departure (departure[1])
           let nextCountdown: number | undefined = undefined;
           if (line.departures.departure.length > 1) {
             const nextDep = line.departures.departure[1];
             if (nextDep && nextDep.departureTime) {
               nextCountdown = nextDep.departureTime.countdown;
             }
           }

           if (dep && dep.departureTime) {
              allDepartures.push({
                id: `${monitorIndex}-${line.name}-${Date.now()}`,
                lineName: line.name,
                lineType: line.type,
                destination: line.towards,
                countdown: dep.departureTime.countdown,
                nextCountdown: nextCountdown
              });
           }
        }
      }
    });

    // Sort by countdown time ascending (smallest/NOW first)
    allDepartures.sort((a, b) => a.countdown - b.countdown);

    return allDepartures;

  } catch (error) {
    console.error("Error fetching Wiener Linien data:", error);
    throw error;
  }
};
