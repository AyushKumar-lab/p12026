'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { getCommercialRentGeoJsonUrl, getResidentialGeoJsonUrl } from '@/lib/mapLayerUrls';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Mail,
  MessageCircle,
  ArrowLeft,
  X,
  Filter,
  CheckCircle2,
  Loader2,
  Building2,
} from 'lucide-react';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  ),
});

// Shape from Supabase API (real data only)
type PropertyFromAPI = {
  id: string;
  title: string;
  location: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  rent: number;
  size_sqft: number;
  type: string;
  amenities: string[];
  images: string[];
  landlord: { name: string; phone?: string; email?: string; verified?: boolean } | null;
};

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const cityParam = searchParams.get('city') || '';
  const typeParam = searchParams.get('type') || '';

  const [properties, setProperties] = useState<PropertyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyFromAPI | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [showCommercialLayer, setShowCommercialLayer] = useState(true);
  const [showResidentialLayer, setShowResidentialLayer] = useState(true);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [sizeMin, setSizeMin] = useState<string>('');
  const [sizeMax, setSizeMax] = useState<string>('');
  const [cityFilter, setCityFilter] = useState(cityParam);
  const [typeFilter, setTypeFilter] = useState(typeParam);
  const [showFilters, setShowFilters] = useState(false);

  const propertySubmissionFormUrl =
    process.env.NEXT_PUBLIC_PROPERTY_SUBMISSION_FORM_URL ||
    'https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform?embedded=true';

  const mapCenterLat = latParam ? parseFloat(latParam) : 12.9352;
  const mapCenterLng = lngParam ? parseFloat(lngParam) : 77.6245;

  const commercialGeoUrl = useMemo(() => getCommercialRentGeoJsonUrl(), []);
  const residentialGeoUrl = useMemo(() => getResidentialGeoJsonUrl(), []);
  const hasCommercialLayer = Boolean(commercialGeoUrl);
  const hasResidentialLayer = Boolean(residentialGeoUrl);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter) params.set('city', cityFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (priceMin) params.set('minPrice', priceMin);
      if (priceMax) params.set('maxPrice', priceMax);
      if (sizeMin) params.set('minSize', sizeMin);
      if (sizeMax) params.set('maxSize', sizeMax);
      const res = await fetch(`/api/properties?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProperties(json.data);
      } else {
        setProperties([]);
      }
    } catch (_) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [cityFilter, typeFilter, priceMin, priceMax, sizeMin, sizeMax]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty?.landlord?.phone) {
      if (selectedProperty?.landlord?.email) {
        handleEmailClick();
      }
      return;
    }
    const phone = selectedProperty.landlord.phone.replace(/\D/g, '');
    const whatsappNumber = phone.startsWith('91') ? phone : `91${phone}`;
    const whatsappMessage = `Hi ${selectedProperty.landlord.name}, I'm interested in your property "${selectedProperty.title}" at ${selectedProperty.location}. My name is ${contactForm.name}, phone ${contactForm.phone}. ${contactForm.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    setContactSent(true);
    setTimeout(() => {
      setShowContactModal(false);
      setContactSent(false);
      setContactForm({ name: '', phone: '', message: '' });
    }, 2000);
  };

  const handleEmailClick = () => {
    if (!selectedProperty?.landlord?.email) return;
    const subject = `Interested in: ${selectedProperty.title}`;
    const body = `Hi ${selectedProperty.landlord.name},\n\nI'm interested in your property "${selectedProperty.title}" at ${selectedProperty.location}.\n\nName: ${contactForm.name || '[Your Name]'}\nPhone: ${contactForm.phone || '[Your Phone]'}\n\n${contactForm.message || '[Your message]'}\n\nThanks!`;
    window.open(`mailto:${selectedProperty.landlord.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const typeLabels: Record<string, string> = {
    SHOP: 'Shop',
    RETAIL: 'Retail',
    OFFICE: 'Office',
    FOOD_COURT: 'Food Court',
    WAREHOUSE: 'Warehouse',
    OTHER: 'Other',
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-white">Loc<span className="text-emerald-400">Intel</span></span>
          </Link>
          <Link href="/analyze" className="btn-secondary text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Link>
        </div>
      </nav>

      <div className="pt-16 h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto bg-slate-950 flex flex-col">
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-white">Available Properties</h1>
                <p className="text-sm text-slate-400">
                  {loading ? 'Loading…' : `${properties.length} properties from your database`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {showFilters && (
              <div className="card p-4 mb-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                  >
                    <option value="">All</option>
                    {Object.entries(typeLabels).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Rent (₹/mo) min – max</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Min"
                      className="w-24 px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                    />
                    <input
                      type="number"
                      min={0}
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Max"
                      className="w-24 px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Size (sq ft) min – max</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      value={sizeMin}
                      onChange={(e) => setSizeMin(e.target.value)}
                      placeholder="Min"
                      className="w-24 px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                    />
                    <input
                      type="number"
                      min={0}
                      value={sizeMax}
                      onChange={(e) => setSizeMax(e.target.value)}
                      placeholder="Max"
                      className="w-24 px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                    />
                  </div>
                </div>
                <button type="button" onClick={fetchProperties} className="btn-primary w-full py-2 text-sm">
                  Apply filters
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            ) : properties.length === 0 ? (
              <div className="py-16 text-center">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">No properties found</p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  If you&apos;re a property owner/agent, submit your listing here (owner name, phone, city, type, rent, WhatsApp).
                </p>

                <div className="mt-6 max-w-xl mx-auto text-left">
                  <div className="card p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-sm text-slate-300 font-medium">Submit a property listing</p>
                      <a
                        className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                        href={propertySubmissionFormUrl.replace('embedded=true', '')}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in new tab
                      </a>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                      <iframe
                        title="Property submission form"
                        src={propertySubmissionFormUrl}
                        className="w-full h-[720px]"
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      If the form isn&apos;t set up yet, set <span className="text-slate-300 font-medium">NEXT_PUBLIC_PROPERTY_SUBMISSION_FORM_URL</span> in your
                      environment to your Google Form &quot;embedded&quot; URL.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`card p-4 cursor-pointer transition-colors ${selectedProperty?.id === property.id ? 'border-emerald-500' : ''}`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                        {Array.isArray(property.images) && property.images[0] ? (
                          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Building2 className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 truncate">{property.title}</h3>
                        <p className="text-sm text-slate-400 mb-2 truncate">{property.location}, {property.city}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-emerald-400 font-semibold">₹{property.rent?.toLocaleString()}/mo</span>
                          <span className="text-slate-500">{property.size_sqft} sq ft</span>
                          <span className="text-slate-500">{typeLabels[property.type] || property.type}</span>
                        </div>
                        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {property.amenities.slice(0, 3).map((a) => (
                              <span key={a} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative">
          {(hasCommercialLayer || hasResidentialLayer) && (
            <div className="absolute left-3 right-3 top-3 z-[530] flex flex-wrap gap-2 rounded-lg border border-white/10 bg-slate-950/90 px-2 py-2 backdrop-blur-md">
              {hasCommercialLayer && (
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-200">
                  <input
                    type="checkbox"
                    className="rounded border-slate-500 text-emerald-500"
                    checked={showCommercialLayer}
                    onChange={(e) => setShowCommercialLayer(e.target.checked)}
                  />
                  Commercial rent layer
                </label>
              )}
              {hasResidentialLayer && (
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-200">
                  <input
                    type="checkbox"
                    className="rounded border-slate-500 text-emerald-500"
                    checked={showResidentialLayer}
                    onChange={(e) => setShowResidentialLayer(e.target.checked)}
                  />
                  Residential layer
                </label>
              )}
            </div>
          )}
          <LocationMap
            center={[mapCenterLat, mapCenterLng]}
            radius={2}
            zones={properties
              .filter((p) => p.latitude != null && p.longitude != null)
              .map((p, i) => ({
                id: i + 1,
                lat: p.latitude!,
                lng: p.longitude!,
                score: 80,
                color: 'green',
                reasoning: p.title,
              }))}
            showZones={properties.length > 0}
            commercialRentGeoJsonUrl={commercialGeoUrl}
            residentialGeoJsonUrl={residentialGeoUrl}
            showCommercialRentLayer={showCommercialLayer}
            showResidentialLayer={showResidentialLayer}
          />

          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 z-[500] bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{selectedProperty.title}</h3>
                  <p className="text-sm text-slate-400">{selectedProperty.location}, {selectedProperty.city}</p>
                </div>
                <button type="button" onClick={() => setSelectedProperty(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xl font-bold text-emerald-400">₹{selectedProperty.rent?.toLocaleString()}/mo</span>
                <span className="text-slate-400">{selectedProperty.size_sqft} sq ft</span>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="w-full btn-primary py-3"
              >
                <MessageCircle className="w-4 h-4 mr-2 inline" />
                Contact Owner
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {showContactModal && selectedProperty && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 p-6"
          >
            {contactSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Opening WhatsApp…</h3>
                <p className="text-slate-400">Your message is ready to send.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Contact Owner</h3>
                  <button type="button" onClick={() => setShowContactModal(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-300">Property: <span className="text-white font-medium">{selectedProperty.title}</span></p>
                  <p className="text-sm text-slate-300">Owner: <span className="text-white font-medium">{selectedProperty.landlord?.name ?? '—'}</span></p>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your phone"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="I'm interested in this space…"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    {selectedProperty.landlord?.email && (
                      <button type="button" onClick={handleEmailClick} className="flex-1 btn-secondary py-3">
                        <Mail className="w-4 h-4 mr-2 inline" />
                        Email
                      </button>
                    )}
                    <button type="submit" className="flex-1 btn-primary py-3" disabled={!selectedProperty.landlord?.phone && !selectedProperty.landlord?.email}>
                      <MessageCircle className="w-4 h-4 mr-2 inline" />
                      {selectedProperty.landlord?.phone ? 'WhatsApp' : 'Email'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}

export default function PropertiesPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
}
