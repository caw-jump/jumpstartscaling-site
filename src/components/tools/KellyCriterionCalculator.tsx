import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function KellyCriterionCalculator() {
  const [winProbability, setWinProbability] = useState<string>('55');
  const [avgWin, setAvgWin] = useState<string>('1500');
  const [avgLoss, setAvgLoss] = useState<string>('1000');

  const [results, setResults] = useState<{ kellyPercent: number; isNegative: boolean } | null>(null);

  useEffect(() => {
    const wPercent = Number(winProbability) || 0;
    const win$ = Number(avgWin) || 0;
    const loss$ = Number(avgLoss) || 0;

    if (wPercent > 0 && win$ > 0 && loss$ > 0) {
      const W = wPercent / 100;
      const R = win$ / loss$; // win/loss ratio
      
      const k = W - ((1 - W) / R);
      
      const isNegative = k <= 0;
      setResults({ kellyPercent: Math.abs(k * 100), isNegative });
    } else {
      setResults(null);
    }
  }, [winProbability, avgWin, avgLoss]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Historical Win Probability (%)</label>
          <input type="number" value={winProbability} onChange={(e) => setWinProbability(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Win Amount ($)</label>
          <input type="number" value={avgWin} onChange={(e) => setAvgWin(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Loss Amount ($)</label>
          <input type="number" value={avgLoss} onChange={(e) => setAvgLoss(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
          <div className={`glass-card p-8 border-t-4 max-w-lg w-full text-center ${results.isNegative ? 'border-t-red-500' : 'border-t-[#E8C677]'}`}>
            {!results.isNegative ? (
              <>
                 <div className="text-sm text-white/60 mb-2">Optimal Capital Allocation per Trade</div>
                 <div className="text-5xl font-black gradient-text">{results.kellyPercent.toFixed(2)}%</div>
                 <div className="text-xs text-white/50 mt-4 leading-relaxed">
                   Based on your edge, the Kelly Criterion indicates allocating exactly {results.kellyPercent.toFixed(2)}% of your available bankroll to maximize long-term portfolio growth without risking total ruin. Some traders prefer "Half-Kelly" ({ (results.kellyPercent / 2).toFixed(2) }%) to decrease volatility.
                 </div>
              </>
            ) : (
                <>
                 <div className="text-sm text-white/60 mb-2">No Mathematical Edge</div>
                 <div className="text-4xl font-black text-red-500">Do Not Trade</div>
                 <div className="text-xs text-white/50 mt-4 px-4 leading-relaxed">
                   Your Win Ratio and Expected Payoff generate a negative expected value. The Kelly Criterion strongly recommends $0 allocation to this strategy.
                 </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
