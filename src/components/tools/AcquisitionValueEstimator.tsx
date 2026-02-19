import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AcquisitionValueEstimator() {
  const [revenue, setRevenue] = useState<string>('100');
  const [multiple, setMultiple] = useState<string>('12');
  const [synergies, setSynergies] = useState<string>('15');
  const [results, setResults] = useState<{ baseValue: number; adjustedValue: number } | null>(null);

  useEffect(() => {
    const rev = Number(revenue) * 1e6;
    const mult = Number(multiple) || 0;
    const syn = Number(synergies) / 100 || 0;
    if (rev > 0 && mult > 0) {
      const baseValue = rev * mult;
      const adjustedValue = baseValue * (1 + syn);
      setResults({ baseValue, adjustedValue });
    } else {
      setResults(null);
    }
  }, [revenue, multiple, synergies]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Target Revenue ($M)</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Valuation Multiple (x)</label>
          <input
            type="number"
            value={multiple}
            onChange={(e) => setMultiple(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Synergy Premium %</label>
          <input
            type="number"
            value={synergies}
            onChange={(e) => setSynergies(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Base Fair Value</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.baseValue)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">With Synergies</div>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(results.adjustedValue)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
