import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SaaSLTVtoCACCalculator() {
  const [arpa, setArpa] = useState<string>('500');
  const [grossMargin, setGrossMargin] = useState<string>('80');
  const [churnRate, setChurnRate] = useState<string>('3.5');
  const [cac, setCac] = useState<string>('1500');

  const [results, setResults] = useState<{ ltv: number; ratio: number; monthsToRecover: number } | null>(null);

  useEffect(() => {
    const a = Number(arpa) || 0;
    const margin = Number(grossMargin) || 0;
    const churn = Number(churnRate) || 0;
    const c = Number(cac) || 0;

    if (a > 0 && margin > 0 && churn > 0 && c > 0) {
      const ltv = (a * (margin / 100)) / (churn / 100);
      const ratio = ltv / c;
      const monthlyGross = a * (margin / 100);
      const monthsToRecover = c / monthlyGross;

      setResults({ ltv, ratio, monthsToRecover });
    } else {
      setResults(null);
    }
  }, [arpa, grossMargin, churnRate, cac]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Revenue Per Account (ARPA) / Mo ($)</label>
          <input type="number" value={arpa} onChange={(e) => setArpa(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Gross Margin (%)</label>
          <input type="number" value={grossMargin} onChange={(e) => setGrossMargin(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Logo Churn Rate (%)</label>
          <input type="number" value={churnRate} onChange={(e) => setChurnRate(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Customer Acquisition Cost (CAC) ($)</label>
          <input type="number" value={cac} onChange={(e) => setCac(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
            <div className="text-sm text-white/60 mb-1">Lifetime Value (LTV)</div>
            <div className="text-4xl font-black text-blue-400">{formatCurrency(results.ltv)}</div>
          </div>
          <div className={`glass-card p-6 text-center border-t-4 ${results.ratio >= 3 ? 'border-t-green-500' : 'border-t-red-500'}`}>
            <div className="text-sm text-white/60 mb-1">LTV:CAC Ratio</div>
            <div className={`text-4xl font-black ${results.ratio >= 3 ? 'text-green-400' : 'text-red-400'}`}>
              {results.ratio.toFixed(1)}:1
            </div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-[#E8C677]">
            <div className="text-sm text-white/60 mb-1">CAC Payback Time</div>
            <div className="text-4xl font-black text-[#E8C677]">{results.monthsToRecover.toFixed(1)}</div>
            <div className="text-xs text-white/50 mt-2">Months to breakeven</div>
          </div>
        </motion.div>
      )}

       {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
           {results.ratio < 1 ? (
             <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/50 text-red-100 flex items-center gap-4">
               <div>⚠️</div>
               <p className="text-sm"><strong>Critical Danger:</strong> You are spending more to acquire a customer than they will ever pay you throughout their lifespan. You must either drastically reduce ad spend, or fix churn immediately.</p>
             </div>
           ) : results.ratio < 3 ? (
             <div className="p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/50 text-yellow-100 flex items-center gap-4">
                <div>⚠️</div>
               <p className="text-sm"><strong>Warning:</strong> An LTV:CAC ratio below 3:1 means your growth is highly inefficient. Consider raising prices, upselling to increase ARPA, or refining top-of-funnel targeting to lower CAC.</p>
             </div>
           ) : results.ratio > 5 ? (
             <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/50 text-blue-100 flex items-center gap-4">
                <div>📈</div>
               <p className="text-sm"><strong>Growth Opportunity:</strong> A ratio this high ({results.ratio.toFixed(1)}:1) means you have a highly profitable engine, but you are likely **under-spending** on marketing. You could aggressively increase your ad budget to capture more market share.</p>
             </div>
           ) : (
             <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/50 text-green-100 flex items-center gap-4">
                <div>✅</div>
               <p className="text-sm"><strong>Healthy Business:</strong> You are right in the sweet spot (3:1 to 5:1). Your unit economics are scalable and highly attractive to investors.</p>
             </div>
           )}
        </motion.div>
      )}
    </motion.div>
  );
}
