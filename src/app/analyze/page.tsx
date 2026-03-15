'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Crosshair,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Store,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';

// Dynamic import for Leaflet (client-side only)
const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  ),
});

const businessCategories = [
  { id: 'food', name: 'Food & Beverage', icon: Store },
  { id: 'retail', name: 'Retail', icon: Store },
  { id: 'services', name: 'Services', icon: Store },
  { id: 'healthcare', name: 'Healthcare', icon: Store },
  { id: 'technology', name: 'Technology', icon: Store },
];

const businessTypes: Record<string, string[]> = {
  food: ['Tea Stall', 'Fast Food', 'Restaurant', 'Cafe', 'Bakery'],
  retail: ['Clothing Store', 'Electronics', 'Grocery', 'Pharmacy', 'General Store'],
  services: ['Salon/Spa', 'Repair Shop', 'Coaching Center', 'Gym/Fitness', 'Consultancy'],
  healthcare: ['Clinic', 'Pharmacy', 'Diagnostic Center', 'Dental Care', 'Physiotherapy'],
  technology: ['Cyber Cafe', 'Mobile Repair', 'Computer Shop', 'IT Services', 'Electronics'],
};

const targetCustomers = [
  'College Students',
  'Office Workers', 
  'Families',
  'Tourists',
  'Local Residents',
];

const operatingHours = [
  { id: 'morning', label: 'Morning', time: '6AM - 12PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12PM - 5PM' },
  { id: 'evening', label: 'Evening', time: '5PM - 11PM' },
  { id: 'night', label: 'Night', time: '11PM - 6AM' },
];

