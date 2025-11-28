// Line Colors Mapping
export const LINE_COLORS: { [key: string]: string } = {
  'U1': 'bg-[#E20A16] text-white',
  'U2': 'bg-[#A762A3] text-white',
  'U3': 'bg-[#EE7D00] text-white',
  'U4': 'bg-[#009540] text-white',
  'U5': 'bg-[#40E0D0] text-white',
  'U6': 'bg-[#9D6930] text-white',
};

// Transport Type Colors Mapping
export const TRANSPORT_TYPE_COLORS: { [key: string]: string } = {
  // Metro (Fallback if specific line color not found)
  'ptMetro': 'bg-zinc-800 text-white',
  
  // Tram - Dark Red
  'ptTram': 'bg-[#8B0000] text-white',
  
  // Bus - Dark Blue
  'ptBus': 'bg-[#002F6C] text-white',
  'ptBusCity': 'bg-[#002F6C] text-white',
  'ptBusNight': 'bg-[#002F6C] text-white',
  'Pt_RufbusNacht': 'bg-[#002F6C] text-white',
  'pt_RufbusTag': 'bg-[#002F6C] text-white',
  
  // Train (S-Bahn) - Blue
  'ptTrainS': 'bg-[#0080C9] text-white',
};

export const DEFAULT_LINE_COLOR = 'bg-zinc-700 text-white';
