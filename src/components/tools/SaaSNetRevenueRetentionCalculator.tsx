import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SaaSNetRevenueRetentionCalculator() {
  const [startingMRR, setStartingMRR] = useState<string>('100000');
  const [expansionMRR, setExpansionMRR] = useState<string>('8000');
  const [downgradeMRR, setDowngradeMRR] = useState<string>('2000');
  const [churnMRR, setChurnMRR] = useState<string>('3000');

  const [nrr, setNrr] = useState<number | null>(null);

  useEffect(() => {
    const start = Number(startingMRR) || 0;
    const exp = Number(expansionMRR) || 0;
    const down = Number(downgradeMRR) || 0;
    const churn = Number(churnMRR) || 0;

    if (start > 0) {
      const retention = ((start + exp - down - churn) / start) * 100;
      setNrr(retention);
    } else {
      setNrr(null);
    }
  }, [startingMRR, expansionMRR, downgradeMRR, churnMRR]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Starting MRR (at beginning of month)</label>
          <input type="number" value={startingMRR} onChange={(e) => setStartingMRR(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Growth: Expansion / Upsell MRR (from existing)</label>
          <input type="number" value={expansionMRR} onChange={(e) => setExpansionMRR(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Loss: Downgrade MRR (from existing)</label>
          <input type="number" value={downgradeMRR} onChange={(e) => setDowngradeMRR(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Loss: Churn / Cancelled MRR (from existing)</label>
          <input type="number" value={churnMRR} onChange={(e) => setChurnMRR(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

       {nrr !== null && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
          <div className={`glass-card p-8 border-t-4 max-w-lg w-full text-center ${nrr >= 100 ? 'border-t-green-500' : 'border-t-red-500'}`}>
            <div className="text-sm text-white/60 mb-2">Net Revenue Retention (NRR)</div>
            <div className={`text-5xl font-black ${nrr >= 100 ? 'text-green-400' : 'text-red-400'}`}>
              {nrr.toFixed(1)}%
            </div>
            
            {nrr >= 100 ? (
              <div className="mt-4 text-green-300 text-sm p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                <strong>Net Negative Churn!</strong> Your existing customers are upgrading faster than they are cancelling. Your business would grow revenue this month even if you acquired zero new customers.
              </div>
            ) : (
              <div className="mt-4 text-red-300 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                <strong>Leaky Bucket.</strong> You are losing existing revenue faster than you can upsell it. You are entirely dependent on new customer acquisition just to stay flat.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
