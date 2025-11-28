import { WLLine } from './WLLine';

export interface WLMonitor {
  locationStop: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      name: string;
      title: string;
      municipality: string;
      municipalityId: number;
      type: string;
      coordName: string;
    };
  };
  lines: WLLine[];
}
