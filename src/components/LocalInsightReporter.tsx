'use client';

import { useState, useCallback } from 'react';
import { Plus, X, MapPin, CloudRain, Hammer, ShoppingBag, AlertTriangle, Send } from 'lucide-react';

const STORAGE_KEY = 'locintel_local_insights';

export interface LocalInsight {
  id: string;
  lat: number;
  lng: number;
  category: 'flooding' | 'strike' | 'haat' | 'construction' | 'other';
  note: string;
  timestamp: string;
  upvotes: number;
}

const CATEGORIES = [
  { key: 'flooding' as const, label: 'Road Flooding', icon: CloudRain, color: '#3b82f6' },
  { key: 'strike' as const, label: 'Auto Strike / Bandh', icon: AlertTriangle, color: '#ef4444' },
  { key: 'haat' as const, label: 'Weekly Haat Market', icon: ShoppingBag, color: '#f59e0b' },
  { key: 'construction' as const, label: 'Construction / Demolition', icon: Hammer, color: '#8b5cf6' },
  { key: 'other' as const, label: 'Other Insight', icon: MapPin, color: '#6b7280' },
];

function getInsights(): LocalInsight[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveInsight(insight: LocalInsight): void {
  try {
    const all = getInsights();
    all.push(insight);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(-200)));
  } catch {}
}

export function getLocalInsights(): LocalInsight[] {
  return getInsights();
}

interface LocalInsightReporterProps {
  lat: number;
  lng: number;
  onInsightAdded?: (insight: LocalInsight) => void;
}

export default function LocalInsightReporter({ lat, lng, onInsightAdded }: LocalInsightReporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<LocalInsight['category'] | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!category || !note.trim()) return;

    const insight: LocalInsight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      lat,
      lng,
      category,
      note: note.trim().slice(0, 200),
      timestamp: new Date().toISOString(),
      upvotes: 0,
    };

    saveInsight(insight);
    onInsightAdded?.(insight);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setCategory(null);
      setNote('');
    }, 1500);
  }, [category, note, lat, lng, onInsightAdded]);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[44px] min-w-[44px] rounded-lg border border-white/20 bg-slate-900/85 px-3 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-slate-800/90 flex items-center gap-1.5"
        title="Report a local insight"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        <span className="hidden sm:inline">Report</span>
      </button>

      {/* Report panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 z-[530] w-72 rounded-xl border border-white/15 bg-slate-950/95 p-4 backdrop-blur-xl shadow-2xl">
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-bold text-emerald-400">Insight reported!</p>
              <p className="text-[10px] text-slate-400 mt-1">Thanks for helping the community</p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Report Local Insight
              </h3>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                      category === cat.key
                        ? 'ring-2 ring-blue-500 bg-slate-800 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" style={{ color: cat.color }} />
                    {cat.label}
                  </button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's happening here? (max 200 chars)"
                maxLength={200}
                rows={2}
                className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-500">
                  📍 {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!category || !note.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3 h-3" />
                  Submit
                </button>
              </div>

              <p className="text-[9px] text-slate-600 mt-2">
                +10 points per verified insight. Help build India's first crowdsourced location dataset.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
