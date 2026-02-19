import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LaborDisputeRiskAnalyzer() {
  const [salary, setSalary] = useState<string>('5000000');
  const [cap, setCap] = useState<string>('250000000');
  const [playerCount, setPlayerCount] = useState<string>('30');
  const [strikeDays, setStrikeDays] = useState<string>('30');
  const [results, setResults] = useState<{ shareOfCap: number; lostPerDay: number; totalLost: number } | null>(null);

  useEffect(() => {
    const sal = Number(salary) || 0;
    const c = Number(cap) || 0;
    const n = Number(playerCount) || 0;
    const days = Number(strikeDays) || 0;
    if (c > 0 && n > 0) {
      const shareOfCap = (sal / c) * 100;
      const lostPerDay = (sal / 365) * (days / 30);
      const totalLost = (sal / 365) * days;
      setResults({ shareOfCap, lostPerDay, totalLost });
    } else {
      setResults(null);
    }
  }, [salary, cap, playerCount, strikeDays]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Player Salary ($)</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Salary Cap ($)</label>
          <input
            type="number"
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Roster Size</label>
          <input
            type="number"
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Strike Duration (days)</label>
          <input
            type="number"
            value={strikeDays}
            onChange={(e) => setStrikeDays(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Share of Cap</div>
            <div className="text-2xl font-bold text-accent">{results.shareOfCap.toFixed(2)}%</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Lost Per Day</div>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(results.lostPerDay)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Total Lost (Strike)</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.totalLost)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
