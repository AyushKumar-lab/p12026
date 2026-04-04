'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { getCommercialRentGeoJsonUrl, getResidentialGeoJsonUrl } from '@/lib/mapLayerUrls';
import {
  festivalCalendar,
  pilgrimageCorridors,
  templePoints,
  floodRiskZones,
  haatMarkets,
  autoStands,
  timeSlots,
} from '@/data/indiaLayers';
import { saveScoreEntry, getHistoryForLocation, type ScoreEntry } from '@/lib/scoreHistory';
import { 
  MapPin, 
  Search, 
  Crosshair,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Store,
  CheckCircle2,
  Zap,
  Map,
  List,
  Star,
  ChevronDown,
  ChevronUp,
  Crosshair as Target,
  Printer,
  Download,
  Share2,
  X,
  Home,
} from 'lucide-react';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0f] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className="w-8 h-8 text-blue-500" />
      </motion.div>
    </div>
  ),
});

/* === Innovation 7: Footfall Heatmap === */
const FootfallHeatmapPanel = dynamic(() => import('@/components/FootfallHeatmapPanel'), { ssr: false });
/* === Innovation 8: AI Viability Chat === */
const ViabilityChat = dynamic(() => import('@/components/ViabilityChat'), { ssr: false });
/* === Innovation 9: Competitor Radar === */
const CompetitorRadar = dynamic(() => import('@/components/CompetitorRadar'), { ssr: false });
/* === Innovation 10: Score Timeline === */
const ScoreTimeline = dynamic(() => import('@/components/ScoreTimeline'), { ssr: false });
/* === Innovation 12: Monsoon Warning === */
const MonsoonWarning = dynamic(() => import('@/components/MonsoonWarning'), { ssr: false });
/* === Innovation 13: Crowdsourced Intelligence === */
const LocalInsightReporter = dynamic(() => import('@/components/LocalInsightReporter'), { ssr: false });

const businessCategories = [
  { id: 'food', name: 'Food & Beverage', icon: Store },
  { id: 'retail', name: 'Retail', icon: Store },
  { id: 'services', name: 'Services', icon: Store },
  { id: 'healthcare', name: 'Healthcare', icon: Store },
  { id: 'technology', name: 'Technology', icon: Store },
];

const businessTypes: Record<string, string[]> = {
  food: ['Tea Stall', 'Fast Food', 'Restaurant', 'Cafe', 'Bakery'],
  retail: ['Clothing Store', 'Electronics', 'Grocery', 'Kirana', 'Pharmacy', 'General Store'],
  services: ['Salon/Spa', 'Repair Shop', 'Coaching Center', 'Gym/Fitness', 'Consultancy'],
  healthcare: ['Clinic', 'Pharmacy', 'Diagnostic Center', 'Dental Care', 'Physiotherapy'],
  technology: ['Cyber Cafe', 'Mobile Repair', 'Computer Shop', 'IT Services', 'Electronics'],
};

const targetCustomers = ['College Students', 'Office Workers', 'Families', 'Tourists', 'Local Residents'];
const operatingHours = [
  { id: 'morning', label: 'Morning', time: '6AM - 12PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12PM - 5PM' },
  { id: 'evening', label: 'Evening', time: '5PM - 11PM' },
  { id: 'night', label: 'Night', time: '11PM - 6AM' },
];

const howScoreFactors = [
  { name: 'Competitor Density (similar businesses)', weight: 20, desc: 'Count of same-type competitors within the analysis radius. Sourced from OSM (with curated business-type mapping) and enriched signals where available.' },
  { name: 'Competition Penalty (saturation dampener)', weight: 5, desc: 'A dampener applied when competitor density is high; adjusted by business type.' },
  { name: 'Foot Traffic Proxy (restaurants/cafes/fast food)', weight: 13, desc: 'Public-demand proxy using food outlet presence in the zone (OSM public listings).' },
  { name: 'Transit-derived Footfall Proxy (bus/rail access)', weight: 7, desc: 'Transit availability near the zone (bus stops + rail/metro stops) as a footfall driver.' },
  { name: 'Auto-stand / Parking Proximity', weight: 6, desc: 'Accessibility signal using parking/auto-stand presence around the zone (OSM-based heuristics).' },
  { name: 'Road Access / Streets Connectivity', weight: 5, desc: 'Road connectivity proxy using major access streets and access points (OSM road network).' },
  { name: 'Schools & Colleges Proximity', weight: 4, desc: 'Predictable weekday flows estimated via schools/colleges/universities presence (OSM).' },
  { name: 'Residential Buildings Density', weight: 10, desc: 'Density of residential buildings within the radius. Derived from OSM building footprints + India urban heuristics.' },
  { name: 'Household Catchment Stability', weight: 5, desc: 'Stability proxy for residential catchments; older/denser neighborhoods tend to convert more reliably.' },
  { name: 'Offices & Professional Activity', weight: 5, desc: 'Office/professional premises presence in the zone (OSM offices + office buildings).' },
  { name: 'Anchor Retail (malls/supermarkets)', weight: 5, desc: 'Presence of malls/supermarkets as a proxy for established commercial activity (OSM retail listings).' },
  { name: 'Organised Retail Threat Radius', weight: 5, desc: 'Distance to organized retail clusters (e.g., DMart/Big Bazaar/Reliance Fresh). Used more strongly for kirana.' },
  { name: 'Festival / Pilgrimage Multiplier', weight: 5, desc: 'Proximity to pilgrimage routes and festival grounds (Odisha-specific references).' },
  { name: 'Flood Risk Penalty', weight: 3, desc: 'Flood-risk penalty using hazard references (risk zones receive a score deduction).' },
  { name: 'Data Freshness (OSM edit recency)', weight: 2, desc: 'Recency of OSM edits in the area as a proxy for data quality and coverage.' },
];

