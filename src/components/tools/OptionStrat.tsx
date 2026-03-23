import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OptionStrat() {
  const [stockPrice, setStockPrice] = useState<string>('150');
  const [iv, setIv] = useState<string>('45');
  const [dte, setDte] = useState<string>('30');
  const [results, setResults] = useState<{ expectedMove: number; upperBound: number; lowerBound: number } | null>(null);

  useEffect(() => {
    const s = Number(stockPrice) || 0;
    const v = Number(iv) || 0;
    const d = Number(dte) || 0;

    if (s > 0 && v > 0 && d > 0) {
      const move = s * (v / 100) * Math.sqrt(d / 365);
      setResults({
        expectedMove: move,
        upperBound: s + move,
        lowerBound: s - move,
      });
    } else {
      setResults(null);
    }
  }, [stockPrice, iv, dte]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Current Stock Price ($)</label>
          <input
            type="number"
            value={stockPrice}
            onChange={(e) => setStockPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Implied Volatility (IV %)</label>
          <div className="flex gap-4 items-center">
             <input
              type="number"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
            />
            <input
              type="range"
              min="1"
              max="300"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              className="flex-1 accent-accent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Days to Expiration</label>
          <input
            type="number"
            value={dte}
            onChange={(e) => setDte(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-4">
           <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
            <div className="text-sm text-white/60 mb-1">Expected Move (+/-)</div>
            <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.expectedMove)}</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-green-500">
            <div className="text-sm text-white/60 mb-1">Expected Upper Bound</div>
            <div className="text-3xl font-bold text-green-400">{formatCurrency(results.upperBound)}</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-red-500">
            <div className="text-sm text-white/60 mb-1">Expected Lower Bound</div>
            <div className="text-3xl font-bold text-red-400">{formatCurrency(results.lowerBound)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
