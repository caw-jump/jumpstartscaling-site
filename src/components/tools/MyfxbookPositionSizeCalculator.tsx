import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MyfxbookPositionSizeCalculator() {
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [pipValue, setPipValue] = useState<string>('10'); // standard lot pip value for EUR/USD roughly
  
  const [result, setResult] = useState<{ lotSize: number; riskAmount: number } | null>(null);

  useEffect(() => {
    const bal = Number(accountBalance) || 0;
    const risk = Number(riskPercent) || 0;
    const sl = Number(stopLossPips) || 0;
    const pv = Number(pipValue) || 0;

    if (bal > 0 && risk > 0 && sl > 0 && pv > 0) {
      const riskAmount = bal * (risk / 100);
      const lotSize = riskAmount / (sl * pv);
      setResult({ lotSize, riskAmount });
    } else {
      setResult(null);
    }
  }, [accountBalance, riskPercent, stopLossPips, pipValue]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Account Balance ($)</label>
          <input
            type="number"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Risk (%)</label>
          <input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Stop Loss (Pips)</label>
          <input
            type="number"
            value={stopLossPips}
            onChange={(e) => setStopLossPips(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Pip Value ($ per Std. Lot)</label>
          <input
            type="number"
            value={pipValue}
            onChange={(e) => setPipValue(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-4">
           <div className="glass-card p-6 text-center border-t-4 border-t-red-500">
            <div className="text-sm text-white/60 mb-1">Amount at Risk</div>
            <div className="text-3xl font-bold text-red-400">{formatCurrency(result.riskAmount)}</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-[#E8C677]">
            <div className="text-sm text-white/60 mb-1">Recommended Lot Size (Standard)</div>
            <div className="text-4xl font-black gradient-text">{result.lotSize.toFixed(4)} Lots</div>
            <div className="text-xs text-white/50 mt-2">Mini: {(result.lotSize * 10).toFixed(2)} | Micro: {(result.lotSize * 100).toFixed(2)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
