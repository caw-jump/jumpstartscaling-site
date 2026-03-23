import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RefinanceBreakEvenCalculator() {
  const [currentBalance, setCurrentBalance] = useState<string>('350000');
  const [currentRate, setCurrentRate] = useState<string>('7.5');
  const [newRate, setNewRate] = useState<string>('5.5');
  const [closingCosts, setClosingCosts] = useState<string>('4000'); // avg refinance costs are 2-3% or fixed
  
  const [results, setResults] = useState<{
    oldPayment: number;
    newPayment: number;
    monthlySavings: number;
    monthsToBreakeven: number;
    fiveYearSavings: number;
  } | null>(null);

  useEffect(() => {
    const bal = Number(currentBalance) || 0;
    const oldR = Number(currentRate) / 100 / 12 || 0;
    const newR = Number(newRate) / 100 / 12 || 0;
    const fees = Number(closingCosts) || 0;

    if (bal > 0 && oldR > 0 && newR > 0) {
      // Simplified P&I formula for 30 year (360 months)
      const months = 360;
      
      const calcPmt = (r: number, p: number) => {
        return p * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      };

      const oldPayment = calcPmt(oldR, bal);
      const newPayment = calcPmt(newR, bal + fees); // baking closing costs into new loan
      
      const savings = oldPayment - newPayment;
      
      // Breakeven based on the explicit fee injected to the capital stack
      let breakeven = 0;
      if (savings > 0) {
         breakeven = fees / savings;
      }

      setResults({
        oldPayment,
        newPayment,
        monthlySavings: savings,
        monthsToBreakeven: breakeven,
        fiveYearSavings: savings > 0 ? (savings * 60) - fees : 0
      });
    } else {
      setResults(null);
    }
  }, [currentBalance, currentRate, newRate, closingCosts]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Current Loan Balance</label>
          <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Upfront Closing Costs</label>
          <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Usually thousands of dollars rolled into the new loan.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Old Interest Rate (%)</label>
          <input type="number" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} step="0.125" className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">New Target Rate (%)</label>
          <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} step="0.125" className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          {results.monthlySavings > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
               <div className="glass-card p-6 text-center border-t-4 border-t-green-500 bg-green-500/5">
                 <div className="text-sm tracking-wide text-white/60 mb-2 uppercase">Monthly P&I Savings</div>
                 <div className="text-4xl font-black text-green-400">{formatCurrency(results.monthlySavings)}</div>
               </div>
               <div className="glass-card p-6 text-center border-t-4 border-t-[#E8C677] bg-black/40">
                 <div className="text-sm tracking-wide text-white/60 mb-2 uppercase">Months to Breakeven</div>
                 <div className="text-4xl font-black text-[#E8C677]">{Math.ceil(results.monthsToBreakeven)}</div>
                 <div className="text-xs text-white/50 mt-1">Wait time to absorb closing fees</div>
               </div>
               <div className="glass-card p-6 text-center border-t-4 border-t-blue-500 bg-blue-500/5">
                 <div className="text-sm tracking-wide text-white/60 mb-2 uppercase">Net Profit in 5 Years</div>
                 <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.fiveYearSavings)}</div>
               </div>
            </div>
          ) : (
            <div className="glass-card p-8 border-t-8 border-red-500 text-center bg-red-500/10">
               <h3 className="text-2xl font-bold text-red-400 mb-2">Financial Warning</h3>
               <p className="text-white/80 max-w-xl mx-auto">
                 Lowering the rate in this configuration does not overcome the mathematical weight of the closing costs. You are increasing your monthly payment. Do not execute this refinance.
               </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
