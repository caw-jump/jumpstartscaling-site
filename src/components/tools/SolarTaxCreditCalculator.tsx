import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SolarTaxCreditCalculator() {
  const [systemCost, setSystemCost] = useState<string>('30000');
  const [stateTier, setStateTier] = useState<string>('average'); 

  const [results, setResults] = useState<{
    federalItc: number;
    stateRebate: number;
    totalIncentives: number;
    netCost: number;
  } | null>(null);

  useEffect(() => {
    const cost = Number(systemCost) || 0;

    if (cost > 0) {
      // 2026 Federal ITC is 30% under IRA
      const federalItc = cost * 0.30;
      
      let stateRebate = 0;
      // Rough generalizations for logic:
      if (stateTier === 'high') {
         stateRebate = Math.min(cost * 0.25, 5000); // e.g. NY, IL
      } else if (stateTier === 'average') {
         stateRebate = Math.min(cost * 0.10, 1000); // e.g. mass, MD
      } else {
         stateRebate = 0; // null states like FL, TX (no direct state tax credit, relies on property tax exemptions)
      }

      setResults({
        federalItc,
        stateRebate,
        totalIncentives: federalItc + stateRebate,
        netCost: Math.max(0, cost - federalItc - stateRebate)
      });
    } else {
      setResults(null);
    }
  }, [systemCost, stateTier]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total System Invoice Cost</label>
          <input type="number" value={systemCost} onChange={(e) => setSystemCost(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">State Tax Credit Tier</label>
          <select value={stateTier} onChange={(e) => setStateTier(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="high">High Tier (NY, IL, SC, MA - up to $5k avg)</option>
            <option value="average">Standard Tier (MD, UT - flat $1k cap)</option>
            <option value="none">No Direct State Credit (TX, FL, CA)</option>
          </select>
          <p className="text-xs text-white/50 mt-1">Check the DSIRE database for your exact ZIP.</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-t-4 border-t-blue-500">
               <div className="text-sm text-white/60 mb-2">Federal ITC (30%)</div>
               <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.federalItc)}</div>
               <div className="text-xs text-white/50 mt-2">Dollar-for-dollar reduction of federal income tax liability.</div>
            </div>
            
            <div className="glass-card p-6 border-t-4 border-t-green-500">
               <div className="text-sm text-white/60 mb-2">State Tax Credit Est.</div>
               <div className="text-3xl font-bold text-green-400">{formatCurrency(results.stateRebate)}</div>
               <div className="text-xs text-white/50 mt-2">Capped based on state treasury budgets.</div>
            </div>
          </div>

          <div className="glass-card p-8 border-t-4 border-t-[#E8C677] text-center flex flex-col items-center">
             <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Final Net System Cost</div>
             <div className="text-5xl font-black text-[#E8C677] mb-2">{formatCurrency(results.netCost)}</div>
             <div className="text-white/60 text-sm mt-2 border-t border-white/10 pt-4 w-full max-w-sm">
                Total Incentives Deducted: <strong>{formatCurrency(results.totalIncentives)}</strong>
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
