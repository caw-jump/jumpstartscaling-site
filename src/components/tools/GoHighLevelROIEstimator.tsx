import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GoHighLevelROIEstimator() {
  const [clients, setClients] = useState<string>('15');
  const [monthlyFee, setMonthlyFee] = useState<string>('297');
  const [markupPercent, setMarkupPercent] = useState<string>('0'); 

  const [results, setResults] = useState<{
    grossRevenue: number;
    platformCost: number;
    infrastructureCost: number;
    netMrr: number;
    annualRunRate: number;
  } | null>(null);

  useEffect(() => {
    const clientCount = Number(clients) || 0;
    const saasFee = Number(monthlyFee) || 0;
    const markup = Number(markupPercent) / 100 || 0;

    if (clientCount > 0) {
      // 100% white label SaaS revenue
      const mrrGross = clientCount * saasFee;

      // GHL SaaS Agency plan is fixed $497/mo (assuming pro/saas mode)
      const ghlPlanCost = 497;
      
      // Assume arbitrary telecom costs per client ($15 of SMS/email usage, maybe agent marks it up or eats it)
      // If markup > 0, they actively profit off telecom rebilling.
      const rawTelecomCost = clientCount * 15; 
      const telecomRevenue = rawTelecomCost * (1 + markup);
      const telecomProfit = telecomRevenue - rawTelecomCost;

      const totalGross = mrrGross + telecomProfit;
      const totalNet = totalGross - ghlPlanCost;

      setResults({
        grossRevenue: totalGross,
        platformCost: ghlPlanCost,
        infrastructureCost: rawTelecomCost, // Just showing it
        netMrr: totalNet,
        annualRunRate: totalNet * 12
      });
    } else {
      setResults(null);
    }
  }, [clients, monthlyFee, markupPercent]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Number of SaaS Clients</label>
          <input type="number" value={clients} onChange={(e) => setClients(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly SaaS Fee ($)</label>
          <input type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Typical range: $97 to $497</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Telecom Rebilling Markup (%)</label>
          <input type="number" value={markupPercent} onChange={(e) => setMarkupPercent(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">If using Twilio/LC Phone reselling.</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
             <div className="glass-card p-4 text-center border-t-2 border-white/10">
               <div className="text-xs text-white/60 mb-1 tracking-wider uppercase">Fixed Agency Overhead</div>
               <div className="text-2xl font-bold text-red-400">-$497</div>
               <div className="text-xs text-white/40 mt-1">GHL Pro Plan (Unlimited Users)</div>
             </div>
             <div className="glass-card p-4 text-center border-t-2 border-white/10">
               <div className="text-xs text-white/60 mb-1 tracking-wider uppercase">SaaS Gross MRR</div>
               <div className="text-2xl font-bold text-white">{formatCurrency(results.grossRevenue)}</div>
               <div className="text-xs text-white/40 mt-1">Subscriptions + Telecom Profit</div>
             </div>
             <div className="glass-card p-4 text-center border-t-2 border-white/10">
               <div className="text-xs text-white/60 mb-1 tracking-wider uppercase">SaaS Net MRR</div>
               <div className="text-2xl font-bold text-green-400">{formatCurrency(results.netMrr)}</div>
               <div className="text-xs text-white/40 mt-1">Gross minus $497 Overhead</div>
             </div>
          </div>

          <div className="glass-card p-8 text-center bg-blue-500/10 border border-blue-500/30">
             <div className="text-sm text-blue-300 font-bold mb-2 uppercase tracking-wide">Business Annual Run Rate (ARR)</div>
             <div className="text-6xl font-black text-blue-400 mb-4">
                {formatCurrency(results.annualRunRate)}
             </div>
             <div className="text-white/80 max-w-xl mx-auto border-t border-blue-500/20 pt-4">
                The massive advantage of the GoHighLevel ecosystem is fixed overhead constraints. Whether you have 10 sub-accounts or 500, your infrastructure cost remains flat, leading to near 98% software gross margins at scale.
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
