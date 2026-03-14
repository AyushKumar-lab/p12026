'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Fahad Khan',
    role: 'Tea Stall Owner',
    location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    content: 'I was terrified of choosing the wrong location for my tea stall. LocIntel showed me exactly where my target customers were - near colleges and offices. My first month revenue exceeded projections by 40%!',
    rating: 5,
    businessType: 'Food & Beverage',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Bakery Chain Owner',
    location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    content: 'As an expanding business owner, I needed systematic data for my 3rd location. The platform\'s competition analysis and demographic insights helped me find an underserved neighborhood. Best decision ever.',
    rating: 5,
    businessType: 'Bakery',
  },
  {
    id: 3,
    name: 'Mr. Rajesh',
    role: 'Property Owner',
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    content: 'My commercial unit was vacant for 6 months. After listing on LocIntel, I found a qualified tenant within 2 weeks. The verification system ensures only serious business owners contact me.',
    rating: 5,
    businessType: 'Landlord',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-success-50/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Success <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-xl text-slate-600">
            See how entrepreneurs and property owners are transforming their businesses with data-driven location decisions
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full hover:shadow-xl hover:border-primary-200 transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning-400 text-warning-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Business Type Badge */}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                    {testimonial.businessType}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                    <p className="text-xs text-slate-400">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12 text-center"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '4,500+', label: 'Successful Matches' },
              { value: '98%', label: 'Customer Satisfaction' },
              { value: '₹50Cr+', label: 'Revenue Generated' },
              { value: '30 Days', label: 'Average Time to Open' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
