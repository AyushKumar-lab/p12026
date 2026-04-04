'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, MapPin, HelpCircle, Building2 } from 'lucide-react';

const WHATSAPP_NUMBER = '91XXXXXXXXXX'; // Replace with real number

const quickMessages = [
  {
    icon: MapPin,
    label: 'Analyze a location',
    message: 'Hi! I want to analyze a business location using LocIntel.',
  },
  {
    icon: Building2,
    label: 'List my property',
    message: 'Hi! I want to list my commercial/residential property on LocIntel.',
  },
  {
    icon: HelpCircle,
    label: 'Ask a question',
    message: 'Hi! I have a question about LocIntel.',
  },
];

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">LocIntel on WhatsApp</p>
                  <p className="text-emerald-100 text-[10px]">Typically replies in minutes</p>
                </div>
              </div>
            </div>

            {/* Quick messages */}
            <div className="p-3 space-y-2">
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider px-1">Quick message</p>
              {quickMessages.map((qm) => (
                <button
                  key={qm.label}
                  onClick={() => openWhatsApp(qm.message)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all text-left group"
                >
                  <qm.icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                  <span className="text-sm text-slate-700 group-hover:text-emerald-700 transition-colors">{qm.label}</span>
                  <Send className="w-3 h-3 text-slate-300 group-hover:text-emerald-400 ml-auto transition-colors" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <p className="text-[9px] text-slate-400 text-center">Powered by WhatsApp Business</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center transition-shadow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Chat on WhatsApp'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="wa" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {!isOpen && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}
