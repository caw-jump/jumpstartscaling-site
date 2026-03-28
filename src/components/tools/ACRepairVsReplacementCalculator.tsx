import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ACRepairVsReplacementCalculator() {
  const [repairCost, setRepairCost] = useState<string>('850');
  const [unitAge, setUnitAge] = useState<string>('12');
  const [replacementCost, setReplacementCost] = useState<string>('6500'); 

  const [results, setResults] = useState<{
    score: number;
    verdict: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const repair = Number(repairCost) || 0;
    const age = Number(unitAge) || 0;
    const replacement = Number(replacementCost) || 0;

    if (repair > 0 && age > 0) {
      // Industry standard "Rule of 5000"
      const score = repair * age;
      
      let verdict = '';
      let description = '';

      if (score > 5000 || repair >= replacement / 2) {
        verdict = 'REPLACE';
        description = `Your repair-age score (${score.toLocaleString()}) eclipses the $5,000 threshold. Plumping ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(repair)} into a ${age}-year-old unit is throwing good money after bad. Cut your losses and invest in a new, efficient system under warranty.`;
      } else if (score > 3500) {
        verdict = 'CAUTION';
        description = `You are entering the danger zone. Your unit is aging, and while this repair (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(repair)}) might keep it alive, you should start heavily budgeting for a full replacement within 1-2 years.`;
      } else {
        verdict = 'REPAIR';
        description = `The math favors repairing here. Your unit is young enough or the repair is cheap enough that replacing the entire system is an overreaction. Fix the part and keep cooling.`;
      }

      setResults({ score, verdict, description });
    } else {
      setResults(null);
    }
  }, [repairCost, unitAge, replacementCost]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Quoted Repair Cost</label>
          <input type="number" value={repairCost} onChange={(e) => setRepairCost(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Age of AC Unit (Years)</label>
          <input type="number" value={unitAge} onChange={(e) => setUnitAge(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-2">Estimated Cost of Full Replacement (Optional)</label>
          <input type="number" value={replacementCost} onChange={(e) => setReplacementCost(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">If the repair is more than 50% of the cost of a new unit, replacement is automatic.</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl border-t-8
              ${results.verdict === 'REPAIR' ? 'bg-green-600/10 border-green-500' : ''}
              ${results.verdict === 'CAUTION' ? 'bg-yellow-600/10 border-yellow-500' : ''}
              ${results.verdict === 'REPLACE' ? 'bg-red-600/10 border-red-500' : ''}
          `}>
             <div className="text-sm font-bold tracking-widest uppercase text-white/50 mb-2">Diagnostic Verdict</div>
             <div className={`text-6xl font-black mb-6 tracking-tight
                ${results.verdict === 'REPAIR' ? 'text-green-400' : ''}
                ${results.verdict === 'CAUTION' ? 'text-yellow-400' : ''}
                ${results.verdict === 'REPLACE' ? 'text-red-400' : ''}
             `}>
               {results.verdict}
             </div>
             
             <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
               {results.description}
             </p>
          </div>
          
          <div className="text-center text-xs text-white/40 font-mono">
            Debug: Calculated Output Score = {results.score.toLocaleString()} (Threshold over 5000 triggers replacement status)
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