export default function AnalyzePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ display_name: string; lat: string; lon: string; bbox?: [number, number, number, number] }>
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    bbox?: [number, number, number, number];
  } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [radius, setRadius] = useState(5);
  const [businessParams, setBusinessParams] = useState({ category: '', type: '', budget: 50000, targetCustomers: [] as string[], operatingHours: [] as string[] });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
  const [placeNames, setPlaceNames] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(true);
  const [showHowScore, setShowHowScore] = useState(false);
  const [showCommercialLayer, setShowCommercialLayer] = useState(true);
  const [showResidentialLayer, setShowResidentialLayer] = useState(true);

  // India Intelligence Layer toggles
  const [showIntelPanel, setShowIntelPanel] = useState(false);
  const [showFestivalLayer, setShowFestivalLayer] = useState(false);
  const [showPilgrimageLayer, setShowPilgrimageLayer] = useState(false);
  const [showFloodLayer, setShowFloodLayer] = useState(false);
  const [showHaatLayer, setShowHaatLayer] = useState(false);
  const [showAutoStandLayer, setShowAutoStandLayer] = useState(false);
  const [competitorDensityMode, setCompetitorDensityMode] = useState(false);
  const [compDensityResult, setCompDensityResult] = useState<{count: number; lat: number; lng: number} | null>(null);

  // Time-of-day selector
  const [activeTimeSlot, setActiveTimeSlot] = useState('afternoon');
  const currentTimeSlot = timeSlots.find((t) => t.id === activeTimeSlot) || timeSlots[1];

  // Innovation 10 — Score History
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);

  // Saved / Bookmarked zones (localStorage)
  interface SavedZone {
    lat: number;
    lng: number;
    score: number;
    name: string;
    businessType: string;
    savedAt: string;
  }
  const [savedZones, setSavedZones] = useState<SavedZone[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('locintel-saved-zones');
      if (raw) setSavedZones(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleSaveZone = (zone: any, placeName: string) => {
    setSavedZones((prev) => {
      const exists = prev.some((s) => s.lat === zone.lat && s.lng === zone.lng);
      const next = exists
        ? prev.filter((s) => !(s.lat === zone.lat && s.lng === zone.lng))
        : [...prev, { lat: zone.lat, lng: zone.lng, score: zone.score, name: placeName, businessType: businessParams.type, savedAt: new Date().toISOString() }];
      try { localStorage.setItem('locintel-saved-zones', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isZoneSaved = (zone: any) => savedZones.some((s) => s.lat === zone.lat && s.lng === zone.lng);

  const commercialGeoUrl = useMemo(() => getCommercialRentGeoJsonUrl(), []);
  const residentialGeoUrl = useMemo(() => getResidentialGeoJsonUrl(), []);
  const hasCommercialLayer = Boolean(commercialGeoUrl);
  const hasResidentialLayer = Boolean(residentialGeoUrl);

  type NormalizedZone = {
    id: number;
    lat: number;
    lng: number;
    score: number;
    color: string;
    reasoning: string;
    rank: number;
    competitors?: number;
    transitPoints?: number;
  };

  const normalizeZoneLike = (z: any, idx: number): NormalizedZone | null => {
    const latNum = Number(z?.lat ?? z?.latitude ?? z?.Lat ?? z?.center_lat);
    const lngNum = Number(z?.lng ?? z?.lon ?? z?.longitude ?? z?.Long ?? z?.center_lng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;

    const scoreNum = Number(z?.score ?? z?.viability_score ?? z?.suitability_score ?? 0);
    const rankNum = Number(z?.rank ?? idx + 1);
    const idNum = Number(z?.id ?? rankNum);

    const derivedColor = scoreNum >= 75 ? 'green' : scoreNum >= 45 ? 'yellow' : 'red';
    const color = String(z?.color ?? derivedColor);

    const competitorsRaw = z?.competitors ?? z?.competitor_count ?? z?.competitorPlaces?.length;
    const transitRaw = z?.transitPoints ?? z?.transit_points ?? z?.transit_point_count;

    return {
      id: Number.isFinite(idNum) ? idNum : idx + 1,
      lat: latNum,
      lng: lngNum,
      score: Number.isFinite(scoreNum) ? scoreNum : 0,
      color,
      reasoning: String(z?.reasoning ?? z?.reason ?? z?.insights ?? '').slice(0, 280),
      rank: Number.isFinite(rankNum) ? rankNum : idx + 1,
      ...(competitorsRaw != null && Number.isFinite(Number(competitorsRaw)) ? { competitors: Number(competitorsRaw) } : {}),
      ...(transitRaw != null && Number.isFinite(Number(transitRaw)) ? { transitPoints: Number(transitRaw) } : {}),
    };
  };

  const normalizedTopPlaces = useMemo<NormalizedZone[]>(() => {
    const ar = analysisResults;
    const topArr = Array.isArray(ar?.topPlaces)
      ? ar.topPlaces
      : Array.isArray(ar?.top_places)
        ? ar.top_places
        : [];
    const zonesArr = Array.isArray(ar?.zones) ? ar.zones : [];

    // Python / partial APIs often return a short `topPlaces` while `zones` has every candidate.
    // Always show up to 10 best on the map + sidebar, preferring a full scored list from `zones`.
    let raw: any[] = [];
    if (topArr.length >= 10) {
      raw = topArr.slice(0, 10);
    } else if (zonesArr.length > topArr.length) {
      raw = [...zonesArr]
        .sort((a: any, b: any) => Number(b?.score ?? 0) - Number(a?.score ?? 0))
        .slice(0, 10);
    } else {
      raw = (topArr.length ? topArr : zonesArr).slice(0, 10);
    }

    if (!Array.isArray(raw) || raw.length === 0) return [];

    const normalized = raw
      .map((z: any, idx: number) => normalizeZoneLike(z, idx))
      .filter(Boolean) as NormalizedZone[];
    // Force display ranks 1..N in score order so map markers and list always match.
    return normalized.map((z, i) => ({ ...z, rank: i + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisResults?.topPlaces, analysisResults?.top_places, analysisResults?.zones]);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const MAPBOX_GEOCODING_BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  const searchLocation = useCallback(async (query: string) => {
    if (!query || query.length < 3) return;
    try {
      if (!MAPBOX_TOKEN) {
        console.error('Missing NEXT_PUBLIC_MAPBOX_API_KEY (required for Mapbox search).');
        return;
      }

      const response = await fetch(
        `${MAPBOX_GEOCODING_BASE}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&autocomplete=false&types=place,locality,neighborhood,address&language=en`
      );
      const data = await response.json();

      const features: any[] = Array.isArray(data?.features) ? data.features : [];
      setSearchResults(
        features
          .slice(0, 5)
          .map((f) => {
            const bboxRaw = f?.bbox;
            const bbox =
              Array.isArray(bboxRaw) && bboxRaw.length === 4
                ? (bboxRaw as [number, number, number, number])
                : undefined;
            return {
              display_name: f?.place_name || 'Unknown',
              lat: String(f?.center?.[1] ?? ''),
              lon: String(f?.center?.[0] ?? ''),
              bbox,
            };
          })
          .filter((r) => r.lat !== '' && r.lon !== '')
      );
    } catch (error) { console.error('Search error:', error); }
  }, [MAPBOX_TOKEN]);

  useEffect(() => {
    const timer = setTimeout(() => { if (searchQuery) searchLocation(searchQuery); }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          if (!MAPBOX_TOKEN) {
            alert('Missing Mapbox API key.');
            setSelectedLocation({ lat: latitude, lng: longitude, name: 'Current Location' });
            return;
          }

          const response = await fetch(
            `${MAPBOX_GEOCODING_BASE}/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=place,locality,neighborhood,address&language=en`
          );
          const data = await response.json();
          const feats: any[] = Array.isArray(data?.features) ? data.features : [];
          const withBbox = feats.find(
            (f) => Array.isArray(f?.bbox) && f.bbox.length === 4
          );
          const bboxTuple =
            withBbox?.bbox && Array.isArray(withBbox.bbox) && withBbox.bbox.length === 4
              ? (withBbox.bbox as [number, number, number, number])
              : undefined;
          const placeName = feats[0]?.place_name;
          const name = placeName ? placeName.split(',').slice(0, 2).join(', ') : 'Current Location';
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            name,
            ...(bboxTuple ? { bbox: bboxTuple } : {}),
          });
        } catch (_) { setSelectedLocation({ lat: latitude, lng: longitude, name: `Current Location` }); }
        finally { setLocationLoading(false); }
      },
      () => { setLocationLoading(false); alert('Unable to get location. Please search manually.'); },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  };

  useEffect(() => {
    const topPlaces = normalizedTopPlaces.slice(0, 5);
    if (topPlaces.length === 0) return;
    let cancelled = false;
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      const names: Record<number, string> = {};
      for (let i = 0; i < Math.min(5, topPlaces.length); i++) {
        if (cancelled) break;
        const z = topPlaces[i]; const rank = z.rank ?? i + 1;
        try {
          if (!MAPBOX_TOKEN) continue;

          const res = await fetch(
            `${MAPBOX_GEOCODING_BASE}/${z.lng},${z.lat}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=place,locality,neighborhood,address&language=en`
          );
          const data = await res.json();
          const placeName = data?.features?.[0]?.place_name as string | undefined;
          const shortName = placeName ? placeName.split(',').slice(0, 2).join(', ') : `Spot #${rank}`;
          if (!cancelled) names[rank] = shortName;
        } catch (_) { if (!cancelled) names[rank] = `Spot #${rank}`; }
        await delay(1100);
      }
      if (!cancelled) setPlaceNames((prev) => ({ ...prev, ...names }));
    })();
    return () => { cancelled = true; };
  }, [normalizedTopPlaces, MAPBOX_TOKEN]);

  const runAnalysis = async () => {
    if (!selectedLocation) return;
    setAnalysisError(null);
    setLoading(true);
    try {
      const { analyzeLocationPython } = await import('@/lib/api');
      const result = await analyzeLocationPython(
        selectedLocation.name,
        businessParams.type,
        radius * 1000
      );
      
      if (result.success) {
        const fetchedAt = result?.fetchedAt || new Date().toISOString();
        const fullResult = { ...(result || {}), fetchedAt };
        setAnalysisResults(fullResult);
        setStep(4);
        // Innovation 10 — save score to history
        try {
          saveScoreEntry({
            locationName: selectedLocation?.name || 'Unknown',
            lat: selectedLocation!.lat,
            lng: selectedLocation!.lng,
            score: fullResult.overallScore ?? 0,
            timestamp: new Date().toISOString(),
            businessType: businessParams.type,
            topPlacesCount: Array.isArray(fullResult.topPlaces) ? fullResult.topPlaces.length : 0,
          });
          setScoreHistory(getHistoryForLocation(selectedLocation?.name || ''));
        } catch {}
        setLoading(false);
        return;
      }
      
      console.log('Backend unavailable, using local analysis...');
      await runLocalAnalysis();
      
    } catch (err: any) { 
      console.log('Backend error, using local analysis...', err);
      await runLocalAnalysis();
    }
    finally { setLoading(false); }
  };

  const runLocalAnalysis = async () => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lat: selectedLocation!.lat, 
          lng: selectedLocation!.lng, 
          radiusKm: radius, 
          businessType: businessParams.type, 
          targetCustomers: businessParams.targetCustomers,
          locationLabel: selectedLocation!.name,
        }),
      });
      let json: any = {};
      try {
        json = await res.json();
      } catch {
        json = {};
      }
      if (!res.ok) {
        const msg =
          typeof json?.error === 'string'
            ? json.error
            : res.status === 503
              ? 'Location data is temporarily unavailable. Try again in a minute.'
              : res.status === 429
                ? 'Too many requests. Please wait and try again.'
                : 'We could not analyze this location. Try another area or radius.';
        setAnalysisError(msg);
        return;
      }
      const fetchedAt = json?.fetchedAt || new Date().toISOString();
      const fullResult = { ...(json?.data || {}), fetchedAt, metaMobility: json?.metaMobility ?? null };
      setAnalysisResults(fullResult);
      setStep(4);
      // Innovation 10 — save score to history
      try {
        saveScoreEntry({
          locationName: selectedLocation?.name || 'Unknown',
          lat: selectedLocation!.lat,
          lng: selectedLocation!.lng,
          score: fullResult.overallScore ?? 0,
          timestamp: new Date().toISOString(),
          businessType: businessParams.type,
          topPlacesCount: Array.isArray(fullResult.topPlaces) ? fullResult.topPlaces.length : 0,
        });
        setScoreHistory(getHistoryForLocation(selectedLocation?.name || ''));
      } catch {}
    } catch {
      setAnalysisError(
        'Network error or server unreachable. Check your connection and try again.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
      </div>

      {analysisError && (
        <div
          role="alert"
          className="fixed left-0 right-0 top-14 z-[85] flex justify-center px-3 pt-2 pointer-events-none"
        >
          <div className="pointer-events-auto flex max-w-lg items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-950/95 px-4 py-3 text-left shadow-lg backdrop-blur-md">
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-100">Something went wrong</p>
              <p className="mt-1 text-xs text-rose-200/90 leading-relaxed">{analysisError}</p>
            </div>
            <button
              type="button"
              onClick={() => setAnalysisError(null)}
              className="shrink-0 rounded-lg p-2 text-rose-300 hover:bg-rose-500/20 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Dismiss error"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div
          className="fixed left-0 right-0 bottom-0 top-14 z-[80] flex items-center justify-center bg-[#0a0a0f]/70 backdrop-blur-[2px] px-4"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/95 px-8 py-8 text-center shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <div>
              <p className="text-base font-semibold text-white">Analyzing location…</p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Pulling OpenStreetMap data and scoring zones. This may take 15–45 seconds on slow networks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <AnimatedLogo size={28} />
            <span className="text-base sm:text-lg font-bold text-white">Loc<span className="text-blue-400">Intel</span></span>
          </Link>
          {/* Step indicators */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium transition-colors ${
                s === step ? 'bg-blue-500 text-white' : s < step ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {s < step ? <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : s}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-14 relative z-10 h-[calc(100dvh-56px)]">
        <AnimatePresence mode="wait">
          {/* ── STEP 1: Choose Location ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col">

              {/* Search bar */}
              <div className="p-2.5 sm:p-3 bg-slate-900/50 border-b border-white/5 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search city or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-20 sm:pr-28 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-1 disabled:opacity-60 whitespace-nowrap"
                  >
                    {locationLoading ? <Loader2 className="w-3 h-3 animate-spin shrink-0" /> : <Crosshair className="w-3 h-3 shrink-0" />}
                    <span className="hidden sm:inline">{locationLoading ? 'Getting...' : 'My Location'}</span>
                    <span className="sm:hidden">{locationLoading ? '...' : 'GPS'}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="mt-2 bg-slate-800/95 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden max-h-40 overflow-y-auto"
                    >
                      {searchResults.map((result, index) => (
                        <button key={index}
                          onClick={() => {
                            setSelectedLocation({
                              lat: parseFloat(result.lat),
                              lng: parseFloat(result.lon),
                              name: result.display_name,
                              ...(result.bbox ? { bbox: result.bbox } : {}),
                            });
                            setSearchQuery(result.display_name);
                            setSearchResults([]);
                          }}
                          className="w-full px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-colors border-b border-white/5 last:border-0"
                        >
                          {result.display_name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Map area – grows to fill available space */}
              <div className="flex-1 relative min-h-0">
                {selectedLocation ? (
                  <>
                    {(hasCommercialLayer || hasResidentialLayer) && (
                      <div className="pointer-events-auto absolute left-3 right-3 top-3 z-[530] flex flex-wrap gap-2 rounded-lg border border-white/10 bg-slate-950/90 px-2.5 py-2 backdrop-blur-md">
                        {hasCommercialLayer && (
                          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-200">
                            <input
                              type="checkbox"
                              className="rounded border-slate-500 text-blue-500"
                              checked={showCommercialLayer}
                              onChange={(e) => setShowCommercialLayer(e.target.checked)}
                            />
                            Commercial rent
                          </label>
                        )}
                        {hasResidentialLayer && (
                          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-200">
                            <input
                              type="checkbox"
                              className="rounded border-slate-500 text-blue-500"
                              checked={showResidentialLayer}
                              onChange={(e) => setShowResidentialLayer(e.target.checked)}
                            />
                            Residential
                          </label>
                        )}
                      </div>
                    )}
                    <LocationMap
                      center={[selectedLocation.lat, selectedLocation.lng]}
                      radius={radius}
                      cityBounds={selectedLocation.bbox ?? null}
                      commercialRentGeoJsonUrl={commercialGeoUrl}
                      residentialGeoJsonUrl={residentialGeoUrl}
                      showCommercialRentLayer={showCommercialLayer}
                      showResidentialLayer={showResidentialLayer}
                      onLocationSelect={(lat, lng) =>
                        setSelectedLocation({ ...selectedLocation, lat, lng })
                      }
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-[#0a0a0f] flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="w-10 h-10 text-blue-500/50 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">Search for a location<br/>or use GPS</p>
                    </div>
                  </div>
                )}

                {/* Radius selector – floats over map */}
                {selectedLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    // `pointer-events-none` prevents this overlay from blocking the `Next` button click.
                    // Buttons inside re-enable pointer events.
                    className="absolute bottom-3 left-3 right-3 z-[500] pointer-events-none bg-slate-900/95 backdrop-blur-md rounded-lg p-2.5 sm:p-3 border border-white/10 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">Radius</span>
                      <span className="text-xs font-semibold text-blue-400">{radius} km</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[2, 5, 10, 15].map((r) => (
                        <button key={r} type="button" onClick={() => setRadius(r)}
                          className={`pointer-events-auto flex-1 py-2 sm:py-2.5 rounded-md text-xs font-medium transition-all ${
                            radius === r ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}>
                          {r} km
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Next button */}
              {selectedLocation && (
                <div className="p-2.5 sm:p-3 bg-slate-900/80 border-t border-white/5 shrink-0">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: Business Details ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto overscroll-contain px-3 sm:px-4 py-4">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Business Details</h2>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {businessCategories.map((cat) => (
                    <button key={cat.id} onClick={() => setBusinessParams({ ...businessParams, category: cat.id, type: '' })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        businessParams.category === cat.id ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-white/10 text-slate-300'
                      }`}>
                      <cat.icon className="w-4 h-4 mb-1" /><span className="text-xs font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              {businessParams.category && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-400 mb-2">Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {businessTypes[businessParams.category]?.map((type) => (
                      <button key={type} onClick={() => setBusinessParams({ ...businessParams, type })}
                        className={`p-2.5 rounded-lg border text-xs transition-all ${
                          businessParams.type === type ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-white/10 text-slate-300'
                        }`}>{type}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Budget: <span className="text-blue-400">₹{businessParams.budget.toLocaleString()}</span>
                </label>
                <input type="range" min="10000" max="5000000" step="10000" value={businessParams.budget}
                  onChange={(e) => setBusinessParams({ ...businessParams, budget: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>₹10K</span><span>₹50L</span></div>
              </div>

              {/* Target customers */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">Target Customers</label>
                <div className="flex flex-wrap gap-1.5">
                  {targetCustomers.map((customer) => (
                    <button key={customer}
                      onClick={() => {
                        const newTargets = businessParams.targetCustomers.includes(customer)
                          ? businessParams.targetCustomers.filter(c => c !== customer)
                          : [...businessParams.targetCustomers, customer];
                        setBusinessParams({ ...businessParams, targetCustomers: newTargets });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        businessParams.targetCustomers.includes(customer) ? 'bg-blue-500 text-white' : 'bg-slate-800/50 text-slate-300 border border-white/10'
                      }`}>{customer}</button>
                  ))}
                </div>
              </div>

              {/* Operating hours */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-400 mb-2">Operating Hours</label>
                <div className="grid grid-cols-2 gap-2">
                  {operatingHours.map((hour) => (
                    <button key={hour.id}
                      onClick={() => {
                        const newHours = businessParams.operatingHours.includes(hour.id)
                          ? businessParams.operatingHours.filter(h => h !== hour.id)
                          : [...businessParams.operatingHours, hour.id];
                        setBusinessParams({ ...businessParams, operatingHours: newHours });
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        businessParams.operatingHours.includes(hour.id) ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-white/10 text-slate-300'
                      }`}>
                      <div className="text-xs font-medium">{hour.label}</div>
                      <div className="text-[10px] opacity-70">{hour.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!businessParams.category || !businessParams.type || businessParams.targetCustomers.length === 0}
                className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── STEP 3: Review ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto overscroll-contain px-3 sm:px-4 py-4">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Review</h2>

              <div className="space-y-2 mb-4">
                {[
                  { label: 'Location', value: selectedLocation?.name?.slice(0, 45) },
                  { label: 'Radius', value: `${radius} km` },
                  { label: 'Business', value: businessParams.type },
                  { label: 'Budget', value: `₹${businessParams.budget.toLocaleString()}` },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400 shrink-0">{item.label}</span>
                      <span className="text-sm text-white font-medium text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Target Customers</div>
                  <div className="flex flex-wrap gap-1">
                    {businessParams.targetCustomers.map((c) => (
                      <span key={c} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={runAnalysis}
                disabled={loading}
                className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Start Analysis</>}
              </button>
            </motion.div>
          )}

          {/* ── STEP 4: Results ── */}
          {step === 4 && analysisResults && (() => {
            const topPlaces = normalizedTopPlaces;
            return (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">

                {/* Mobile tab bar */}
                <div className="lg:hidden flex shrink-0 border-b border-white/5 bg-slate-900/60 backdrop-blur-sm">
                  <button
                    onClick={() => setShowResults(true)}
                    className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      showResults ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    Results ({topPlaces.length})
                  </button>
                  <button
                    onClick={() => setShowResults(false)}
                    className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      !showResults ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    Map
                  </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
                  {/* Results panel */}
                  <div className={`${showResults ? 'flex' : 'hidden'} lg:flex w-full lg:w-[360px] xl:w-[400px] shrink-0 bg-[#0a0a0f] border-r border-white/5 flex-col`}>
                    {/* Panel header */}
                    <div className="p-3 sm:p-4 border-b border-white/5 shrink-0">
                      <h2 className="text-base sm:text-lg font-bold text-white">Top Locations</h2>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{selectedLocation?.name}</p>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-blue-400">{analysisResults.overallScore}</span>
                        <span className="text-xs text-slate-400">/100 overall score</span>
                      </div>

                      {/* Time-of-day traffic selector */}
                      <div className="mt-3">
                        <div className="text-[10px] text-slate-500 mb-1.5">Foot traffic by time of day</div>
                        <div className="flex gap-1">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => setActiveTimeSlot(slot.id)}
                              className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-all ${
                                activeTimeSlot === slot.id
                                  ? 'bg-blue-500/20 border border-blue-500 text-blue-300'
                                  : 'bg-slate-800/50 border border-white/5 text-slate-400 hover:text-slate-300'
                              }`}
                            >
                              <div>{slot.icon}</div>
                              <div>{slot.label}</div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                          <span className={`font-bold ${currentTimeSlot.multiplier >= 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {currentTimeSlot.multiplier}x traffic
                          </span>
                          <span className="text-slate-500">{currentTimeSlot.time}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] leading-snug text-slate-500">
                        Data last refreshed:{' '}
                        {analysisResults?.fetchedAt
                          ? new Date(analysisResults.fetchedAt).toLocaleString()
                          : '—'}
                      </p>
                      <p className="mt-2 text-[11px] leading-snug text-slate-500">
                        Based on public data. Verify on-ground before signing a lease.
                      </p>
                      {analysisResults?.metaMobility && (
                        <p className="mt-2 text-[11px] leading-snug text-emerald-400/90">
                          Meta mobility ({analysisResults.metaMobility.gadmName}, {analysisResults.metaMobility.ds}):{' '}
                          {analysisResults.metaMobility.mobilityIndex0_100}/100 · {analysisResults.metaMobility.matchedBy}{' '}
                          match. District-level signal.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowHowScore((v) => !v)}
                        className="mt-2 text-[11px] text-blue-400 hover:text-blue-300 underline underline-offset-4 text-left"
                      >
                        {showHowScore ? 'Hide How We Score' : 'How We Score'}
                      </button>
                    </div>

                  {showHowScore && (
                    <div className="px-2.5 py-2 border-b border-white/5 bg-slate-900/20">
                      <div className="flex items-center justify-between gap-3 px-2">
                        <p className="text-xs font-semibold text-white">How We Score (Factors & Weights)</p>
                        <Link
                          href="/methodology"
                          className="text-[11px] text-blue-400 hover:text-blue-300 underline underline-offset-4"
                        >
                          Full details
                        </Link>
                      </div>
                      <div className="mt-2 px-2 space-y-2">
                        {howScoreFactors.map((f) => (
                          <div key={f.name} className="rounded-lg border border-white/5 bg-[#0a0a0f]/40 p-2">
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="text-[11px] font-medium text-white">{f.name}</p>
                              <span className="text-[11px] font-bold text-blue-300">{f.weight}%</span>
                            </div>
                            <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* India Intelligence Layers panel */}
                    <div className="px-2.5 py-2 border-b border-white/5">
                      <button
                        onClick={() => setShowIntelPanel((v) => !v)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="text-[11px] font-semibold text-white">🇮🇳 India Intelligence Layers</span>
                        {showIntelPanel ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {showIntelPanel && (
                        <div className="mt-2 space-y-1.5">
                          {[
                            { label: '🎉 Festival Calendar', checked: showFestivalLayer, set: setShowFestivalLayer },
                            { label: '🛕 Pilgrimage Corridors', checked: showPilgrimageLayer, set: setShowPilgrimageLayer },
                            { label: '⚠️ Flood Risk Zones', checked: showFloodLayer, set: setShowFloodLayer },
                            { label: '🏪 Haat Markets', checked: showHaatLayer, set: setShowHaatLayer },
                            { label: '🛺 Auto Stands', checked: showAutoStandLayer, set: setShowAutoStandLayer },
                            { label: '🎯 Competitor Density Tool', checked: competitorDensityMode, set: setCompetitorDensityMode },
                          ].map((item) => (
                            <label key={item.label} className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-300 hover:text-white transition-colors">
                              <input
                                type="checkbox"
                                className="rounded border-slate-500 text-blue-500"
                                checked={item.checked}
                                onChange={(e) => item.set(e.target.checked)}
                              />
                              {item.label}
                            </label>
                          ))}
                          {competitorDensityMode && (
                            <div className="text-[10px] text-amber-400/80 mt-1 pl-5">
                              Click anywhere on the map to draw a 500m radius and count competitors
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* === Innovation 12: Monsoon Warning === */}
                    {selectedLocation && (
                      <div className="px-2.5 py-2 border-b border-white/5">
                        <MonsoonWarning lat={selectedLocation.lat} lng={selectedLocation.lng} />
                      </div>
                    )}





                    {/* === Innovation 10: Score History (minimal) === */}
                    {scoreHistory.length > 0 && (
                      <div className="px-2.5 py-1.5 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white">📈 Score History</span>
                        <span className="text-[10px] text-slate-500">{scoreHistory.length} recorded</span>
                      </div>
                    )}

                    {/* Saved Zones */}
                    {savedZones.length > 0 && (
                      <div className="px-2.5 py-2 border-b border-white/5">
                        <div className="text-[11px] font-semibold text-amber-400 mb-1.5">⭐ Saved Zones ({savedZones.length})</div>
                        <div className="space-y-1">
                          {savedZones.slice(0, 5).map((sz, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded px-2 py-1.5">
                              <div className="min-w-0">
                                <p className="text-[10px] text-white truncate">{sz.name}</p>
                                <p className="text-[9px] text-slate-500">{sz.businessType} · {sz.score}/100</p>
                              </div>
                              <button
                                onClick={() => {
                                  setFlyToPosition([sz.lat, sz.lng]);
                                  setShowResults(false);
                                }}
                                className="text-[9px] text-blue-400 hover:text-blue-300 shrink-0 ml-2"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-3 space-y-2 min-h-0">
                      {topPlaces.map((zone: any, idx: number) => {
                        const rank = zone.rank ?? idx + 1;
                        const placeName = placeNames[rank] || `Spot #${rank}`;
                        return (
                          <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className={`rounded-lg border p-3 ${zone.color === 'green' ? 'bg-blue-500/10 border-blue-500/40' : 'bg-slate-800/50 border-white/10'}`}
                          >
                            <div className="flex items-start gap-2 mb-1.5">
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                                rank === 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-white'
                              }`}>
                                {rank}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-xs truncate">{placeName}</p>
                                <p className="text-blue-400 font-bold text-sm">{zone.score}/100</p>
                              </div>
                              <button
                                onClick={() => toggleSaveZone(zone, placeName)}
                                className={`shrink-0 p-1 rounded transition-colors ${
                                  isZoneSaved(zone) ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'
                                }`}
                                title={isZoneSaved(zone) ? 'Remove bookmark' : 'Save this zone'}
                              >
                                <Star className={`w-4 h-4 ${isZoneSaved(zone) ? 'fill-amber-400' : ''}`} />
                              </button>
                            </div>
                            <p className="text-slate-400 text-[10px] leading-relaxed mb-2 line-clamp-2">{zone.reasoning}</p>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  if (zone.lat != null && zone.lng != null && !isNaN(zone.lat) && !isNaN(zone.lng)) {
                                    setFlyToPosition([zone.lat, zone.lng]);
                                    setShowResults(false);
                                  }
                                }}
                                className="flex-1 py-1.5 rounded bg-slate-700 text-slate-200 text-[10px] font-medium hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                              >
                                View Map
                              </button>
                              {zone.color === 'green' && (
                                <Link
                                  href={`/properties?lat=${zone.lat}&lng=${zone.lng}&city=${encodeURIComponent(selectedLocation?.name || '')}&type=${encodeURIComponent(businessParams.type)}`}
                                  className="flex-1 py-1.5 rounded bg-blue-500 text-white text-[10px] font-medium text-center hover:bg-blue-400 transition-colors"
                                >
                                  Properties
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Bottom actions */}
                    <div className="p-2.5 sm:p-3 border-t border-white/5 space-y-2 shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const loc = selectedLocation?.name || 'Unknown';
                            const biz = businessParams.type || 'General';
                            const zones = topPlaces;
                            const score = analysisResults.overallScore;
                            const ts = currentTimeSlot;
                            const printWindow = window.open('', '_blank');
                            if (!printWindow) return;
                            printWindow.document.write(`
<!DOCTYPE html>
<html><head>
<title>LocIntel Report — ${loc}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Inter, system-ui, sans-serif; background: #fff; color: #1e293b; padding: 32px; max-width: 800px; margin: 0 auto; }
  .header { border-bottom: 3px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { font-size: 24px; color: #0f172a; }
  .header p { font-size: 13px; color: #64748b; margin-top: 4px; }
  .score-box { display: inline-block; background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 12px 24px; margin: 16px 0; }
  .score-box .num { font-size: 36px; font-weight: 800; color: #3b82f6; }
  .score-box .label { font-size: 12px; color: #64748b; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; font-size: 12px; color: #475569; }
  .meta span { background: #f1f5f9; padding: 6px 10px; border-radius: 6px; }
  h2 { font-size: 16px; margin: 24px 0 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .zone { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; page-break-inside: avoid; }
  .zone .rank { display: inline-block; background: #3b82f6; color: #fff; width: 24px; height: 24px; border-radius: 4px; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 8px; }
  .zone .rank.top { background: #10b981; }
  .zone .name { font-weight: 600; font-size: 13px; }
  .zone .score { color: #3b82f6; font-weight: 700; font-size: 14px; float: right; }
  .zone .reason { font-size: 11px; color: #64748b; margin-top: 6px; line-height: 1.5; }
  .zone .stats { font-size: 10px; color: #94a3b8; margin-top: 4px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 16px; } .no-print { display: none; } }
</style>
</head><body>
<div class="header">
  <h1>\u{1F4CD} LocIntel Location Intelligence Report</h1>
  <p>${loc} · ${biz} · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>
<div class="score-box">
  <div class="num">${score}</div>
  <div class="label">Overall Score /100</div>
</div>
<div class="meta">
  <span><b>Location:</b> ${loc}</span>
  <span><b>Business:</b> ${biz}</span>
  <span><b>Radius:</b> ${radius} km</span>
  <span><b>Peak Traffic:</b> ${ts.label} (${ts.multiplier}x)</span>
</div>
<h2>Top ${zones.length} Recommended Zones</h2>
${zones.map((z: any, i: number) => {
  const rank = z.rank ?? i + 1;
  const label = z.color === 'green' ? 'Recommended' : z.color === 'yellow' ? 'Moderate' : 'Avoid';
  return `<div class="zone">
    <span class="rank ${rank <= 3 ? 'top' : ''}">${rank}</span>
    <span class="name">${placeNames[rank] || 'Spot #' + rank}</span>
    <span class="score">${z.score}/100</span>
    <div class="reason">${z.reasoning}</div>
    <div class="stats">${z.competitors ?? '—'} competitors · ${z.transitPoints ?? '—'} transit points · ${label}</div>
  </div>`;
}).join('')}
<div class="footer">
  Generated by LocIntel · ${new Date().toLocaleString('en-IN')} · locintel.in<br/>
  <span class="no-print" style="font-size:12px;color:#3b82f6;cursor:pointer" onclick="window.print()">\u{1F5A8} Click to Print</span>
</div>
</body></html>`);
                            printWindow.document.close();
                          }}
                          className="flex-1 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Report
                        </button>
                        <button
                          onClick={() => {
                            const loc = selectedLocation?.name || 'Unknown';
                            const biz = businessParams.type || 'General';
                            const text = `LocIntel Analysis — ${loc}\nBusiness: ${biz}\nScore: ${analysisResults.overallScore}/100\nRadius: ${radius}km\n\nTop Zones:\n${(topPlaces || []).map((z: any, i: number) => {
                              const rank = z.rank ?? i + 1;
                              return `${rank}. ${placeNames[rank] || 'Spot #' + rank} — ${z.score}/100`;
                            }).join('\n')}\n\nGenerated by LocIntel · ${new Date().toLocaleDateString('en-IN')}`;
                            const blob = new Blob([text], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `locintel-report-${loc.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="flex-1 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Export
                        </button>
                      </div>
                      {/* Find Homes CTA */}
                      <Link
                        href={`/residential?lat=${selectedLocation?.lat}&lng=${selectedLocation?.lng}&city=${encodeURIComponent(selectedLocation?.name?.split(',').pop()?.trim() || '')}&budget=${businessParams.budget > 50000 ? 15000 : 10000}`}
                        className="w-full py-2.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-colors text-center flex items-center justify-center gap-1.5"
                      >
                        <Home className="w-3.5 h-3.5" /> 🏠 Find Homes Near This Location
                      </Link>
                      <div className="flex gap-2">
                        <button
                        onClick={() => {
                          setStep(1);
                          setAnalysisResults(null);
                          setAnalysisError(null);
                        }}
                          className="flex-1 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          New Analysis
                        </button>
                        <Link
                          href="/"
                          className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-center"
                        >
                          Home
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Map panel */}
                  <div className={`${!showResults ? 'flex' : 'hidden'} lg:flex flex-1 relative min-h-0`}>
                    <LocationMap
                      center={[selectedLocation!.lat, selectedLocation!.lng]}
                      radius={radius}
                      cityBounds={null}
                      zones={topPlaces}
                      showZones={true}
                      flyToPosition={flyToPosition}
                      commercialRentGeoJsonUrl={commercialGeoUrl}
                      residentialGeoJsonUrl={residentialGeoUrl}
                      showCommercialRentLayer={showCommercialLayer}
                      showResidentialLayer={showResidentialLayer}
                      festivalData={festivalCalendar}
                      showFestivalLayer={showFestivalLayer}
                      pilgrimageCorridors={pilgrimageCorridors}
                      templePoints={templePoints}
                      showPilgrimageLayer={showPilgrimageLayer}
                      floodData={floodRiskZones}
                      showFloodLayer={showFloodLayer}
                      haatData={haatMarkets}
                      showHaatLayer={showHaatLayer}
                      autoStandData={autoStands}
                      showAutoStandLayer={showAutoStandLayer}
                      competitorDensityMode={competitorDensityMode}
                      onCompetitorDensityResult={(count, lat, lng) => setCompDensityResult({ count, lat, lng })}
                    />

                    {/* === Innovation 13: Crowdsourced Local Intelligence === */}
                    {selectedLocation && (
                      <div className="absolute bottom-4 right-4 z-[530]">
                        <LocalInsightReporter
                          lat={selectedLocation.lat}
                          lng={selectedLocation.lng}
                          onInsightAdded={(insight) => console.log('[LocIntel] New local insight:', insight)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* === Innovation 8: AI Business Viability Chat === */}
                <ViabilityChat
                  locationName={selectedLocation?.name}
                  overallScore={analysisResults?.overallScore}
                  topPlaces={topPlaces}
                  businessType={businessParams.type}
                  city={selectedLocation?.name?.split(',').pop()?.trim()}
                />
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </main>
  );
}
