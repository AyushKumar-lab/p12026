'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2, 
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const locationScoreData = [
  { name: 'Foot Traffic', score: 85, fullMark: 100 },
  { name: 'Demographics', score: 92, fullMark: 100 },
  { name: 'Competition', score: 78, fullMark: 100 },
  { name: 'Accessibility', score: 88, fullMark: 100 },
  { name: 'Growth Potential', score: 95, fullMark: 100 },
];

const demographicData = [
  { name: 'Students', value: 35, color: '#3b82f6' },
  { name: 'Office Workers', value: 40, color: '#22c55e' },
  { name: 'Families', value: 15, color: '#eab308' },
  { name: 'Tourists', value: 10, color: '#f97316' },
];

const factors = [
  { icon: Users, label: 'Target Demographics', value: '25-35 years', status: 'good' },
  { icon: TrendingUp, label: 'Foot Traffic', value: '2,400/day', status: 'excellent' },
  { icon: Building2, label: 'Competition', value: 'Low density', status: 'good' },
  { icon: Zap, label: 'Accessibility', value: 'Metro + Bus', status: 'excellent' },
  { icon: Shield, label: 'Safety Score', value: '94/100', status: 'excellent' },
];

export default function LocationIntelligence() {
  const [selectedZone, setSelectedZone] = useState<'green' | 'yellow' | 'red'>('green');

  const zones = {
    green: { name: 'Recommended Zone', score: 87, color: 'bg-success-500', textColor: 'text-success-600' },
    yellow: { name: 'Moderate Zone', score: 62, color: 'bg-warning-500', textColor: 'text-warning-600' },
    red: { name: 'Avoid Zone', score: 34, color: 'bg-danger-500', textColor: 'text-danger-600' },
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            AI-Powered <span className="gradient-text">Location Intelligence</span>
          </h2>
          <p className="text-xl text-slate-600">
            See how our algorithm analyzes locations with real data visualization
          </p>
        </motion.div>

        {/* Main Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Dashboard Header */}
          <div className="bg-slate-800/50 border-b border-slate-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Koramangala, Bangalore</h3>
                  <p className="text-slate-400 text-sm">Tea Stall Business Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">Overall Score:</span>
                <motion.div 
                  className="text-4xl font-bold text-success-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  87/100
                </motion.div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Zone Selector */}
              <div className="lg:col-span-1 space-y-3">
                <p className="text-slate-400 text-sm mb-4">Select Zone Type</p>
                {(Object.keys(zones) as Array<keyof typeof zones>).map((zone) => (
                  <motion.button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedZone === zone 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${zones[zone].color}`} />
                        <span className="text-white font-medium">{zones[zone].name}</span>
                      </div>
                      <span className={`font-bold ${zones[zone].textColor}`}>
                        {zones[zone].score}
                      </span>
                    </div>
                  </motion.button>
                ))}

                {/* Key Factors */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-sm mb-4">Key Factors</p>
                  <div className="space-y-3">
                    {factors.map((factor, index) => (
                      <motion.div
                        key={factor.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <factor.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 text-sm">{factor.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{factor.value}</span>
                          <CheckCircle2 className={`w-4 h-4 ${
                            factor.status === 'excellent' ? 'text-success-400' : 'text-success-500'
                          }`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                {/* Score Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                >
                  <h4 className="text-white font-semibold mb-4">Score Breakdown</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locationScoreData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                          {locationScoreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#22c55e' : entry.score > 60 ? '#eab308' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Demographics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                >
                  <h4 className="text-white font-semibold mb-4">Target Demographics</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {demographicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {demographicData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-slate-400">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Revenue Estimate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="sm:col-span-2 bg-gradient-to-r from-primary-600/20 to-success-600/20 rounded-xl p-6 border border-primary-500/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Estimated Monthly Revenue</h4>
                      <p className="text-slate-400 text-sm">Based on similar tea stalls in this area</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-white">₹45,000 - ₹65,000</div>
                      <div className="text-success-400 text-sm flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />
                        23% higher than city average
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Your Location Analysis
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
