import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ServiceTitanROICalculator() {
  const [adSpend, setAdSpend] = useState<string>('5000');
  const [leads, setLeads] = useState<string>('100');
  const [bookingRate, setBookingRate] = useState<string>('60');
  const [closeRate, setCloseRate] = useState<string>('40');
  const [avgTicket, setAvgTicket] = useState<string>('8500');

  const [results, setResults] = useState<{ revenue: number; roi: number; booked: number; signed: number; cpl: number; cac: number } | null>(null);

  useEffect(() => {
    const spend = Number(adSpend) || 0;
    const l = Number(leads) || 0;
    const bRate = Number(bookingRate) || 0;
    const cRate = Number(closeRate) || 0;
    const ticket = Number(avgTicket) || 0;

    if (spend > 0 && l > 0 && bRate > 0 && cRate > 0 && ticket > 0) {
      const booked = l * (bRate / 100);
      const signed = booked * (cRate / 100);
      const revenue = signed * ticket;
      const roi = ((revenue - spend) / spend) * 100;
      
      const cpl = spend / l;
      const cac = signed > 0 ? spend / signed : 0;

      setResults({ revenue, roi, booked, signed, cpl, cac });
    } else {
      setResults(null);
    }
  }, [adSpend, leads, bookingRate, closeRate, avgTicket]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Ad Spend ($)</label>
          <input
            type="number"
            value={adSpend}
            onChange={(e) => setAdSpend(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Leads Generated</label>
          <input
            type="number"
            value={leads}
            onChange={(e) => setLeads(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">CSR Booking Rate (%)</label>
          <input
            type="number"
            value={bookingRate}
            onChange={(e) => setBookingRate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Tech Close Rate (%)</label>
          <input
            type="number"
            value={closeRate}
            onChange={(e) => setCloseRate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Ticket Size ($)</label>
          <input
            type="number"
            value={avgTicket}
            onChange={(e) => setAvgTicket(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-4">
           <div className="glass-card p-6 text-center border-t-4 border-t-[#E8C677]">
            <div className="text-sm text-white/60 mb-1">Generated Revenue</div>
            <div className="text-3xl font-bold text-[#E8C677]">{formatCurrency(results.revenue)}</div>
            <div className="text-xs text-white/50 mt-2">from {Math.round(results.signed)} signed jobs</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-green-500">
            <div className="text-sm text-white/60 mb-1">Total Return on Ad Spend (ROAS)</div>
            <div className="text-4xl font-black text-green-400">{results.roi.toFixed(0)}%</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
            <div className="text-sm text-white/60 mb-1">Cost Per Acquisition (CAC)</div>
            <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.cac)}</div>
            <div className="text-xs text-white/50 mt-2">CPL: {formatCurrency(results.cpl)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
