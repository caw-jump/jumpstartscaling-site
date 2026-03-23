import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RoofingInsuranceClaimEstimator() {
  const [replacementCost, setReplacementCost] = useState<string>('15000');
  const [deductible, setDeductible] = useState<string>('2000');
  const [depreciationPercent, setDepreciationPercent] = useState<string>('30');
  const [policyType, setPolicyType] = useState<string>('RCV'); // RCV or ACV

  const [results, setResults] = useState<{
    acv: number;
    initialCheck: number;
    recoverableDepreciation: number;
    totalOutofPocket: number;
    finalPayout: number;
  } | null>(null);

  useEffect(() => {
    const rcv = Number(replacementCost) || 0;
    const ded = Number(deductible) || 0;
    const dep = Number(depreciationPercent) || 0;

    if (rcv > 0) {
      const depreciationAmount = rcv * (dep / 100);
      const acv = rcv - depreciationAmount; // Actual Cash Value
      const initialCheck = Math.max(0, acv - ded);
      
      let recoverable = 0;
      let outOfPocket = ded;
      let totalPayout = initialCheck;

      if (policyType === 'RCV') {
        recoverable = depreciationAmount;
        totalPayout += recoverable;
      } else {
        // Under ACV policy, depreciation is NOT recoverable
        outOfPocket += depreciationAmount;
      }
      
      setResults({
        acv,
        initialCheck,
        recoverableDepreciation: recoverable,
        totalOutofPocket: Math.max(0, outOfPocket), // Can't be negative
        finalPayout: Math.max(0, totalPayout)
      });
    } else {
      setResults(null);
    }
  }, [replacementCost, deductible, depreciationPercent, policyType]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Replacement Cost Value (RCV)</label>
          <input type="number" value={replacementCost} onChange={(e) => setReplacementCost(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Total repair invoice from contractor</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Insurance Deductible</label>
          <input type="number" value={deductible} onChange={(e) => setDeductible(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Your fixed out-of-pocket obligation</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Estimated Depreciation (%)</label>
          <input type="number" value={depreciationPercent} onChange={(e) => setDepreciationPercent(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Higher for older roofs</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Insurance Policy Type</label>
          <select value={policyType} onChange={(e) => setPolicyType(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="RCV">Replacement Cost Value (RCV)</option>
            <option value="ACV">Actual Cash Value (ACV)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-t-4 border-t-yellow-500">
             <div className="text-sm text-white/60 mb-1">Check #1: Initial Payout</div>
             <div className="text-3xl font-bold text-yellow-400 mb-4">{formatCurrency(results.initialCheck)}</div>
             <div className="text-xs text-white/40 leading-relaxed border-t border-white/10 pt-3">
               (Actual Cash Value - Deductible). This is the first check the adjuster sends you to start work.
             </div>
          </div>

          <div className={`glass-card p-6 border-t-4 ${policyType === 'RCV' ? 'border-t-green-500' : 'border-t-gray-600 opacity-70'}`}>
             <div className="text-sm text-white/60 mb-1">Check #2: Recoverable Depreciation</div>
             <div className={`text-3xl font-bold ${policyType === 'RCV' ? 'text-green-400' : 'text-gray-400'} mb-4`}>
                {formatCurrency(results.recoverableDepreciation)}
             </div>
             <div className="text-xs text-white/40 leading-relaxed border-t border-white/10 pt-3">
               {policyType === 'RCV' 
                 ? "Held back until you prove repairs are complete. Once completed, your insurance releases this."
                 : "⚠️ ACV Policies DO NOT pay you back for depreciation. You lose this money."}
             </div>
          </div>

          <div className="md:col-span-2 glass-card p-8 border-t-4 border-t-indigo-500 text-center flex flex-col md:flex-row justify-around items-center">
             <div className="mb-4 md:mb-0">
               <div className="text-sm text-white/60 mb-1">Total Authorized Payout</div>
               <div className="text-4xl font-black text-indigo-400">{formatCurrency(results.finalPayout)}</div>
             </div>
             <div className="hidden md:block w-px h-16 bg-white/10"></div>
             <div>
               <div className="text-sm text-white/60 mb-1">Your Total Out of Pocket</div>
               <div className="text-4xl font-black text-red-400">{formatCurrency(results.totalOutofPocket)}</div>
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
