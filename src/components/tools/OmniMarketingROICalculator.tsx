import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OmniMarketingROICalculator() {
  const [grossProfit, setGrossProfit] = useState<string>('50000');
  const [adSpend, setAdSpend] = useState<string>('8000');
  const [agencyFees, setAgencyFees] = useState<string>('3000');
  const [softwareCosts, setSoftwareCosts] = useState<string>('800');

  const [results, setResults] = useState<{ trueROI: number; totalCost: number; netReturn: number } | null>(null);

  useEffect(() => {
    const profit = Number(grossProfit) || 0;
    const ads = Number(adSpend) || 0;
    const agency = Number(agencyFees) || 0;
    const saas = Number(softwareCosts) || 0;

    const totalCost = ads + agency + saas;

    if (totalCost > 0 && profit > 0) {
      const netReturn = profit - totalCost;
      const trueROI = (netReturn / totalCost) * 100;
      setResults({ trueROI, totalCost, netReturn });
    } else {
      setResults(null);
    }
  }, [grossProfit, adSpend, agencyFees, softwareCosts]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-2">Gross Profit Attributed to Marketing ($)</label>
          <input type="number" value={grossProfit} onChange={(e) => setGrossProfit(e.target.value)} className="w-full md:w-1/2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Direct Ad Spend (Google/FB) ($)</label>
          <input type="number" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Agency Retainers or Freelance Fees ($)</label>
          <input type="number" value={agencyFees} onChange={(e) => setAgencyFees(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Marketing Software Stack (GoHighLevel/Zapiers) ($)</label>
          <input type="number" value={softwareCosts} onChange={(e) => setSoftwareCosts(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center border-t-4 border-t-red-500">
            <div className="text-sm text-white/60 mb-1">Total Loaded Marketing Cost</div>
            <div className="text-3xl font-bold text-red-400">{formatCurrency(results.totalCost)}</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
            <div className="text-sm text-white/60 mb-1">Net Gain (After All Fees)</div>
            <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.netReturn)}</div>
          </div>
          <div className={`glass-card p-6 text-center border-t-4 ${results.trueROI >= 0 ? 'border-t-green-500' : 'border-t-red-500'}`}>
            <div className="text-sm text-white/60 mb-1">True, Fully-Loaded ROI</div>
            <div className={`text-4xl font-black ${results.trueROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {results.trueROI.toFixed(1)}%
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
