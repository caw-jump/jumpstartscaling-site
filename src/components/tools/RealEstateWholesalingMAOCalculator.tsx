import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RealEstateWholesalingMAOCalculator() {
  const [arv, setArv] = useState<string>('300000');
  const [repairs, setRepairs] = useState<string>('40000');
  const [assignmentFee, setAssignmentFee] = useState<string>('15000');

  const [results, setResults] = useState<{ mao: number; investorMargin: number } | null>(null);

  useEffect(() => {
    const afterRepair = Number(arv) || 0;
    const estRepairs = Number(repairs) || 0;
    const targetFee = Number(assignmentFee) || 0;

    if (afterRepair > 0) {
      const seventyPercent = afterRepair * 0.70;
      const mao = seventyPercent - estRepairs - targetFee;
      
      const investorMargin = afterRepair * 0.30; // The 30% built-in for the end flipper (holding, closing, profit)
      
      setResults({ mao, investorMargin });
    } else {
      setResults(null);
    }
  }, [arv, repairs, assignmentFee]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">After Repair Value (ARV) ($)</label>
          <input type="number" value={arv} onChange={(e) => setArv(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Estimated Rehab Repairs ($)</label>
          <input type="number" value={repairs} onChange={(e) => setRepairs(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Your Assignment Fee ($)</label>
          <input type="number" value={assignmentFee} onChange={(e) => setAssignmentFee(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-6 text-center border-t-4 border-t-green-500">
            <div className="text-sm text-white/60 mb-2">Maximum Allowable Offer (MAO)</div>
            <div className="text-5xl font-black text-green-400">{formatCurrency(results.mao)}</div>
            <div className="text-xs text-white/50 mt-4 leading-relaxed">
              If you put the house under contract for exactly <strong>{formatCurrency(results.mao)}</strong>, you can assign it for <strong>{formatCurrency(Number(assignmentFee))}</strong>, and the flipper buys it for <strong>{formatCurrency(results.mao + Number(assignmentFee))}</strong>.
            </div>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-blue-500 flex flex-col justify-center">
            <div className="text-sm text-white/60 mb-2 text-center">Flipper's 30% Buffer Breakdown</div>
            <ul className="space-y-3 mt-2 text-white/80">
               <li className="flex justify-between border-b border-white/10 pb-2">
                 <span>Gross Spread vs ARV:</span>
                 <span className="font-bold">{formatCurrency(results.investorMargin)}</span>
               </li>
               <li className="text-xs text-white/50 leading-snug">
                 *This 30% spread must cover the cash buyer's holding costs (hard money loans), buying/selling closing costs, realtor commissions upon sale, and their desired net profit.
               </li>
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
