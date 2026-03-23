import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ImpermanentLossCalculator() {
  const [initialPriceA, setInitialPriceA] = useState<string>('1.00');
  const [newPriceA, setNewPriceA] = useState<string>('2.00');
  
  const [initialPriceB, setInitialPriceB] = useState<string>('100.00');
  const [newPriceB, setNewPriceB] = useState<string>('100.00');

  const [result, setResult] = useState<{ lossPercentage: number; kRatio: number } | null>(null);

  useEffect(() => {
    const ipA = Number(initialPriceA) || 0;
    const npA = Number(newPriceA) || 0;
    const ipB = Number(initialPriceB) || 0;
    const npB = Number(newPriceB) || 0;

    if (ipA > 0 && npA > 0 && ipB > 0 && npB > 0) {
      // ratio of prices
      const ratioA = npA / ipA;
      const ratioB = npB / ipB;
      const k = ratioA / ratioB;

      // IL = (2 * sqrt(k) / (1 + k)) - 1
      const il = (2 * Math.sqrt(k)) / (1 + k) - 1;
      setResult({ lossPercentage: Math.abs(il * 100), kRatio: k });
    } else {
      setResult(null);
    }
  }, [initialPriceA, newPriceA, initialPriceB, newPriceB]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-[#E8C677]">Token A (e.g., ALT)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/95 mb-1">Initial Price ($)</label>
              <input
                type="number"
                value={initialPriceA}
                onChange={(e) => setInitialPriceA(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/95 mb-1">New/Future Price ($)</label>
              <input
                type="number"
                value={newPriceA}
                onChange={(e) => setNewPriceA(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-[#E8C677]">Token B (e.g., SOL or USDC)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/95 mb-1">Initial Price ($)</label>
              <input
                type="number"
                value={initialPriceB}
                onChange={(e) => setInitialPriceB(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/95 mb-1">New/Future Price ($)</label>
              <input
                type="number"
                value={newPriceB}
                onChange={(e) => setNewPriceB(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
          <div className="glass-card p-8 text-center border-t-4 border-t-red-500 min-w-[300px]">
            <div className="text-sm text-white/60 mb-2">Impermanent Loss vs Holding</div>
            <div className="text-5xl font-black text-red-400">-{result.lossPercentage.toFixed(2)}%</div>
            <div className="text-xs text-white/40 mt-4">Price Divergence Ratio (k): {result.kRatio.toFixed(3)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
