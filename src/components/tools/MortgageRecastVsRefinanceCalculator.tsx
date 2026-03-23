import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MortgageRecastVsRefinanceCalculator() {
  // Current Loan
  const [currentBalance, setCurrentBalance] = useState<string>('300000');
  const [currentRate, setCurrentRate] = useState<string>('6.5');
  const [remainingMonths, setRemainingMonths] = useState<string>('300');
  
  // The Strategy
  const [lumpSum, setLumpSum] = useState<string>('50000');
  
  // Refinance Specifics
  const [newRate, setNewRate] = useState<string>('5.5');
  const [newTermMonths, setNewTermMonths] = useState<string>('360');
  const [closingCosts, setClosingCosts] = useState<string>('4000');

  const [results, setResults] = useState<{
    currentPayment: number;
    recastPayment: number;
    refinancePayment: number;
    recastSavings: number;
    refinanceSavings: number;
  } | null>(null);

  useEffect(() => {
    const balance = Number(currentBalance) || 0;
    const rate = Number(currentRate) || 0;
    const months = Number(remainingMonths) || 0;
    const lump = Number(lumpSum) || 0;
    
    const nRate = Number(newRate) || 0;
    const nTerm = Number(newTermMonths) || 0;
    const closing = Number(closingCosts) || 0;

    if (balance > 0 && rate > 0 && months > 0) {
      // P * [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]
      const calcPMT = (p: number, annualRate: number, term: number) => {
         const i = (annualRate / 100) / 12;
         const numerator = parseFloat(i.toFixed(8)) === 0 ? 0 : i * Math.pow(1 + i, term);
         const denominator = parseFloat(i.toFixed(8)) === 0 ? 1 : Math.pow(1 + i, term) - 1;
         return p * (numerator / denominator);
      };

      // 1. Status Quo Payment
      const currentPayment = calcPMT(balance, rate, months);
      const originalTotalInterest = (currentPayment * months) - balance;

      // 2. Recast Payment (Same rate, same remaining months, purely lowered principal)
      const recastBalance = Math.max(0, balance - lump);
      const recastPayment = calcPMT(recastBalance, rate, months);
      const recastTotalInterest = (recastPayment * months) - recastBalance;

      // 3. Refinance Payment (New rate, new term, lower principal but add closing costs)
      const refinanceBalance = Math.max(0, balance - lump + closing);
      const refinancePayment = calcPMT(refinanceBalance, nRate, nTerm);
      const refinanceTotalInterest = (refinancePayment * nTerm) - refinanceBalance;

      const recastSavings = originalTotalInterest - recastTotalInterest;
      // Refi savings accounts for the cash paid towards closing costs (or baked into loan)
      const refinanceSavings = originalTotalInterest - refinanceTotalInterest - closing;

      setResults({
        currentPayment,
        recastPayment,
        refinancePayment,
        recastSavings,
        refinanceSavings
      });
    } else {
      setResults(null);
    }
  }, [currentBalance, currentRate, remainingMonths, lumpSum, newRate, newTermMonths, closingCosts]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-3 pb-2 border-b border-white/10 text-lg font-bold">Current Mortgage</div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Remaining Balance ($)</label>
          <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Current Interest Rate (%)</label>
          <input type="number" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Remaining Term (Months)</label>
          <input type="number" value={remainingMonths} onChange={(e) => setRemainingMonths(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>

        <div className="lg:col-span-3 pb-2 border-b border-white/10 text-lg font-bold mt-4">The Strategy (Using Cash)</div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Lump Sum Cash Injection ($)</label>
          <input type="number" value={lumpSum} onChange={(e) => setLumpSum(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        
        <div className="lg:col-span-3 pb-2 border-b border-white/10 text-lg font-bold mt-4">Refinance Variables</div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">New Interest Rate (%)</label>
          <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">New Mortgage Term (Months)</label>
          <input type="number" value={newTermMonths} onChange={(e) => setNewTermMonths(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Refinance Closing Costs ($)</label>
          <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center border-t-4 border-t-gray-500">
            <div className="text-sm text-white/60 mb-2">Current Payment (P&I)</div>
            <div className="text-3xl font-bold">{formatCurrency(results.currentPayment)}<span className="text-lg">/mo</span></div>
            <div className="text-xs text-white/50 mt-4 leading-relaxed">Doing nothing keeps your payment the same.</div>
          </div>

          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500 relative">
             <div className="absolute top-0 right-0 bg-blue-500 text-xs px-2 py-1 rounded-bl-lg font-bold">RECAST</div>
            <div className="text-sm text-white/60 mb-2 mt-4">New Payment (P&I)</div>
            <div className="text-4xl font-black text-blue-400">{formatCurrency(results.recastPayment)}<span className="text-lg">/mo</span></div>
            <div className="mt-4 pt-4 border-t border-white/10">
               <div className="text-sm text-white/80">Lifetime Interest Saved</div>
               <div className="text-xl font-bold text-green-400">{formatCurrency(results.recastSavings)}</div>
            </div>
             <div className="text-xs text-white/50 mt-4 leading-relaxed">Keeps your existing low rate, avoids massive closing costs. Usually costs a flat $250 fee from your current lender.</div>
          </div>

          <div className="glass-card p-6 text-center border-t-4 border-t-purple-500 relative">
             <div className="absolute top-0 right-0 bg-purple-500 text-xs px-2 py-1 rounded-bl-lg font-bold">REFINANCE</div>
            <div className="text-sm text-white/60 mb-2 mt-4">New Payment (P&I)</div>
            <div className="text-4xl font-black text-purple-400">{formatCurrency(results.refinancePayment)}<span className="text-lg">/mo</span></div>
             <div className="mt-4 pt-4 border-t border-white/10">
               <div className="text-sm text-white/80">Net Lifetime Saved</div>
               <div className="text-xl font-bold text-green-400">{formatCurrency(results.refinanceSavings)}</div>
            </div>
             <div className="text-xs text-white/50 mt-4 leading-relaxed">Takes advantage of a lower rate, but resets the amortization clock and charges thousands in upfront closing fees.</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
