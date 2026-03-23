import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MetalVsShingleCostCalculator() {
  const [squareFootage, setSquareFootage] = useState<string>('2000');
  const [yearsInHome, setYearsInHome] = useState<string>('30');
  
  const [results, setResults] = useState<{
    shingleInitial: number;
    shingleReplacements: number;
    shingleTotal: number;
    metalInitial: number;
    metalReplacements: number;
    metalTotal: number;
    winner: string;
    savings: number;
  } | null>(null);

  useEffect(() => {
    const sqft = Number(squareFootage) || 0;
    const years = Number(yearsInHome) || 0;

    if (sqft > 0 && years > 0) {
      // Shingle Profile
      const shingleInitial = sqft * 5.50; // $5.50 / sqft
      const shingleLifespan = 15;
      const shingleReplacementCycles = Math.floor(years / shingleLifespan);
      // factoring 3% annual inflation rough estimate for future replacements
      let shingleTotal = shingleInitial;
      for (let i = 1; i <= shingleReplacementCycles; i++) {
        const futureCostMultiplier = Math.pow(1.03, shingleLifespan * i);
        shingleTotal += (shingleInitial * futureCostMultiplier);
      }

      // Metal Profile
      const metalInitial = sqft * 12.00; // $12.00 / sqft
      const metalLifespan = 50;
      const metalReplacementCycles = Math.floor(years / metalLifespan);
      let metalTotal = metalInitial;
      for (let i = 1; i <= metalReplacementCycles; i++) {
        const futureCostMultiplier = Math.pow(1.03, metalLifespan * i);
        metalTotal += (metalInitial * futureCostMultiplier);
      }

      const winner = shingleTotal < metalTotal ? 'Asphalt Shingle' : 'Standing Seam Metal';
      const savings = Math.abs(shingleTotal - metalTotal);

      setResults({
        shingleInitial,
        shingleReplacements: shingleReplacementCycles,
        shingleTotal,
        metalInitial,
        metalReplacements: metalReplacementCycles,
        metalTotal,
        winner,
        savings
      });
    } else {
      setResults(null);
    }
  }, [squareFootage, yearsInHome]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Roof Square Footage</label>
          <input type="number" value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Planned Years in Home</label>
          <input type="number" value={yearsInHome} onChange={(e) => setYearsInHome(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`glass-card p-6 border-t-4 ${results.winner === 'Asphalt Shingle' ? 'border-t-green-500' : 'border-t-gray-600'}`}>
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Asphalt Shingle</h3>
                 <span className="text-xs bg-white/10 px-2 py-1 rounded">Lasts ~15 Yrs</span>
               </div>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-white/60">Initial Install:</span>
                   <span className="font-bold">{formatCurrency(results.shingleInitial)}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-white/60">Future Replacements Needed:</span>
                   <span className="font-bold">{results.shingleReplacements}x</span>
                 </div>
                 <div className="flex justify-between pt-2">
                   <span className="text-white/80 font-bold">Lifetime TCO:</span>
                   <span className={`text-2xl font-black ${results.winner === 'Asphalt Shingle' ? 'text-green-400' : 'text-white'}`}>{formatCurrency(results.shingleTotal)}</span>
                 </div>
               </div>
            </div>

            <div className={`glass-card p-6 border-t-4 ${results.winner === 'Standing Seam Metal' ? 'border-t-green-500' : 'border-t-gray-600'}`}>
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Standing Seam Metal</h3>
                 <span className="text-xs bg-white/10 px-2 py-1 rounded">Lasts ~50 Yrs</span>
               </div>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-white/60">Initial Install:</span>
                   <span className="font-bold">{formatCurrency(results.metalInitial)}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-white/60">Future Replacements Needed:</span>
                   <span className="font-bold">{results.metalReplacements}x</span>
                 </div>
                 <div className="flex justify-between pt-2">
                   <span className="text-white/80 font-bold">Lifetime TCO:</span>
                   <span className={`text-2xl font-black ${results.winner === 'Standing Seam Metal' ? 'text-green-400' : 'text-white'}`}>{formatCurrency(results.metalTotal)}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="glass-card p-6 text-center bg-green-500/10 border border-green-500/30">
             <div className="text-lg font-bold text-green-400 mb-1">Total Cost Ownership Winner</div>
             <div className="text-white/80">
               Over {yearsInHome} years, <strong className="text-white">{results.winner}</strong> is the cheaper option, saving you roughly <strong className="text-green-400 text-xl">{formatCurrency(results.savings)}</strong> when factoring in the cost of inflation on future replacements.
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
