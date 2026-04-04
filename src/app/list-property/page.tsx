'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Building2, Home, CheckCircle2, Phone } from 'lucide-react';

const CITIES = ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Sambalpur', 'Raipur'];

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [propertyMode, setPropertyMode] = useState<'commercial' | 'residential'>('commercial');
  const [verifyStep, setVerifyStep] = useState(false);
  const [verified, setVerified] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', whatsapp: '',
    address: '', locality: '', city: '',
    // Commercial fields
    propertyType: 'Shop', rent: '', size: '', description: '',
    // Residential fields
    residentialType: '2BHK', bhk: '2', deposit: '', furnished: 'unfurnished',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      try {
        const key = propertyMode === 'residential' ? 'locintel_residential_listings' : 'locintel_listings';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({
          ...form,
          id: Date.now(),
          mode: propertyMode,
          verified,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (_) {}
    }
    setSubmitted(true);
  };

  const handleVerify = () => {
    // Simulated OTP verification — in production, send OTP via Twilio/MSG91
    setVerifyStep(true);
    setTimeout(() => { setVerified(true); setVerifyStep(false); }, 1500);
  };

  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">Loc<span className="text-emerald-400">Intel</span></span>
            </Link>
          </div>
        </nav>
        <div className="pt-32 max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Thank you!</h1>
          <p className="text-slate-400 mb-8">
            Your {propertyMode} property has been submitted.{verified && ' ✅ Phone verified.'} We&apos;ll review and publish within 24–48 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-400 transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <Link href="/residential" className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors inline-flex items-center gap-2">
              <Home className="w-4 h-4" /> Find Homes
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
          <Link href="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            {propertyMode === 'residential' ? <Home className="w-6 h-6 text-emerald-400" /> : <Building2 className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">List your property</h1>
            <p className="text-slate-400 text-sm">Fill in details. We&apos;ll verify and publish your listing.</p>
          </div>
        </div>

        {/* Property mode toggle */}
        <div className="flex rounded-lg border border-slate-700 overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setPropertyMode('commercial')}
            className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              propertyMode === 'commercial' ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-300 bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" /> Commercial
          </button>
          <button
            type="button"
            onClick={() => setPropertyMode('residential')}
            className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              propertyMode === 'residential' ? 'bg-indigo-500/20 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300 bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4" /> Residential
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          {/* Owner info */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Owner name *</label>
            <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Full name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone *</label>
              <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="10-digit" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
              <input type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="WhatsApp number" />
            </div>
          </div>

          {/* Phone verification */}
          <div className="flex items-center gap-3">
            {verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Phone verified
              </span>
            ) : (
              <button type="button" onClick={handleVerify} disabled={!form.phone || form.phone.length < 10 || verifyStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50">
                <Phone className="w-3.5 h-3.5" />
                {verifyStep ? 'Verifying...' : 'Verify phone'}
              </button>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Locality *</label>
            <input type="text" required value={form.locality} onChange={(e) => set('locality', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Saheed Nagar, Patia" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">City *</label>
            <select required value={form.city} onChange={(e) => set('city', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Select city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Commercial-specific */}
          {propertyMode === 'commercial' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['Shop', 'Retail', 'Office', 'Restaurant', 'Cafe', 'Other'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rent (₹/mo) *</label>
                  <input type="number" required min={1} value={form.rent} onChange={(e) => set('rent', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 25000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Size (sq ft) *</label>
                <input type="number" required min={1} value={form.size} onChange={(e) => set('size', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 300" />
              </div>
            </>
          )}

          {/* Residential-specific */}
          {propertyMode === 'residential' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select value={form.residentialType} onChange={(e) => set('residentialType', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">BHK</label>
                  <select value={form.bhk} onChange={(e) => set('bhk', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['1', '2', '3', '4+'].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rent (₹/mo) *</label>
                  <input type="number" required min={1} value={form.rent} onChange={(e) => set('rent', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 8000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Deposit (₹)</label>
                  <input type="number" value={form.deposit} onChange={(e) => set('deposit', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 16000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Furnished</label>
                <div className="flex gap-2">
                  {(['unfurnished', 'semi-furnished', 'furnished'] as const).map((f) => (
                    <button key={f} type="button" onClick={() => set('furnished', f)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${form.furnished === f ? 'bg-indigo-500/20 border border-indigo-500 text-indigo-300' : 'bg-slate-800 border border-slate-600 text-slate-400'}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder={propertyMode === 'residential' ? 'e.g. 2nd floor, balcony, near main road' : 'e.g. Corner shop, street facing, near metro'} />
          </div>

          <button type="submit" className={`w-full py-3.5 rounded-lg text-white font-semibold transition-colors ${
            propertyMode === 'residential' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'
          }`}>
            Submit {propertyMode} listing
          </button>
        </form>
      </div>
    </main>
  );
}
