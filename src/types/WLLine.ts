import { WLDeparture } from './WLDeparture';

export interface WLLine {
  name: string;
  towards: string;
  direction: string;
  richtungsId: string;
  barrierFree: boolean;
  realtimeSupported: boolean;
  trafficjam: boolean;
  departures: {
    departure: WLDeparture[];
  };
  type: string; // e.g., "ptMetro", "ptBus", "ptTram", etc.
}
