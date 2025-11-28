export interface WLDeparture {
  departureTime: {
    timePlanned: string;
    timeReal: string;
    countdown: number;
  };
  vehicle?: {
    name: string;
    towards: string;
    direction: string;
    richtungsId: string;
    barrierFree: boolean;
    realtimeSupported: boolean;
    trafficjam: boolean;
    type: string;
    linetext: string;
  };
}
