/* ──────────────────────────────────────────────────────────────
   India-specific intelligence layers — seed data
   Covers 5 launch cities: Bhubaneswar, Cuttack, Berhampur, Sambalpur, Raipur
   ────────────────────────────────────────────────────────────── */

// ── Festival Calendar ────────────────────────────────────────
export interface FestivalZone {
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusM: number;
  /** Foot-traffic multiplier during the festival window */
  multiplier: number;
  /** Months when the multiplier applies (1-indexed) */
  months: number[];
}

export const festivalCalendar: FestivalZone[] = [
  // Odisha — Rath Yatra (June–July)
  { name: 'Rath Yatra — Grand Road, Puri', city: 'Puri', lat: 19.8050, lng: 85.8180, radiusM: 1200, multiplier: 8, months: [6, 7] },
  { name: 'Rath Yatra spill — Bhubaneswar Station Rd', city: 'Bhubaneswar', lat: 20.2705, lng: 85.8400, radiusM: 800, multiplier: 3, months: [6, 7] },

  // Durga Puja (October)
  { name: 'Durga Puja — Rasulgarh, BBSR', city: 'Bhubaneswar', lat: 20.2862, lng: 85.8530, radiusM: 600, multiplier: 5, months: [10] },
  { name: 'Durga Puja — Saheed Nagar, BBSR', city: 'Bhubaneswar', lat: 20.2890, lng: 85.8440, radiusM: 500, multiplier: 4, months: [10] },
  { name: 'Durga Puja — Choudhury Bazar, Cuttack', city: 'Cuttack', lat: 20.4625, lng: 85.8830, radiusM: 700, multiplier: 6, months: [10] },
  { name: 'Durga Puja — Buxi Bazar, Cuttack', city: 'Cuttack', lat: 20.4680, lng: 85.8900, radiusM: 500, multiplier: 5, months: [10] },

  // Diwali (October–November)
  { name: 'Diwali — Unit 1 Market, BBSR', city: 'Bhubaneswar', lat: 20.2685, lng: 85.8340, radiusM: 500, multiplier: 4, months: [10, 11] },
  { name: 'Diwali — Gol Bazar, Berhampur', city: 'Berhampur', lat: 19.3150, lng: 84.7940, radiusM: 600, multiplier: 3, months: [10, 11] },
  { name: 'Diwali — Pandri Market, Raipur', city: 'Raipur', lat: 21.2370, lng: 81.6350, radiusM: 700, multiplier: 4, months: [10, 11] },

  // Makar Mela (January)
  { name: 'Makar Mela — Chandrabhaga Beach, Konark', city: 'Konark', lat: 19.8876, lng: 86.1114, radiusM: 1000, multiplier: 6, months: [1] },

  // Nuakhai (August–September) — Sambalpur
  { name: 'Nuakhai — Town Hall, Sambalpur', city: 'Sambalpur', lat: 21.4669, lng: 83.9756, radiusM: 800, multiplier: 4, months: [8, 9] },

  // Rajim Kumbh (February–March) — Raipur
  { name: 'Rajim Kumbh Mela — Rajim, Raipur', city: 'Raipur', lat: 20.9640, lng: 81.8790, radiusM: 1500, multiplier: 5, months: [2, 3] },
];

// ── Pilgrimage Corridors ─────────────────────────────────────
export interface PilgrimageCorridor {
  name: string;
  /** Ordered lat/lng waypoints forming the pilgrimage route */
  coordinates: [number, number][];
  /** Annual visitor count (approximate) */
  visitorsPerYear: string;
}

export const pilgrimageCorridors: PilgrimageCorridor[] = [
  {
    name: 'Puri–Bhubaneswar–Konark Triangle',
    visitorsPerYear: '30M+',
    coordinates: [
      [85.8315, 19.8133],  // Jagannath Temple, Puri
      [85.8400, 19.8800],  // NH316 midway
      [85.8400, 20.2350],  // Dhauli Hills
      [85.8190, 20.2419],  // Lingaraj Temple, BBSR
      [85.8460, 20.2710],  // BBSR city center
      [86.0250, 20.1200],  // NH route to Konark
      [86.0946, 19.9016],  // Konark Sun Temple
      [86.1114, 19.8876],  // Chandrabhaga Beach
      [85.9500, 19.8500],  // Coastal route back
      [85.8315, 19.8133],  // Back to Puri
    ],
  },
  {
    name: 'Samaleswari Temple Corridor — Sambalpur',
    visitorsPerYear: '2M+',
    coordinates: [
      [83.9756, 21.4669],  // Sambalpur town center
      [83.9680, 21.4710],  // Samaleswari Temple
      [83.9800, 21.4750],  // Hirakud Dam road
      [83.8700, 21.5200],  // Hirakud Dam
    ],
  },
];

// ── Key Temple Points (for markers) ─────────────────────────
export interface TemplePoint {
  name: string;
  lat: number;
  lng: number;
  visitorsPerYear: string;
}

