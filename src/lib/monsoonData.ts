/**
 * Monsoon Impact Predictor — Innovation 12
 * Hardcoded monthly flood risk data for Odisha regions.
 * Shows "This zone is typically inaccessible July-September" warnings.
 */

export interface MonsoonZone {
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  /** 1-12 month numbers where risk is HIGH */
  highRiskMonths: number[];
  /** 1-12 month numbers where risk is MODERATE */
  moderateRiskMonths: number[];
  severity: 'critical' | 'high' | 'moderate';
  description: string;
}

export const MONSOON_ZONES: MonsoonZone[] = [
  // Bhubaneswar / Cuttack
  { name: 'Mahanadi River Basin - Cuttack', lat: 20.4625, lng: 85.8830, radiusKm: 5, highRiskMonths: [7, 8, 9], moderateRiskMonths: [6, 10], severity: 'critical', description: 'Major flooding zone. Annual Mahanadi overflow affects low-lying areas. Businesses typically inaccessible July-September.' },
  { name: 'Kuakhai River Delta - BBSR East', lat: 20.2780, lng: 85.8640, radiusKm: 3, highRiskMonths: [7, 8], moderateRiskMonths: [6, 9], severity: 'high', description: 'Kuakhai river embankment breaches during heavy monsoon. Waterlogging lasts 2-4 weeks.' },
  { name: 'Daya River Flood Plain - Pipili Road', lat: 20.1600, lng: 85.8300, radiusKm: 4, highRiskMonths: [7, 8, 9], moderateRiskMonths: [6], severity: 'high', description: 'Daya river floods block Pipili-Puri road annually. Commercial properties face extended closures.' },
  // Berhampur
  { name: 'Rushikulya Basin - Berhampur South', lat: 19.2800, lng: 84.7800, radiusKm: 4, highRiskMonths: [7, 8, 9], moderateRiskMonths: [10, 11], severity: 'critical', description: 'Cyclone-prone + river flooding. Titli (2018) and Fani (2019) devastated this area.' },
  // Sambalpur
  { name: 'Hirakud Dam Downstream - Sambalpur', lat: 21.4500, lng: 83.9700, radiusKm: 5, highRiskMonths: [8, 9], moderateRiskMonths: [7, 10], severity: 'high', description: 'Hirakud Dam water release during peak monsoon causes downstream flooding.' },
  // Raipur
  { name: 'Kharun River Basin - Raipur East', lat: 21.2500, lng: 81.6450, radiusKm: 3, highRiskMonths: [7, 8], moderateRiskMonths: [9], severity: 'moderate', description: 'Kharun river waterlogging in eastern Raipur. Moderate risk, usually drains within 1 week.' },
  // Coastal
  { name: 'Puri Coastal Strip', lat: 19.8135, lng: 85.8312, radiusKm: 3, highRiskMonths: [6, 7, 8, 9, 10], moderateRiskMonths: [5, 11], severity: 'critical', description: 'Cyclone zone. NDMA high-risk coastal area. Severe wind + surge damage risk during monsoon.' },
  { name: 'Chilika Lake Periphery', lat: 19.7200, lng: 85.3200, radiusKm: 6, highRiskMonths: [7, 8, 9], moderateRiskMonths: [6, 10], severity: 'moderate', description: 'Lake overflow zone. Peripheral commercial areas face seasonal waterlogging.' },
];

export function getCurrentMonthRisk(zone: MonsoonZone): 'none' | 'moderate' | 'high' {
  const month = new Date().getMonth() + 1;
  if (zone.highRiskMonths.includes(month)) return 'high';
  if (zone.moderateRiskMonths.includes(month)) return 'moderate';
  return 'none';
}

export function getMonsoonWarning(lat: number, lng: number, radiusKm: number = 5): MonsoonZone | null {
  for (const zone of MONSOON_ZONES) {
    const dist = haversineKm(lat, lng, zone.lat, zone.lng);
    if (dist <= zone.radiusKm + radiusKm) {
      return zone;
    }
  }
  return null;
}

export function getMonthName(month: number): string {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1] || '';
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
