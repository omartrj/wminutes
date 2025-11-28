// API-related configuration constants
export const API_BASE_URL = "https://www.wienerlinien.at/ogd_realtime/monitor";
export const API_PARAMS = "activateTrafficInfo=stoerungkurz&activateTrafficInfo=stoerunglang&activateTrafficInfo=elevatorinfo";
export const PROXY_URL = "https://corsproxy.io/?";
export const REFRESH_INTERVAL_MS = 30000; // Don't go below 15 seconds!! (https://www.data.gv.at/datasets/cfba4373-a654-3e0b-80f8-348738169f95?locale=de)
