import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GreenLeadsROICalculator() {
  const [outboundVolume, setOutboundVolume] = useState<string>('5000');
  const [connectRate, setConnectRate] = useState<string>('5');
  const [meetingSetRate, setMeetingSetRate] = useState<string>('15');
  const [showRate, setShowRate] = useState<string>('70');
  const [closeRate, setCloseRate] = useState<string>('20');
  const [dealSize, setDealSize] = useState<string>('8000');

  const [results, setResults] = useState<{ connects: number; booked: number; showed: number; closed: number; revenue: number } | null>(null);

  useEffect(() => {
    const vol = Number(outboundVolume) || 0;
    const cr = Number(connectRate) || 0;
    const msr = Number(meetingSetRate) || 0;
    const sr = Number(showRate) || 0;
    const clr = Number(closeRate) || 0;
    const deal = Number(dealSize) || 0;

    if (vol > 0 && cr > 0 && msr > 0 && deal > 0) {
      const connects = vol * (cr / 100);
      const booked = connects * (msr / 100);
      const showed = booked * (sr / 100);
      const closed = showed * (clr / 100);
      const revenue = closed * deal;
      
      setResults({ connects, booked, showed, closed, revenue });
    } else {
      setResults(null);
    }
  }, [outboundVolume, connectRate, meetingSetRate, showRate, closeRate, dealSize]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Outbound Volume</label>
          <input type="number" value={outboundVolume} onChange={(e) => setOutboundVolume(e.target.value)} placeholder="Emails, SMS, Dials" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Connect/Reply Rate (%)</label>
          <input type="number" value={connectRate} onChange={(e) => setConnectRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Meeting Set Rate (%)</label>
          <input type="number" value={meetingSetRate} onChange={(e) => setMeetingSetRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Meeting Show Rate (%)</label>
          <input type="number" value={showRate} onChange={(e) => setShowRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Sales Close Rate (%)</label>
          <input type="number" value={closeRate} onChange={(e) => setCloseRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Deal Size ($)</label>
          <input type="number" value={dealSize} onChange={(e) => setDealSize(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 text-center border-t-2 border-t-white/30">
            <div className="text-xs text-white/60 mb-1">Replies / Connects</div>
            <div className="text-2xl font-bold">{Math.round(results.connects)}</div>
          </div>
          <div className="glass-card p-4 text-center border-t-2 border-t-blue-500">
            <div className="text-xs text-white/60 mb-1">Booked Meetings</div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(results.booked)}</div>
          </div>
          <div className="glass-card p-4 text-center border-t-2 border-t-[#E8C677]">
            <div className="text-xs text-white/60 mb-1">Showed up</div>
            <div className="text-2xl font-bold text-[#E8C677]">{Math.round(results.showed)}</div>
          </div>
          <div className="glass-card p-4 text-center border-t-2 border-t-green-500">
            <div className="text-xs text-white/60 mb-1">Closed Won</div>
            <div className="text-2xl font-bold text-green-400">{Math.round(results.closed)}</div>
          </div>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="glass-card p-8 text-center border-t-4 border-t-green-500">
            <div className="text-sm text-white/60 mb-2">Total Generated Revenue Pipeline</div>
            <div className="text-5xl font-black text-green-400">{formatCurrency(results.revenue)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
