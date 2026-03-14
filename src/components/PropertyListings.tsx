'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  IndianRupee, 
  Maximize,
  BadgeCheck,
  Heart,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  rent: number;
  sizeSqft: number;
  type: string;
  badge: string | null;
  verified: boolean;
  amenities: string[];
  images: string[];
  matchScore: number | null;
  landlord: {
    name: string;
    verified: boolean;
  };
  _count: {
    inquiries: number;
  };
}

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const result = await response.json();
        if (result.success) {
          setProperties(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch properties');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4"
            >
              <BadgeCheck className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Verified Listings</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Available <span className="gradient-text">Commercial Spaces</span>
            </h2>
            <p className="text-xl text-slate-600">
              Browse verified properties in your recommended zones with real-time availability
            </p>
          </div>
          
          <motion.button
            className="btn-secondary self-start lg:self-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filter Properties
          </motion.button>
        </motion.div>

        {/* Property Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-primary-200 transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.badge && (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                        property.badge === 'Featured' ? 'bg-primary-500 text-white' :
                        property.badge === 'Hot' ? 'bg-danger-500 text-white' :
                        'bg-warning-500 text-white'
                      }`}>
                        {property.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Heart className="w-4 h-4 text-slate-600" />
                    </motion.button>
                  </div>

                  {/* Match Score */}
                  {property.matchScore && (
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-success-500/90 backdrop-blur-sm rounded-lg">
                        <BadgeCheck className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">{property.matchScore}% Match</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {property.type}
                    </span>
                    {property.verified && (
                      <div className="flex items-center gap-1 text-xs text-success-600">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities?.slice(0, 3).map((amenity) => (
                      <span 
                        key={amenity}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                        <IndianRupee className="w-5 h-5" />
                        {property.rent.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Maximize className="w-4 h-4" />
                        {property.sizeSqft} sq ft
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.button
            className="btn-secondary text-lg px-8 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All {properties.length}+ Properties
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
