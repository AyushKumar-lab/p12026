'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  MapPin, 
  IndianRupee,
  Maximize,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  X,
  Filter,
  Bed,
  Car,
  Wifi,
  Droplets,
  Zap,
  CheckCircle2
} from 'lucide-react';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
    </div>
  ),
});

// Sample property data
const sampleProperties = [
  {
    id: 1,
    title: 'Commercial Shop in Koramangala',
    address: '7th Block, Koramangala, Bangalore',
    lat: 12.9352,
    lng: 77.6245,
    rent: 15000,
    size: 250,
    type: 'Shop',
    amenities: ['Water', 'Electricity', 'Parking'],
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
    landlord: { name: 'Rajesh Kumar', phone: '919876543210', email: 'rajesh@example.com' },
    availability: 'Immediate',
  },
  {
    id: 2,
    title: 'Street-facing Retail Space',
    address: '80 Feet Road, Koramangala, Bangalore',
    lat: 12.9375,
    lng: 77.6270,
    rent: 22000,
    size: 400,
    type: 'Retail',
    amenities: ['Water', 'Electricity', 'Parking', 'Security'],
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'],
    landlord: { name: 'Priya Sharma', phone: '919876543211', email: 'priya@example.com' },
    availability: 'From next month',
  },
  {
    id: 3,
    title: 'Office Space near Metro',
    address: 'Indiranagar, Bangalore',
    lat: 12.9784,
    lng: 77.6408,
    rent: 35000,
    size: 600,
    type: 'Office',
    amenities: ['Water', 'Electricity', 'Wifi', 'Parking', 'Security'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    landlord: { name: 'Vikram Patel', phone: '919876543212', email: 'vikram@example.com' },
    availability: 'Immediate',
  },
  {
    id: 4,
    title: 'Restaurant Space with Kitchen',
    address: 'Jayanagar 4th Block, Bangalore',
    lat: 12.9300,
    lng: 77.5900,
    rent: 28000,
    size: 500,
    type: 'Restaurant',
    amenities: ['Water', 'Electricity', 'Gas', 'Parking'],
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    landlord: { name: 'Anita Reddy', phone: '919876543213', email: 'anita@example.com' },
    availability: 'Immediate',
  },
  {
    id: 5,
    title: 'Tea Stall Corner Space',
    address: 'Near College Road, Koramangala',
    lat: 12.9360,
    lng: 77.6260,
    rent: 8000,
    size: 120,
    type: 'Shop',
    amenities: ['Water', 'Electricity'],
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
    landlord: { name: 'Fahad Khan', phone: '919876543214', email: 'fahad@example.com' },
    availability: 'Immediate',
  },
  {
    id: 6,
    title: 'Pharmacy Space in Residential',
    address: 'HSR Layout, Bangalore',
    lat: 12.9121,
    lng: 77.6446,
    rent: 18000,
    size: 300,
    type: 'Retail',
    amenities: ['Water', 'Electricity', 'Security'],
    images: ['https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800'],
    landlord: { name: 'Dr. Suresh', phone: '919876543215', email: 'suresh@example.com' },
    availability: 'Immediate',
  },
];

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get('lat') || '12.9352');
  const lng = parseFloat(searchParams.get('lng') || '77.6245');
  const businessType = searchParams.get('type') || '';

  const [selectedProperty, setSelectedProperty] = useState<typeof sampleProperties[0] | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProperty) {
      // Create WhatsApp message
      const whatsappMessage = `Hi ${selectedProperty.landlord.name}, I'm interested in your property "${selectedProperty.title}" in ${selectedProperty.address}. My name is ${contactForm.name} and my phone is ${contactForm.phone}. ${contactForm.message}`;
      
      // Open WhatsApp
      const whatsappUrl = `https://wa.me/${selectedProperty.landlord.phone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      setContactSent(true);
      setTimeout(() => {
        setShowContactModal(false);
        setContactSent(false);
        setContactForm({ name: '', phone: '', message: '' });
      }, 2000);
    }
  };

  const handleEmailClick = () => {
    if (selectedProperty) {
      const subject = `Interested in: ${selectedProperty.title}`;
      const body = `Hi ${selectedProperty.landlord.name},\n\nI'm interested in your property "${selectedProperty.title}" located at ${selectedProperty.address}.\n\nMy Details:\nName: ${contactForm.name || '[Your Name]'}\nPhone: ${contactForm.phone || '[Your Phone]'}\n\n${contactForm.message || '[Your message here]'}\n\nPlease let me know when we can schedule a visit.\n\nThanks!`;
      
      window.open(`mailto:${selectedProperty.landlord.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
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
            <Link href="/analyze" className="btn-secondary text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 h-screen flex flex-col lg:flex-row">
        {/* Property List */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto bg-slate-950">
          <div className="p-4">
            <h1 className="text-xl font-bold text-white mb-2">Available Properties</h1>
            <p className="text-sm text-slate-400 mb-4">
              {sampleProperties.length} properties found near selected zone
            </p>

            <div className="space-y-4">
              {sampleProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card p-4 cursor-pointer transition-colors ${
                    selectedProperty?.id === property.id ? 'border-emerald-500' : ''
                  }`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 truncate">{property.title}</h3>
                      <p className="text-sm text-slate-400 mb-2 truncate">{property.address}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-emerald-400 font-semibold">₹{property.rent.toLocaleString()}/mo</span>
                        <span className="text-slate-500">{property.size} sq ft</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full">
          <LocationMap
            center={[lat, lng]}
            radius={2}
            zones={sampleProperties.map(p => ({
              id: p.id,
              lat: p.lat,
              lng: p.lng,
              score: Math.floor(Math.random() * 20) + 80,
              color: 'green',
              reasoning: 'Available property'
            }))}
            showZones={true}
          />

          {/* Selected Property Popup */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{selectedProperty.title}</h3>
                  <p className="text-sm text-slate-400">{selectedProperty.address}</p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <span className="text-xl font-bold text-emerald-400">₹{selectedProperty.rent.toLocaleString()}/mo</span>
                <span className="text-slate-400">{selectedProperty.size} sq ft</span>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-sm">
                  {selectedProperty.availability}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex-1 btn-primary py-3"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Owner
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
                <h3 className="text-xl font-semibold text-white mb-2">Opening WhatsApp...</h3>
                <p className="text-slate-400">Your message is ready to send!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Contact Owner</h3>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-300">Property: <span className="text-white font-medium">{selectedProperty.title}</span></p>
                  <p className="text-sm text-slate-300">Owner: <span className="text-white font-medium">{selectedProperty.landlord.name}</span></p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your phone number"
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
                      placeholder="I'm interested in renting this space for my business..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleEmailClick}
                      className="flex-1 btn-secondary py-3"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary py-3"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
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