export default function AnalyzePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{display_name: string; lat: string; lon: string}>>([]);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number; lng: number; name: string} | null>(null);
  const [radius, setRadius] = useState(5);
  const [businessParams, setBusinessParams] = useState({
    category: '',
    type: '',
    budget: 50000,
    targetCustomers: [] as string[],
    operatingHours: [] as string[],
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
  const [placeNames, setPlaceNames] = useState<Record<number, string>>({});

  // Nominatim requires a valid User-Agent (usage policy)
  const NOMINATIM_HEADERS = { 'User-Agent': 'LocIntel/1.0 (Business Location Intelligence; https://p12026.vercel.app)' };

  // Search for location using Nominatim (free, no API key)
  const searchLocation = useCallback(async (query: string) => {
    if (!query || query.length < 3) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        { headers: NOMINATIM_HEADERS }
      );
      const data = await response.json();
      setSearchResults(data.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchLocation(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchLocation]);

  // Get current location — high accuracy, no cache, clear error messages
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: NOMINATIM_HEADERS }
          );
          const data = await response.json();
          const name = data.display_name || [data.address?.suburb, data.address?.neighbourhood, data.address?.road, data.address?.city, data.address?.state].filter(Boolean).join(', ') || 'Current Location';
          setSelectedLocation({ lat: latitude, lng: longitude, name });
        } catch (_) {
          setSelectedLocation({ lat: latitude, lng: longitude, name: `Current Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})` });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        if (error.code === 1) alert('Location permission denied. Please allow location access in your browser or search for your area manually.');
        else if (error.code === 2) alert('Location unavailable. Please try again or search for your area manually.');
        else if (error.code === 3) alert('Location request timed out. Please try again or search for your area manually.');
        else alert('Unable to get your location. Please search for your city or area.');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  };

  // Reverse-geocode top 5 places for display (Nominatim: 1 req/sec)
  useEffect(() => {
    const topPlaces = analysisResults?.topPlaces || analysisResults?.zones?.slice(0, 5) || [];
    if (topPlaces.length === 0) return;
    let cancelled = false;
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      const names: Record<number, string> = {};
      for (let i = 0; i < Math.min(5, topPlaces.length); i++) {
        if (cancelled) break;
        const z = topPlaces[i];
        const rank = z.rank ?? i + 1;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${z.lat}&lon=${z.lng}&zoom=16&addressdetails=1`,
            { headers: NOMINATIM_HEADERS }
          );
          const data = await res.json();
          const addr = data.address;
          const name = [addr?.road, addr?.suburb, addr?.neighbourhood, addr?.village, addr?.city_district, addr?.city].filter(Boolean).slice(0, 3).join(', ') || data.display_name?.split(',').slice(0, 2).join(', ') || `Spot #${rank}`;
          if (!cancelled) names[rank] = name;
        } catch (_) {
          if (!cancelled) names[rank] = `Spot #${rank}`;
        }
        await delay(1100);
      }
      if (!cancelled) setPlaceNames((prev) => ({ ...prev, ...names }));
    })();
    return () => { cancelled = true; };
  }, [analysisResults?.topPlaces, analysisResults?.zones]);

  // Run analysis using real Overpass API via /api/analyze
  const runAnalysis = async () => {
    if (!selectedLocation) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          radiusKm: radius,
          businessType: businessParams.type,
          targetCustomers: businessParams.targetCustomers,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      if (!json.success || !json.data) throw new Error('Invalid response');
      setAnalysisResults(json.data);
      setStep(4);
    } catch (err: any) {
      console.error('Analysis error:', err);
      alert(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">
                Loc<span className="text-emerald-400">Intel</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? 'bg-emerald-500 text-slate-900'
                      : s < step
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <AnimatePresence mode="wait">
          {/* Step 1: Location Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-[calc(100vh-64px)] flex flex-col"
            >
              {/* Search Bar */}
              <div className="p-4 bg-slate-900/50 border-b border-slate-800">
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search for a city or area..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-1 disabled:opacity-60"
                    >
                      {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                      {locationLoading ? 'Getting location…' : 'My Location'}
                    </button>
                  </div>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedLocation({
                              lat: parseFloat(result.lat),
                              lng: parseFloat(result.lon),
                              name: result.display_name,
                            });
                            setSearchQuery(result.display_name);
                            setSearchResults([]);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-0"
                        >
                          {result.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 relative">
                {selectedLocation ? (
                  <LocationMap
                    center={[selectedLocation.lat, selectedLocation.lng]}
                    radius={radius}
                    onLocationSelect={(lat, lng) => {
                      setSelectedLocation({ ...selectedLocation, lat, lng });
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Search for a location or use your current location</p>
                    </div>
                  </div>
                )}

                {/* Radius Selector — above map so it stays clickable */}
                {selectedLocation && (
                  <div className="absolute bottom-4 left-4 right-4 z-[500] pointer-events-auto bg-slate-800/95 backdrop-blur-sm rounded-xl p-4 border border-slate-700 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white">Analysis radius (circle around your location)</span>
                      <span className="text-sm font-semibold text-emerald-400">{radius} km</span>
                    </div>
                    <div className="flex gap-2">
                      {[2, 5, 10, 15].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRadius(r)}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                            radius === r
                              ? 'bg-emerald-500 text-slate-900'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              {selectedLocation && (
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full btn-primary py-4 text-lg"
                  >
                    Next: Choose Business Type
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Business Profiler */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-4 py-8"
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Map
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Tell Us About Your Business</h2>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Business Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {businessCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setBusinessParams({ ...businessParams, category: cat.id, type: '' })}
                      className={`p-4 rounded-xl border text-left transition-colors ${
                        businessParams.category === cat.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <cat.icon className="w-5 h-5 mb-2" />
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Type */}
              {businessParams.category && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-3">Specific Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {businessTypes[businessParams.category]?.map((type) => (
                      <button
                        key={type}
                        onClick={() => setBusinessParams({ ...businessParams, type })}
                        className={`p-3 rounded-xl border text-sm transition-colors ${
                          businessParams.type === type
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Budget Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Investment Budget: ₹{businessParams.budget.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={businessParams.budget}
                  onChange={(e) => setBusinessParams({ ...businessParams, budget: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹10K</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Target Customers */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Target Customers</label>
                <div className="flex flex-wrap gap-2">
                  {targetCustomers.map((customer) => (
                    <button
                      key={customer}
                      onClick={() => {
                        const newTargets = businessParams.targetCustomers.includes(customer)
                          ? businessParams.targetCustomers.filter(c => c !== customer)
                          : [...businessParams.targetCustomers, customer];
                        setBusinessParams({ ...businessParams, targetCustomers: newTargets });
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        businessParams.targetCustomers.includes(customer)
                          ? 'bg-emerald-500 text-slate-900'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {customer}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-3">Operating Hours</label>
                <div className="grid grid-cols-2 gap-3">
                  {operatingHours.map((hour) => (
                    <button
                      key={hour.id}
                      onClick={() => {
                        const newHours = businessParams.operatingHours.includes(hour.id)
                          ? businessParams.operatingHours.filter(h => h !== hour.id)
                          : [...businessParams.operatingHours, hour.id];
                        setBusinessParams({ ...businessParams, operatingHours: newHours });
                      }}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        businessParams.operatingHours.includes(hour.id)
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="font-medium">{hour.label}</div>
                      <div className="text-xs opacity-70">{hour.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setStep(3)}
                disabled={!businessParams.category || !businessParams.type || businessParams.targetCustomers.length === 0}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review & Analyze
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}

          {/* Step 3: Review & Analyze */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-4 py-8"
            >
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Review Your Selection</h2>

              <div className="space-y-4 mb-8">
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location</span>
                    <span className="text-white font-medium truncate max-w-[200px]">
                      {selectedLocation?.name}
                    </span>
                  </div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Radius</span>
                    <span className="text-white font-medium">{radius} km</span>
                  </div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Business</span>
                    <span className="text-white font-medium">{businessParams.type}</span>
                  </div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Budget</span>
                    <span className="text-white font-medium">₹{businessParams.budget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="card p-4">
                  <div className="mb-2">
                    <span className="text-slate-400">Target Customers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {businessParams.targetCustomers.map((customer) => (
                      <span key={customer} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-sm">
                        {customer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={runAnalysis}
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Location...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Start Analysis
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 4: Results — Top 5–10 best places + map with ranked markers + fly-to */}
          {step === 4 && analysisResults && (() => {
            const topPlaces = analysisResults.topPlaces || analysisResults.zones?.slice(0, 10) || [];
            return (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[calc(100vh-64px)] flex flex-col lg:flex-row"
            >
              <div className="w-full lg:w-[420px] lg:min-w-[380px] flex-shrink-0 bg-slate-900/98 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">Top {topPlaces.length} places to open your {businessParams.type}</h2>
                  <p className="text-sm text-slate-400 truncate mt-1">{selectedLocation?.name} · {radius} km</p>
                  <p className="text-xs text-emerald-400/90 mt-1">Actual scores from 500m radius · OpenStreetMap data</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-400">{analysisResults.overallScore}</span>
                    <span className="text-slate-400">/100 area score</span>
                  </div>
                </div>

                {analysisResults.dataPoints && (
                  <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/30">
                    <p className="text-xs text-slate-400">
                      <span className="text-amber-400 font-medium">{analysisResults.dataPoints.competitors}</span> similar businesses in radius · {analysisResults.dataPoints.transitPoints} transit · {analysisResults.dataPoints.colleges} colleges
                    </p>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {topPlaces.map((zone: any, idx: number) => {
                    const rank = zone.rank ?? idx + 1;
                    const placeName = placeNames[rank] || `Best spot #${rank}`;
                    return (
                      <motion.div
                        key={zone.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`rounded-xl border p-4 ${
                          zone.color === 'green' ? 'bg-emerald-500/10 border-emerald-500/40' :
                          zone.color === 'yellow' ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-800/50 border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${
                              rank === 1 ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-white'
                            }`}>
                              {rank === 1 ? '👑' : rank}
                            </span>
                            <div>
                              <p className="font-semibold text-white text-sm">{placeName}</p>
                              <p className="text-emerald-400 font-bold text-lg">{zone.score}/100</p>
                              {zone.radiusM && (
                                <p className="text-slate-500 text-[10px]">Actual score · {zone.radiusM}m radius (OpenStreetMap)</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">{zone.reasoning}</p>
                        {Array.isArray(zone.insights) && zone.insights.length > 0 && (
                          <ul className="text-xs text-slate-500 space-y-0.5 mb-2">
                            {zone.insights.slice(0, 2).map((line: string, i: number) => (
                              <li key={i}>· {line}</li>
                            ))}
                          </ul>
                        )}
                        {Array.isArray(zone.competitorPlaces) && zone.competitorPlaces.length > 0 && (
                          <div className="mb-3">
                            <p className="text-slate-500 text-[10px] font-medium mb-1">Competitors nearby ({zone.competitorPlaces.length}):</p>
                            <p className="text-slate-400 text-xs leading-snug">
                              {zone.competitorPlaces.slice(0, 6).map((c: { name: string; type?: string }) => c.name).join(', ')}
                              {zone.competitorPlaces.length > 6 ? ` +${zone.competitorPlaces.length - 6} more` : ''}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFlyToPosition([zone.lat, zone.lng])}
                            className="flex-1 py-2 rounded-lg bg-slate-700 text-slate-200 text-xs font-medium hover:bg-slate-600"
                          >
                            View on map
                          </button>
                          {zone.color === 'green' && (
                            <Link
                              href={`/properties?lat=${zone.lat}&lng=${zone.lng}&city=${encodeURIComponent(selectedLocation?.name || '')}&type=${encodeURIComponent(businessParams.type)}`}
                              className="flex-1 py-2 rounded-lg bg-emerald-500 text-slate-900 text-xs font-medium text-center hover:bg-emerald-400"
                            >
                              Properties here
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => { setStep(1); setAnalysisResults(null); setPlaceNames({}); setFlyToPosition(null); }}
                    className="flex-1 btn-secondary py-2.5 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1 inline" />
                    New analysis
                  </button>
                  <Link href="/" className="flex-1 btn-primary py-2.5 text-sm text-center">
                    Home
                  </Link>
                </div>
              </div>

              <div className="flex-1 min-h-[320px] lg:min-h-0 relative">
                <LocationMap
                  center={[selectedLocation!.lat, selectedLocation!.lng]}
                  radius={radius}
                  zones={topPlaces}
                  showZones={true}
                  flyToPosition={flyToPosition}
                />
              </div>
            </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </main>
  );
}
