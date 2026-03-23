import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BelkinsROICalculator() {
  const [contractValue, setContractValue] = useState<string>('24000');
  const [grossMargin, setGrossMargin] = useState<string>('70');
  const [totalSpend, setTotalSpend] = useState<string>('15000');
  const [newCustomers, setNewCustomers] = useState<string>('4');
  const [salesCycle, setSalesCycle] = useState<string>('90');

  const [results, setResults] = useState<{ ltv: number; cac: number; ratio: number; payoutDays: number } | null>(null);

  useEffect(() => {
    const cv = Number(contractValue) || 0;
    const margin = Number(grossMargin) || 0;
    const spend = Number(totalSpend) || 0;
    const customers = Number(newCustomers) || 0;
    const cycle = Number(salesCycle) || 0;

    if (cv > 0 && margin > 0 && spend > 0 && customers > 0) {
      const ltv = cv * (margin / 100);
      const cac = spend / customers;
      const ratio = ltv / cac;
      
      setResults({ ltv, cac, ratio, payoutDays: cycle });
    } else {
      setResults(null);
    }
  }, [contractValue, grossMargin, totalSpend, newCustomers, salesCycle]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Avg Contract Value ($)</label>
          <input
            type="number"
            value={contractValue}
            onChange={(e) => setContractValue(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Gross Margin (%)</label>
          <input
            type="number"
            value={grossMargin}
            onChange={(e) => setGrossMargin(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Sales/Mktg Spend ($)</label>
          <input
            type="number"
            value={totalSpend}
            onChange={(e) => setTotalSpend(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">New Customers Closed</label>
          <input
            type="number"
            value={newCustomers}
            onChange={(e) => setNewCustomers(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Sales Cycle (Days)</label>
          <input
            type="number"
            value={salesCycle}
            onChange={(e) => setSalesCycle(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
            <div className="text-sm text-white/60 mb-1">Customer Acquisition Cost (CAC)</div>
            <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.cac)}</div>
          </div>
          <div className="glass-card p-6 text-center border-t-4 border-t-green-500">
            <div className="text-sm text-white/60 mb-1">Lifetime Value (Margin Adjusted)</div>
            <div className="text-3xl font-bold text-green-400">{formatCurrency(results.ltv)}</div>
          </div>
           <div className="glass-card p-6 text-center border-t-4 border-t-[#E8C677]">
            <div className="text-sm text-white/60 mb-1">LTV:CAC Ratio</div>
            <div className="text-4xl font-black gradient-text">{results.ratio.toFixed(1)}:1</div>
            <div className="text-xs text-white/50 mt-2">Payout Delay: {results.payoutDays} Days</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
