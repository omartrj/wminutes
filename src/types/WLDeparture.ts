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
    platform?: string;
    richtungsId: string;
    barrierFree: boolean;
    foldingRamp?: boolean;
    realtimeSupported: boolean;
    trafficjam: boolean;
    type: string;
    linetext?: string;
    attributes?: Record<string, any>;
    linienId?: number;
  };
}
