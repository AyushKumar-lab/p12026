'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
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
  Menu,
  X
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

const targetCustomers = ['College Students', 'Office Workers', 'Families', 'Tourists', 'Local Residents'];
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
  const [businessParams, setBusinessParams] = useState({ category: '', type: '', budget: 50000, targetCustomers: [] as string[], operatingHours: [] as string[] });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
  const [placeNames, setPlaceNames] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(true);

  const NOMINATIM_HEADERS = { 'User-Agent': 'LocIntel/1.0 (https://p12026.vercel.app)' };

  const searchLocation = useCallback(async (query: string) => {
    if (!query || query.length < 3) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, { headers: NOMINATIM_HEADERS });
      const data = await response.json();
      setSearchResults(data.slice(0, 5));
    } catch (error) { console.error('Search error:', error); }
  }, []);

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
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, { headers: NOMINATIM_HEADERS });
          const data = await response.json();
          const name = data.display_name || [data.address?.suburb, data.address?.city].filter(Boolean).join(', ') || 'Current Location';
          setSelectedLocation({ lat: latitude, lng: longitude, name });
        } catch (_) { setSelectedLocation({ lat: latitude, lng: longitude, name: `Current Location` }); }
        finally { setLocationLoading(false); }
      },
      (error) => { setLocationLoading(false); alert('Unable to get location. Please search manually.'); },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  };

  useEffect(() => {
    const topPlaces = analysisResults?.topPlaces || analysisResults?.zones?.slice(0, 5) || [];
    if (topPlaces.length === 0) return;
    let cancelled = false;
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      const names: Record<number, string> = {};
      for (let i = 0; i < Math.min(5, topPlaces.length); i++) {
        if (cancelled) break;
        const z = topPlaces[i]; const rank = z.rank ?? i + 1;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${z.lat}&lon=${z.lng}&zoom=16&addressdetails=1`, { headers: NOMINATIM_HEADERS });
          const data = await res.json();
          const addr = data.address;
          const name = [addr?.road, addr?.suburb, addr?.city].filter(Boolean).slice(0, 2).join(', ') || `Spot #${rank}`;
          if (!cancelled) names[rank] = name;
        } catch (_) { if (!cancelled) names[rank] = `Spot #${rank}`; }
        await delay(1100);
      }
      if (!cancelled) setPlaceNames((prev) => ({ ...prev, ...names }));
    })();
    return () => { cancelled = true; };
  }, [analysisResults?.topPlaces, analysisResults?.zones]);

  const runAnalysis = async () => {
    if (!selectedLocation) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: selectedLocation.lat, lng: selectedLocation.lng, radiusKm: radius, businessType: businessParams.type, targetCustomers: businessParams.targetCustomers }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      setAnalysisResults(json.data);
      setStep(4);
    } catch (err: any) { alert(err.message || 'Analysis failed'); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={32} />
            <span className="text-lg font-bold text-white">Loc<span className="text-blue-400">Intel</span></span>
          </Link>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                s === step ? 'bg-blue-500 text-white' : s < step ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {s < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-14 relative z-10 h-[calc(100vh-56px)]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col">
              <div className="p-3 bg-slate-900/50 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search city or area..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-24 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={getCurrentLocation} disabled={locationLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-1 disabled:opacity-60">
                    {locationLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                    <span className="hidden sm:inline">{locationLoading ? 'Getting...' : 'My Location'}</span>
                    <span className="sm:hidden">{locationLoading ? '...' : 'GPS'}</span>
                  </button>
                </div>
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="mt-2 bg-slate-800/95 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden max-h-48 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button key={index}
                          onClick={() => { setSelectedLocation({ lat: parseFloat(result.lat), lng: parseFloat(result.lon), name: result.display_name }); setSearchQuery(result.display_name); setSearchResults([]); }}
                          className="w-full px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-colors border-b border-white/5 last:border-0">
                          {result.display_name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 relative min-h-0">
                {selectedLocation ? (
                  <LocationMap center={[selectedLocation.lat, selectedLocation.lng]} radius={radius}
                    onLocationSelect={(lat, lng) => { setSelectedLocation({ ...selectedLocation, lat, lng }); }} />
                ) : (
                  <div className="w-full h-full bg-[#0a0a0f] flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="w-10 h-10 text-blue-500/50 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">Search for a location<br/>or use GPS</p>
                    </div>
                  </div>
                )}
                {selectedLocation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-3 left-3 right-3 z-[500] bg-slate-900/95 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">Radius</span>
                      <span className="text-xs font-semibold text-blue-400">{radius} km</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[2, 5, 10, 15].map((r) => (
                        <button key={r} type="button" onClick={() => setRadius(r)}
                          className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                            radius === r ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}>{r} km</button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {selectedLocation && (
                <div className="p-3 bg-slate-900/80 border-t border-white/5">
                  <button onClick={() => setStep(2)}
                    className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto px-4 py-4">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Business Details</h2>

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

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">Budget: <span className="text-blue-400">₹{businessParams.budget.toLocaleString()}</span></label>
                <input type="range" min="10000" max="5000000" step="10000" value={businessParams.budget}
                  onChange={(e) => setBusinessParams({ ...businessParams, budget: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>₹10K</span><span>₹50L</span></div>
              </div>

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

              <button onClick={() => setStep(3)} disabled={!businessParams.category || !businessParams.type || businessParams.targetCustomers.length === 0}
                className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto px-4 py-4">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Review</h2>

              <div className="space-y-2 mb-4">
                {[
                  { label: 'Location', value: selectedLocation?.name?.slice(0, 40) },
                  { label: 'Radius', value: `${radius} km` },
                  { label: 'Business', value: businessParams.type },
                  { label: 'Budget', value: `₹${businessParams.budget.toLocaleString()}` },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className="text-sm text-white font-medium">{item.value}</span>
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

              <button onClick={runAnalysis} disabled={loading}
                className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Start Analysis</>}
              </button>
            </motion.div>
          )}

          {step === 4 && analysisResults && (() => {
            const topPlaces = analysisResults.topPlaces || analysisResults.zones?.slice(0, 10) || [];
            return (
            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
              {/* Mobile Toggle */}
              <div className="lg:hidden flex border-b border-white/5 bg-slate-900/50">
                <button onClick={() => setShowResults(true)} className={`flex-1 py-2.5 text-xs font-medium ${showResults ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400'}`}>
                  Results ({topPlaces.length})
                </button>
                <button onClick={() => setShowResults(false)} className={`flex-1 py-2.5 text-xs font-medium ${!showResults ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400'}`}>
                  Map
                </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Results Panel */}
                <div className={`${showResults ? 'flex' : 'hidden'} lg:flex w-full lg:w-[380px] flex-shrink-0 bg-[#0a0a0f] border-r border-white/5 flex-col`}>
                  <div className="p-3 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">Top Locations</h2>
                    <p className="text-xs text-slate-400 truncate">{selectedLocation?.name}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-400">{analysisResults.overallScore}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {topPlaces.map((zone: any, idx: number) => {
                      const rank = zone.rank ?? idx + 1;
                      const placeName = placeNames[rank] || `Spot #${rank}`;
                      return (
                        <motion.div key={zone.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          className={`rounded-lg border p-3 ${zone.color === 'green' ? 'bg-blue-500/10 border-blue-500/40' : 'bg-slate-800/50 border-white/10'}`}>
                          <div className="flex items-start gap-2 mb-1">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${rank === 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-white'}`}>
                              {rank}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-xs truncate">{placeName}</p>
                              <p className="text-blue-400 font-bold text-sm">{zone.score}/100</p>
                            </div>
                          </div>
                          <p className="text-slate-400 text-[10px] leading-relaxed mb-2 line-clamp-2">{zone.reasoning}</p>
                          <div className="flex gap-1.5">
                            <button onClick={() => { 
                              if (zone.lat != null && zone.lng != null && !isNaN(zone.lat) && !isNaN(zone.lng)) {
                                setFlyToPosition([zone.lat, zone.lng]); 
                                setShowResults(false); 
                              }
                            }}
                              className="flex-1 py-1.5 rounded bg-slate-700 text-slate-200 text-[10px] font-medium hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                              View Map
                            </button>
                            {zone.color === 'green' && (
                              <Link href={`/properties?lat=${zone.lat}&lng=${zone.lng}&city=${encodeURIComponent(selectedLocation?.name || '')}&type=${encodeURIComponent(businessParams.type)}`}
                                className="flex-1 py-1.5 rounded bg-blue-500 text-white text-[10px] font-medium text-center hover:bg-blue-400 transition-colors">
                                Properties
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-white/5 flex gap-2">
                    <button onClick={() => { setStep(1); setAnalysisResults(null); }}
                      className="flex-1 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                      New
                    </button>
                    <Link href="/" className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-center">
                      Home
                    </Link>
                  </div>
                </div>

                {/* Map */}
                <div className={`${!showResults ? 'flex' : 'hidden'} lg:flex flex-1 relative`}>
                  <LocationMap center={[selectedLocation!.lat, selectedLocation!.lng]} radius={radius} zones={topPlaces} showZones={true} flyToPosition={flyToPosition} />
                </div>
              </div>
            </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </main>
  );
}
