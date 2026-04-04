'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ViabilityChatProps {
  locationName?: string;
  overallScore?: number;
  topPlaces?: Array<{ rank: number; score: number }>;
  businessType?: string;
  city?: string;
}

export default function ViabilityChat({
  locationName,
  overallScore,
  topPlaces,
  businessType,
  city,
}: ViabilityChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: { locationName, overallScore, topPlaces, businessType, city },
        }),
      });

      const data = await resp.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error.includes('not configured')
            ? '🔒 AI chat requires an API key. Ask the admin to add ANTHROPIC_API_KEY to the environment.'
            : `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please check your connection and try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, locationName, overallScore, topPlaces, businessType, city]);

  const suggestions = [
    `Is this a good location for a ${businessType || 'business'}?`,
    'What are the risks of this area?',
    'How does monsoon affect this location?',
    'What competitor density looks like here?',
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[600] w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-all"
        title="AI Business Viability Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[600] w-80 sm:w-96 rounded-2xl border border-white/15 bg-slate-950/95 backdrop-blur-xl shadow-2xl flex flex-col max-h-[70vh] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">LocIntel AI</h3>
              <p className="text-[10px] text-slate-400">Ask about this location</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[400px]">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <Bot className="w-10 h-10 text-blue-400/30 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-3">
                  Ask me anything about {locationName || 'this location'}
                </p>
                <div className="space-y-1.5">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setInput(s); }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 text-[11px] text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-blue-400" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-200 border border-white/5'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                </div>
                <div className="rounded-xl px-3 py-2 bg-slate-800/80 border border-white/5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about this location..."
                className="flex-1 bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-600 mt-1 text-center">
              ~₹2/query · Powered by Claude AI · Verify on ground before signing lease
            </p>
          </div>
        </div>
      )}
    </>
  );
}
