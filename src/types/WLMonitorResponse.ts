import { WLMonitor } from './WLMonitor';

// Raw mapping of the Wiener Linien API response
export interface WLMonitorResponse {
  data: {
    monitors: WLMonitor[];
  };
  message?: {
    value: string;
  };
}
