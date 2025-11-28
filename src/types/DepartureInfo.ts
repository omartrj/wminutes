// Internal structures for data management in the app
export interface DepartureInfo {
  lineName: string;
  lineType: string;
  destination: string;
  countdown: number; // minutes
  nextCountdown?: number; // minutes until next arrival
  id: string; // unique ID for key
}