export const templePoints: TemplePoint[] = [
  { name: 'Jagannath Temple, Puri', lat: 19.8133, lng: 85.8315, visitorsPerYear: '15M+' },
  { name: 'Lingaraj Temple, Bhubaneswar', lat: 20.2419, lng: 85.8190, visitorsPerYear: '5M+' },
  { name: 'Konark Sun Temple', lat: 19.9016, lng: 86.0946, visitorsPerYear: '3M+' },
  { name: 'Dhauli Shanti Stupa', lat: 20.2350, lng: 85.8400, visitorsPerYear: '1.5M+' },
  { name: 'Samaleswari Temple, Sambalpur', lat: 21.4710, lng: 83.9680, visitorsPerYear: '2M+' },
  { name: 'Mahamaya Temple, Raipur', lat: 21.2514, lng: 81.6296, visitorsPerYear: '1M+' },
];

// ── Flood Risk Zones ─────────────────────────────────────────
export interface FloodRiskZone {
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusM: number;
  riskLevel: 'high' | 'medium';
  /** Typical months when flooding occurs */
  floodMonths: number[];
}

export const floodRiskZones: FloodRiskZone[] = [
  // Mahanadi basin — Cuttack (most flood-prone city in Odisha)
  { name: 'Mahanadi Riverfront — Cuttack', city: 'Cuttack', lat: 20.4625, lng: 85.8830, radiusM: 1200, riskLevel: 'high', floodMonths: [7, 8, 9] },
  { name: 'Kathajodi Floodplain — Cuttack', city: 'Cuttack', lat: 20.4520, lng: 85.8650, radiusM: 800, riskLevel: 'high', floodMonths: [7, 8, 9] },
  { name: 'Jobra Barrage Area — Cuttack', city: 'Cuttack', lat: 20.4780, lng: 85.9050, radiusM: 600, riskLevel: 'medium', floodMonths: [7, 8, 9] },

  // Bhubaneswar low-lying areas
  { name: 'Kuakhai River Lowlands — BBSR', city: 'Bhubaneswar', lat: 20.2550, lng: 85.8700, radiusM: 800, riskLevel: 'medium', floodMonths: [7, 8, 9] },
  { name: 'Daya River Zone — BBSR', city: 'Bhubaneswar', lat: 20.2200, lng: 85.8300, radiusM: 700, riskLevel: 'medium', floodMonths: [7, 8, 9] },

  // Berhampur — coastal storm surge + Rushikulya river
  { name: 'Rushikulya Floodplain — Berhampur', city: 'Berhampur', lat: 19.3250, lng: 84.8100, radiusM: 900, riskLevel: 'high', floodMonths: [7, 8, 9, 10] },
  { name: 'Coastal Storm Surge Zone — Berhampur', city: 'Berhampur', lat: 19.2800, lng: 84.8400, radiusM: 1500, riskLevel: 'medium', floodMonths: [10, 11] },

  // Sambalpur — Hirakud Dam downstream
  { name: 'Mahanadi Downstream — Sambalpur', city: 'Sambalpur', lat: 21.4550, lng: 83.9700, radiusM: 800, riskLevel: 'medium', floodMonths: [7, 8, 9] },

  // Raipur — Kharun River lowlands
  { name: 'Kharun River Lowlands — Raipur', city: 'Raipur', lat: 21.2500, lng: 81.6150, radiusM: 700, riskLevel: 'medium', floodMonths: [7, 8, 9] },
];

// ── Haat (Weekly) Markets ────────────────────────────────────
export interface HaatMarket {
  name: string;
  city: string;
  lat: number;
  lng: number;
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
  dayOfWeek: number;
}

const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export { dayLabel };

