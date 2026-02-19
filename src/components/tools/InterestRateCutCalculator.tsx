import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InterestRateCutCalculator() {
  const [principal, setPrincipal] = useState<string>('400000');
  const [currentRate, setCurrentRate] = useState<string>('7');
  const [newRate, setNewRate] = useState<string>('6');
  const [termYears, setTermYears] = useState<string>('30');
  const [results, setResults] = useState<{ currentPayment: number; newPayment: number; savings: number } | null>(null);

  useEffect(() => {
    const P = Number(principal) || 0;
    const r1 = Number(currentRate) / 100 / 12;
    const r2 = Number(newRate) / 100 / 12;
    const n = Number(termYears) * 12;
    if (P > 0 && n > 0 && (r1 > 0 || r2 > 0)) {
      const pmt = (p: number, r: number) => (r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const currentPayment = pmt(P, r1);
      const newPayment = pmt(P, r2);
      const savings = (currentPayment - newPayment) * n;
      setResults({ currentPayment, newPayment, savings });
    } else {
      setResults(null);
    }
  }, [principal, currentRate, newRate, termYears]);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full">
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Principal ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Current Rate %</label>
          <input
            type="number"
            value={currentRate}
            onChange={(e) => setCurrentRate(e.target.value)}
            step="0.25"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">New Rate %</label>
          <input
            type="number"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            step="0.25"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Term (years)</label>
          <input
            type="number"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Current Payment</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.currentPayment)}/mo</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">New Payment</div>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(results.newPayment)}/mo</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Lifetime Savings</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.savings)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
