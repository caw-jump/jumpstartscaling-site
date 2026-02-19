import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function UnemploymentImpactSimulator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('5000');
  const [savings, setSavings] = useState<string>('25000');
  const [duration, setDuration] = useState<string>('3');
  const [results, setResults] = useState<{ runway: number; drain: number; remaining: number } | null>(null);

  useEffect(() => {
    const exp = Number(monthlyExpenses) || 0;
    const sav = Number(savings) || 0;
    const dur = Number(duration) || 0;
    if (exp > 0) {
      const drain = exp * dur;
      const remaining = Math.max(0, sav - drain);
      const runway = sav / exp;
      setResults({ runway, drain, remaining });
    } else {
      setResults(null);
    }
  }, [monthlyExpenses, savings, duration]);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Expenses ($)</label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Savings ($)</label>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Jobless Duration (mo)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Runway</div>
            <div className="text-2xl font-bold text-accent">{results.runway.toFixed(1)} months</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Savings Drain</div>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(results.drain)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Remaining</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.remaining)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
