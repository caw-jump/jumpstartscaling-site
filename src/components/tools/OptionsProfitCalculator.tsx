import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const cdf = (x: number): number => {
  let sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);
  let t = 1.0 / (1.0 + 0.3275911 * x);
  let y =
    1.0 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
      t) *
      Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
};

export default function OptionsProfitCalculator() {
  const [stockPrice, setStockPrice] = useState<string>('150');
  const [strikePrice, setStrikePrice] = useState<string>('155');
  const [dte, setDte] = useState<string>('30');
  const [volatility, setVolatility] = useState<string>('25');
  const [riskFreeRate, setRiskFreeRate] = useState<string>('5');
  
  const [results, setResults] = useState<{ call: number; put: number } | null>(null);

  useEffect(() => {
    const S = Number(stockPrice) || 0;
    const K = Number(strikePrice) || 0;
    const tDays = Number(dte) || 0;
    const vLine = Number(volatility) || 0;
    const rLine = Number(riskFreeRate) || 0;

    if (S > 0 && K > 0 && tDays > 0 && vLine > 0) {
      const T = tDays / 365.0; // Time in years
      const v = vLine / 100.0;
      const r = rLine / 100.0;

      const d1 = (Math.log(S / K) + (r + (v * v) / 2) * T) / (v * Math.sqrt(T));
      const d2 = d1 - v * Math.sqrt(T);

      const callPrice = S * cdf(d1) - K * Math.exp(-r * T) * cdf(d2);
      const putPrice = K * Math.exp(-r * T) * cdf(-d2) - S * cdf(-d1);

      setResults({ call: callPrice, put: putPrice });
    } else {
      setResults(null);
    }
  }, [stockPrice, strikePrice, dte, volatility, riskFreeRate]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Stock Price ($)</label>
          <input
            type="number"
            value={stockPrice}
            onChange={(e) => setStockPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Strike Price ($)</label>
          <input
            type="number"
            value={strikePrice}
            onChange={(e) => setStrikePrice(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
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
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Implied Volatility (%)</label>
          <input
            type="number"
            value={volatility}
            onChange={(e) => setVolatility(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Risk-Free Rate (%)</label>
          <input
            type="number"
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-6 text-center shadow-lg border-t-4 border-t-green-500">
            <div className="text-sm text-white/60 mb-1">Theoretical Call Price</div>
            <div className="text-4xl font-black text-green-400">{formatCurrency(results.call)}</div>
          </div>
          <div className="glass-card p-6 text-center shadow-lg border-t-4 border-t-red-500">
            <div className="text-sm text-white/60 mb-1">Theoretical Put Price</div>
            <div className="text-4xl font-black text-red-400">{formatCurrency(results.put)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
