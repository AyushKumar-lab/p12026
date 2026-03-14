'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import LocationIntelligence from '@/components/LocationIntelligence';
import PropertyListings from '@/components/PropertyListings';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveLocationStatus from '@/components/LiveLocationStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <LocationIntelligence />
      <PropertyListings />
      <section className="py-16 px-4 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Testimonials />
            </div>
            <div className="lg:col-span-1">
              <LiveLocationStatus />
            </div>
          </div>
        </div>
      </section>
      <CTA />
      <Footer />
    </main>
  );
}
