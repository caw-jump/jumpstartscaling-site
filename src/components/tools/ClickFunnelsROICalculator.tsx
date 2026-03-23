import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ClickFunnelsROICalculator() {
  const [cpa, setCpa] = useState<string>('50');
  const [frontendPrice, setFrontendPrice] = useState<string>('27');
  const [bumpPrice, setBumpPrice] = useState<string>('17');
  const [bumpTake, setBumpTake] = useState<string>('20');
  const [otoPrice, setOtoPrice] = useState<string>('197');
  const [otoTake, setOtoTake] = useState<string>('10');

  const [results, setResults] = useState<{ acv: number; roi: number; grossProfit: number } | null>(null);

  useEffect(() => {
    const cost = Number(cpa) || 0;
    const fe = Number(frontendPrice) || 0;
    const bp = Number(bumpPrice) || 0;
    const bt = Number(bumpTake) || 0;
    const op = Number(otoPrice) || 0;
    const ot = Number(otoTake) || 0;

    if (cost > 0 && fe > 0) {
      const bumpValue = bp * (bt / 100);
      const otoValue = op * (ot / 100);
      const acv = fe + bumpValue + otoValue;
      
      const grossProfit = acv - cost;
      const roi = (grossProfit / cost) * 100;
      
      setResults({ acv, roi, grossProfit });
    } else {
      setResults(null);
    }
  }, [cpa, frontendPrice, bumpPrice, bumpTake, otoPrice, otoTake]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-white/95 mb-2">Cost Per Acquisition (CPA) ($)</label>
          <input
            type="number"
            value={cpa}
            onChange={(e) => setCpa(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white border-blue-500/50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Front-End Offer Price ($)</label>
          <input
            type="number"
            value={frontendPrice}
            onChange={(e) => setFrontendPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Order Bump Price ($)</label>
          <input
            type="number"
            value={bumpPrice}
            onChange={(e) => setBumpPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Bump Take Rate (%)</label>
          <input
            type="number"
            value={bumpTake}
            onChange={(e) => setBumpTake(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Upsell (OTO) Price ($)</label>
          <input
            type="number"
            value={otoPrice}
            onChange={(e) => setOtoPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Upsell Take Rate (%)</label>
          <input
            type="number"
            value={otoTake}
            onChange={(e) => setOtoTake(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
            <div className="text-sm text-white/60 mb-1">Average Cart Value (ACV)</div>
            <div className="text-4xl font-black text-blue-400">{formatCurrency(results.acv)}</div>
            <div className="text-xs text-white/50 mt-2">Before deductions</div>
          </div>
          <div className={`glass-card p-6 text-center border-t-4 ${results.roi >= 0 ? 'border-t-green-500' : 'border-t-red-500'}`}>
            <div className="text-sm text-white/60 mb-1">Funnel ROI (Day 1)</div>
            <div className={`text-4xl font-black ${results.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {results.roi.toFixed(1)}%
            </div>
            <div className="text-xs text-white/50 mt-2">Net Profit per Buyer: {formatCurrency(results.grossProfit)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
