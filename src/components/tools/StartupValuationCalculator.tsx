import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StartupValuationCalculator() {
  const [revenue, setRevenue] = useState<string>('10000000');
  const [multiple, setMultiple] = useState<string>('12');
  const [roundSize, setRoundSize] = useState<string>('5000000');
  const [results, setResults] = useState<{ preMoney: number; postMoney: number; dilution: number } | null>(null);

  useEffect(() => {
    const rev = Number(revenue) || 0;
    const mult = Number(multiple) || 0;
    const round = Number(roundSize) || 0;
    if (rev > 0 && mult > 0) {
      const preMoney = rev * mult;
      const postMoney = preMoney + round;
      const dilution = round > 0 ? (round / postMoney) * 100 : 0;
      setResults({ preMoney, postMoney, dilution });
    } else {
      setResults(null);
    }
  }, [revenue, multiple, roundSize]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Revenue (ARR $)</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="e.g., 10000000"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Valuation Multiple (x)</label>
          <input
            type="number"
            value={multiple}
            onChange={(e) => setMultiple(e.target.value)}
            placeholder="e.g., 12"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Round Size ($)</label>
          <input
            type="number"
            value={roundSize}
            onChange={(e) => setRoundSize(e.target.value)}
            placeholder="e.g., 5000000"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Pre-Money</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.preMoney)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Post-Money</div>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(results.postMoney)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Dilution</div>
            <div className="text-2xl font-bold text-accent">{results.dilution.toFixed(1)}%</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
