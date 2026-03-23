import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CapRateNOICalculator() {
  const [propertyPrice, setPropertyPrice] = useState<string>('500000');
  const [monthlyRent, setMonthlyRent] = useState<string>('4500');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('1200'); // HOA, Taxes, Maintenance, Insurance

  const [results, setResults] = useState<{ noi: number; capRate: number; grossYield: number } | null>(null);

  useEffect(() => {
    const price = Number(propertyPrice) || 0;
    const rent = Number(monthlyRent) || 0;
    const expenses = Number(monthlyExpenses) || 0;

    if (price > 0 && rent > 0) {
      const grossAnnualIncome = rent * 12;
      const annualExpenses = expenses * 12;
      
      const noi = grossAnnualIncome - annualExpenses;
      const capRate = (noi / price) * 100;
      const grossYield = (grossAnnualIncome / price) * 100;
      
      setResults({ noi, capRate, grossYield });
    } else {
      setResults(null);
    }
  }, [propertyPrice, monthlyRent, monthlyExpenses]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Property Purchase Price ($)</label>
          <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Monthly Rent ($)</label>
          <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Combined Monthly Expenses ($)</label>
          <input type="number" placeholder="Taxes, HOA, Ins, Maint" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Excludes mortgage (P&I).</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 border-t-4 border-t-blue-500 text-center">
            <div className="text-sm text-white/60 mb-2">Net Operating Income (NOI)</div>
            <div className="text-5xl font-black text-blue-400">{formatCurrency(results.noi)}</div>
            <div className="text-xs text-white/50 mt-4 leading-relaxed">
               The true unleveraged operating cash flow of the property before servicing any debt.
            </div>
          </div>

          <div className={`glass-card p-8 border-t-4 text-center flex flex-col justify-center gap-2 ${results.capRate >= 7 ? 'border-t-green-500' : 'border-t-[#E8C677]'}`}>
             <div className="text-sm text-white/60">Capitalization Rate (Cap Rate)</div>
             <div className={`text-6xl font-black ${results.capRate >= 7 ? 'text-green-400' : 'text-[#E8C677]'}`}>{results.capRate.toFixed(2)}%</div>
             
             <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
                <span className="font-bold">Gross Yield:</span> {results.grossYield.toFixed(2)}%
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