export const haatMarkets: HaatMarket[] = [
  // Bhubaneswar
  { name: 'Unit-1 Haat', city: 'Bhubaneswar', lat: 20.2680, lng: 85.8330, dayOfWeek: 0 },
  { name: 'Rasulgarh Weekly Bazaar', city: 'Bhubaneswar', lat: 20.2860, lng: 85.8530, dayOfWeek: 3 },
  { name: 'Khandagiri Haat', city: 'Bhubaneswar', lat: 20.2555, lng: 85.7870, dayOfWeek: 5 },
  { name: 'Nayapalli Haat Bazaar', city: 'Bhubaneswar', lat: 20.2960, lng: 85.8060, dayOfWeek: 2 },

  // Cuttack
  { name: 'Choudhury Bazar Haat', city: 'Cuttack', lat: 20.4630, lng: 85.8840, dayOfWeek: 1 },
  { name: 'Madhupatna Haat', city: 'Cuttack', lat: 20.4740, lng: 85.8700, dayOfWeek: 4 },
  { name: 'Choudwar Weekly Market', city: 'Cuttack', lat: 20.4920, lng: 85.8150, dayOfWeek: 6 },

  // Berhampur
  { name: 'Gol Bazar Haat', city: 'Berhampur', lat: 19.3150, lng: 84.7940, dayOfWeek: 0 },
  { name: 'Bada Bazar Haat', city: 'Berhampur', lat: 19.3100, lng: 84.7870, dayOfWeek: 3 },
  { name: 'Gopalpur Road Haat', city: 'Berhampur', lat: 19.2900, lng: 84.8100, dayOfWeek: 5 },

  // Sambalpur
  { name: 'Dhanupali Haat', city: 'Sambalpur', lat: 21.4550, lng: 83.9650, dayOfWeek: 2 },
  { name: 'Khetrajpur Haat', city: 'Sambalpur', lat: 21.4590, lng: 83.9800, dayOfWeek: 6 },
  { name: 'Ainthapali Weekly Market', city: 'Sambalpur', lat: 21.4720, lng: 83.9870, dayOfWeek: 4 },

  // Raipur
  { name: 'Pandri Haat Bazaar', city: 'Raipur', lat: 21.2370, lng: 81.6350, dayOfWeek: 0 },
  { name: 'Telibandha Haat', city: 'Raipur', lat: 21.2410, lng: 81.6530, dayOfWeek: 3 },
  { name: 'Gudhiyari Weekly Market', city: 'Raipur', lat: 21.2200, lng: 81.6000, dayOfWeek: 1 },
  { name: 'Tatibandh Haat', city: 'Raipur', lat: 21.2650, lng: 81.6100, dayOfWeek: 5 },
];

// ── Auto Rickshaw Stands ─────────────────────────────────────
export interface AutoStand {
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export const autoStands: AutoStand[] = [
  // Bhubaneswar
  { name: 'Master Canteen Auto Stand', city: 'Bhubaneswar', lat: 20.2720, lng: 85.8390 },
  { name: 'Vani Vihar Auto Stand', city: 'Bhubaneswar', lat: 20.2980, lng: 85.8400 },
  { name: 'Kalpana Square Auto Stand', city: 'Bhubaneswar', lat: 20.2870, lng: 85.8210 },
  { name: 'Jaydev Vihar Auto Stand', city: 'Bhubaneswar', lat: 20.2950, lng: 85.8170 },
  { name: 'Rasulgarh Auto Stand', city: 'Bhubaneswar', lat: 20.2862, lng: 85.8530 },
  { name: 'Baramunda Bus Stand Autos', city: 'Bhubaneswar', lat: 20.2750, lng: 85.8000 },
  { name: 'Patia Auto Stand', city: 'Bhubaneswar', lat: 20.3530, lng: 85.8190 },

  // Cuttack
  { name: 'Badambadi Auto Stand', city: 'Cuttack', lat: 20.4690, lng: 85.8780 },
  { name: 'Buxi Bazar Auto Stand', city: 'Cuttack', lat: 20.4680, lng: 85.8900 },
  { name: 'Link Road Auto Stand', city: 'Cuttack', lat: 20.4620, lng: 85.8740 },
  { name: 'Cuttack Station Auto Stand', city: 'Cuttack', lat: 20.4650, lng: 85.8810 },

  // Berhampur
  { name: 'Berhampur Bus Stand Autos', city: 'Berhampur', lat: 19.3110, lng: 84.7910 },
  { name: 'Ganjam Auto Stand', city: 'Berhampur', lat: 19.3170, lng: 84.7960 },
  { name: 'Ambapua Auto Stand', city: 'Berhampur', lat: 19.3050, lng: 84.7850 },

  // Sambalpur
  { name: 'Sambalpur Station Auto Stand', city: 'Sambalpur', lat: 21.4610, lng: 83.9740 },
  { name: 'Ainthapali Auto Stand', city: 'Sambalpur', lat: 21.4720, lng: 83.9870 },

  // Raipur
  { name: 'Pandri Auto Stand', city: 'Raipur', lat: 21.2380, lng: 81.6340 },
  { name: 'Raipur Station Auto Stand', city: 'Raipur', lat: 21.2170, lng: 81.6330 },
  { name: 'Telibandha Auto Stand', city: 'Raipur', lat: 21.2420, lng: 81.6520 },
  { name: 'Fafadih Auto Stand', city: 'Raipur', lat: 21.2450, lng: 81.6250 },
];

// ── Time-of-Day Traffic Multipliers ──────────────────────────
export interface TimeSlot {
  id: string;
  label: string;
  time: string;
  /** Relative traffic multiplier (1.0 = average) */
  multiplier: number;
  icon: string;
}

export const timeSlots: TimeSlot[] = [
  { id: 'morning',   label: 'Morning',   time: '6 AM – 12 PM', multiplier: 0.7,  icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12 PM – 5 PM', multiplier: 1.0,  icon: '☀️' },
  { id: 'evening',   label: 'Evening',   time: '5 PM – 11 PM', multiplier: 1.4,  icon: '🌆' },
  { id: 'night',     label: 'Night',     time: '11 PM – 6 AM', multiplier: 0.15, icon: '🌙' },
];
