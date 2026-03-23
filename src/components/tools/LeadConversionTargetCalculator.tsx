import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LeadConversionTargetCalculator() {
  const [desiredProfit, setDesiredProfit] = useState<string>('10000'); // $10k month
  const [avgDealMargin, setAvgDealMargin] = useState<string>('1500'); // $1500 net profit per job
  const [adSpend, setAdSpend] = useState<string>('3000');
  const [costPerLead, setCostPerLead] = useState<string>('85');

  const [results, setResults] = useState<{
    leadsGenerated: number;
    dealsNeeded: number;
    requiredCloseRate: number;
    feasible: boolean;
  } | null>(null);

  useEffect(() => {
    const profitTarget = Number(desiredProfit) || 0;
    const dealMargin = Number(avgDealMargin) || 0;
    const spend = Number(adSpend) || 0;
    const cpl = Number(costPerLead) || 0;

    if (profitTarget > 0 && dealMargin > 0 && cpl > 0) {
      // First, how many leads happen with this budget
      const leads = spend / cpl;

      // Desired Profit must be covered by (Deals * dealMargin)
      // And we also have to cover the ad spend!
      // Net Profit = (Deals * Margin) - Ad Spend
      // Deals * Margin = Net Profit + Ad Spend
      // Deals needed = (Net Profit + Ad Spend) / Margin
      const requiredDeals = (profitTarget + spend) / dealMargin;

      const reqCloseRate = leads > 0 ? (requiredDeals / leads) * 100 : 0;

      // Anything over 100% close rate is biologically impossible.
      // Anything over 40% on cold web traffic is exceptionally rare.
      const isFeasible = reqCloseRate <= 100;

      setResults({
        leadsGenerated: leads,
        dealsNeeded: requiredDeals,
        requiredCloseRate: reqCloseRate,
        feasible: isFeasible
      });
    } else {
      setResults(null);
    }
  }, [desiredProfit, avgDealMargin, adSpend, costPerLead]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Desired Monthly Net Profit ($)</label>
          <input type="number" value={desiredProfit} onChange={(e) => setDesiredProfit(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Your take-home cash goal from marketing.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Net Cash Margin Per Deal ($)</label>
          <input type="number" value={avgDealMargin} onChange={(e) => setAvgDealMargin(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Gross Revenue minus labor/materials.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Ad Spend Budget ($)</label>
          <input type="number" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Cost Per Lead (CPL) ($)</label>
          <input type="number" value={costPerLead} onChange={(e) => setCostPerLead(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Found in your Meta/Google ads platform.</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
             <div className="glass-card p-6 text-center border-t-4 border-t-blue-500 bg-blue-500/5">
                <div className="text-sm tracking-wide text-white/60 mb-2">Volume You Will Substantialize</div>
                <div className="text-3xl font-black text-blue-400">{Math.round(results.leadsGenerated)}</div>
                <div className="text-xs text-white/50 mt-1">Raw Leads per Month</div>
             </div>
             <div className="glass-card p-6 text-center border-t-4 border-t-indigo-500 bg-indigo-500/5">
                <div className="text-sm tracking-wide text-white/60 mb-2">Output Required to Cover Math</div>
                <div className="text-3xl font-black text-indigo-400">{Math.ceil(results.dealsNeeded)}</div>
                <div className="text-xs text-white/50 mt-1">Deals must be closed to pay for ads & hit profit</div>
             </div>
          </div>

          <div className={`glass-card p-8 border-t-8 text-center bg-black/40 ${!results.feasible ? 'border-t-red-500' : (results.requiredCloseRate > 40 ? 'border-t-yellow-500' : 'border-t-green-500')}`}>
             <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">To Hit Your Goal, Sales Team Must Close:</div>
             <div className={`text-6xl font-black mb-4 ${!results.feasible ? 'text-red-500' : (results.requiredCloseRate > 40 ? 'text-yellow-400' : 'text-green-400')}`}>
                {results.requiredCloseRate.toFixed(1)}%
             </div>
             <p className="text-white/80 max-w-xl mx-auto border-t border-white/10 pt-4">
               {!results.feasible 
                 ? "🔴 Your math is catastrophically broken. It is biologically impossible to close over 100% of your leads. You must either drastically lower your CPL, vastly increase your Deal Margin, or significantly increase your Ad Spend to generate more lead volume."
                 : (results.requiredCloseRate > 40 
                     ? "🟡 Warning: Expecting to close this percentage of cold digital traffic is highly unlikely. Most agencies hover between 10-25%. You likely need more budget to produce more raw volume." 
                     : "🟢 Excellent. This is a very achievable benchmark. If your sales team is competent, your math is heavily rigged for success.")
               }
             </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
