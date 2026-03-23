import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SEOKeywordValueCalculator() {
  const [searchVolume, setSearchVolume] = useState<string>('5000');
  const [expectedCTR, setExpectedCTR] = useState<string>('15'); // 15% for top 3
  const [conversionRate, setConversionRate] = useState<string>('3');
  const [customerValue, setCustomerValue] = useState<string>('1200');

  const [results, setResults] = useState<{
    monthlyTraffic: number;
    monthlyLeads: number;
    monthlyValue: number;
    annualValue: number;
  } | null>(null);

  useEffect(() => {
    const volume = Number(searchVolume) || 0;
    const ctr = Number(expectedCTR) || 0;
    const convRate = Number(conversionRate) || 0;
    const ltv = Number(customerValue) || 0;

    if (volume > 0 && ctr > 0 && convRate > 0 && ltv > 0) {
      const traffic = volume * (ctr / 100);
      const leads = traffic * (convRate / 100);
      const value = leads * ltv;
      
      setResults({
        monthlyTraffic: traffic,
        monthlyLeads: leads,
        monthlyValue: value,
        annualValue: value * 12
      });
    } else {
      setResults(null);
    }
  }, [searchVolume, expectedCTR, conversionRate, customerValue]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Search Volume</label>
          <input type="number" value={searchVolume} onChange={(e) => setSearchVolume(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">From Ahrefs, SEMrush, etc.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Expected CTR (%)</label>
          <input type="number" value={expectedCTR} onChange={(e) => setExpectedCTR(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Position 1: ~30%, Position 3: ~15%</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Website Conversion Rate (%)</label>
          <input type="number" value={conversionRate} onChange={(e) => setConversionRate(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Customer Value ($)</label>
          <input type="number" value={customerValue} onChange={(e) => setCustomerValue(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">LTV or Average Order Value</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-t-4 border-t-purple-500 text-center grid grid-cols-2 gap-4">
             <div className="col-span-2 text-sm text-white/60 mb-2 border-b border-white/10 pb-2">Traffic & Conversion Projections</div>
             <div>
               <div className="text-3xl font-bold text-purple-400">{Math.round(results.monthlyTraffic)}</div>
               <div className="text-xs text-white/50 mt-1">Monthly Visitors</div>
             </div>
             <div>
               <div className="text-3xl font-bold text-blue-400">{Math.round(results.monthlyLeads)}</div>
               <div className="text-xs text-white/50 mt-1">Monthly Customers</div>
             </div>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-green-500 text-center flex flex-col justify-center">
             <div className="text-sm text-white/60 mb-2">Projected Monthly Revenue Value</div>
             <div className="text-5xl font-black text-green-400">{formatCurrency(results.monthlyValue)}</div>
             <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
                <span className="font-bold">Annualized Value:</span> {formatCurrency(results.annualValue)}
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
