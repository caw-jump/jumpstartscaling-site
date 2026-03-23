import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Laman7ROICalculator() {
  const [traffic, setTraffic] = useState<string>('5000');
  const [convRate, setConvRate] = useState<string>('5');
  const [leadToOpp, setLeadToOpp] = useState<string>('20');
  const [oppToClose, setOppToClose] = useState<string>('30');
  const [avgValue, setAvgValue] = useState<string>('5000');
  const [margin, setMargin] = useState<string>('60');
  const [spend, setSpend] = useState<string>('3000');

  const [results, setResults] = useState<{ leads: number; opps: number; customers: number; netProfit: number } | null>(null);

  useEffect(() => {
    const t = Number(traffic) || 0;
    const cr = Number(convRate) || 0;
    const lto = Number(leadToOpp) || 0;
    const otc = Number(oppToClose) || 0;
    const av = Number(avgValue) || 0;
    const m = Number(margin) || 0;
    const s = Number(spend) || 0;

    if (t > 0 && cr > 0 && lto > 0 && otc > 0 && av > 0) {
      const leads = t * (cr / 100);
      const opps = leads * (lto / 100);
      const customers = opps * (otc / 100);
      const grossRevenue = customers * av;
      
      const netProfit = (grossRevenue * (m / 100)) - s;
      
      setResults({ leads, opps, customers, netProfit });
    } else {
      setResults(null);
    }
  }, [traffic, convRate, leadToOpp, oppToClose, avgValue, margin, spend]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-1">Website Traffic</label>
          <input type="number" value={traffic} onChange={(e) => setTraffic(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-1">Opt-in Conv. Rate (%)</label>
          <input type="number" value={convRate} onChange={(e) => setConvRate(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-1">Lead to Opp (%)</label>
          <input type="number" value={leadToOpp} onChange={(e) => setLeadToOpp(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-1">Opp to Close (%)</label>
          <input type="number" value={oppToClose} onChange={(e) => setOppToClose(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-1">Avg Deal Value ($)</label>
          <input type="number" value={avgValue} onChange={(e) => setAvgValue(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-1">Fulfillment Margin (%)</label>
          <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-1">Total Ad Spend ($)</label>
          <input type="number" value={spend} onChange={(e) => setSpend(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 glass-card p-4 text-center border-t-2 border-t-white/20">
            <div className="text-xs text-white/60 mb-1">Raw Leads</div>
            <div className="text-2xl font-bold">{Math.round(results.leads)}</div>
          </div>
          <div className="flex-1 glass-card p-4 text-center border-t-2 border-t-blue-500">
            <div className="text-xs text-white/60 mb-1">Sales Opps</div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(results.opps)}</div>
          </div>
          <div className="flex-1 glass-card p-4 text-center border-t-2 border-t-green-500">
            <div className="text-xs text-white/60 mb-1">Customers</div>
            <div className="text-2xl font-bold text-green-400">{Math.round(results.customers)}</div>
          </div>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className={`glass-card p-8 text-center border-t-4 ${results.netProfit >= 0 ? 'border-t-green-500' : 'border-t-red-500'}`}>
            <div className="text-sm text-white/60 mb-2">Bottom Line Net Profit (After Fulfillment & Ads)</div>
            <div className={`text-5xl font-black ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(results.netProfit)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
