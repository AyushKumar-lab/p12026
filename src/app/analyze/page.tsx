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

  // Search for location using Nominatim
  const searchLocation = useCallback(async (query: string) => {
    if (!query || query.length < 3) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`
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

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            name: data.display_name || 'Current Location',
          });
        } catch (error) {
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            name: 'Current Location',
          });
        }
      },
      (error) => {
        alert('Unable to retrieve your location. Please enter manually.');
      }
    );
  };

  // Run analysis
  const runAnalysis = async () => {
    setLoading(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock analysis results
    const results = {
      overallScore: Math.floor(Math.random() * 30) + 70,
      zones: [
        {
          id: 1,
          lat: selectedLocation!.lat + 0.002,
          lng: selectedLocation!.lng + 0.002,
          score: 88,
          color: 'green',
          reasoning: 'High foot traffic from nearby colleges, low competition for this business type',
          competitors: 2,
          transitPoints: 5,
          targetMatch: 85,
        },
        {
          id: 2,
          lat: selectedLocation!.lat - 0.001,
          lng: selectedLocation!.lng + 0.003,
          score: 72,
          color: 'yellow',
          reasoning: 'Good residential area with moderate foot traffic',
          competitors: 4,
          transitPoints: 3,
          targetMatch: 65,
        },
        {
          id: 3,
          lat: selectedLocation!.lat + 0.003,
          lng: selectedLocation!.lng - 0.002,
          score: 45,
          color: 'red',
          reasoning: 'High competition, low target customer density',
          competitors: 8,
          transitPoints: 1,
          targetMatch: 30,
        },
      ],
    };
    
    setAnalysisResults(results);
    setLoading(false);
    setStep(4);
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
              {[1, 2, 3].map((s) => (
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
                      onClick={getCurrentLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                    >
                      <Crosshair className="w-4 h-4" />
                      My Location
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

                {/* Radius Selector */}
                {selectedLocation && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white">Analysis Radius</span>
                      <span className="text-sm text-emerald-400">{radius} km</span>
                    </div>
                    <div className="flex gap-2">
                      {[2, 5, 10, 15].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadius(r)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
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

          {/* Step 4: Results */}
          {step === 4 && analysisResults && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[calc(100vh-64px)] flex flex-col"
            >
              {/* Results Header */}
              <div className="p-4 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Analysis Results</h2>
                    <p className="text-sm text-slate-400">{selectedLocation?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-400">{analysisResults.overallScore}/100</div>
                    <div className="text-xs text-slate-400">Overall Score</div>
                  </div>
                </div>
              </div>

              {/* Map with Results */}
              <div className="flex-1 relative">
                <LocationMap
                  center={[selectedLocation!.lat, selectedLocation!.lng]}
                  radius={radius}
                  zones={analysisResults.zones}
                  showZones={true}
                />

                {/* Results Panel */}
                <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
                  <h3 className="font-semibold text-white mb-3">Recommended Zones</h3>
                  <div className="space-y-3">
                    {analysisResults.zones.map((zone: any) => (
                      <div
                        key={zone.id}
                        className={`p-3 rounded-lg border ${
                          zone.color === 'green'
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : zone.color === 'yellow'
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-rose-500/10 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-semibold ${
                            zone.color === 'green'
                              ? 'text-emerald-400'
                              : zone.color === 'yellow'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}>
                            {zone.color === 'green' ? 'Best Zone' : zone.color === 'yellow' ? 'Good Zone' : 'Avoid'}
                          </span>
                          <span className="text-white font-bold">{zone.score}/100</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{zone.reasoning}</p>
                        <div className="flex gap-3 text-xs text-slate-400">
                          <span>{zone.competitors} competitors</span>
                          <span>{zone.transitPoints} transit points</span>
                        </div>
                        {zone.color === 'green' && (
                          <Link
                            href={`/properties?lat=${zone.lat}&lng=${zone.lng}&type=${businessParams.type}`}
                            className="mt-2 w-full py-2 bg-emerald-500 text-slate-900 rounded-lg text-sm font-medium text-center block hover:bg-emerald-400 transition-colors"
                          >
                            View Properties Here
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    setStep(1);
                    setAnalysisResults(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  New Analysis
                </button>
                <Link
                  href="/"
                  className="flex-1 btn-primary text-center"
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
