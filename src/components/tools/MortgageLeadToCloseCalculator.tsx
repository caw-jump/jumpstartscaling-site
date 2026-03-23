import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MortgageLeadToCloseCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState<string>('200');
  const [contactRate, setContactRate] = useState<string>('60'); // 60%
  const [preApproveRate, setPreApproveRate] = useState<string>('15'); // 15% of contacted
  const [fundedRate, setFundedRate] = useState<string>('70'); // 70% of pre-approved actually close on a house
  const [avgCommission, setAvgCommission] = useState<string>('3500');

  const [results, setResults] = useState<{
    contacted: number;
    preApproved: number;
    funded: number;
    grossCommission: number;
    leadValue: number;
  } | null>(null);

  useEffect(() => {
    const leads = Number(monthlyLeads) || 0;
    const contRate = Number(contactRate) / 100 || 0;
    const preAppRate = Number(preApproveRate) / 100 || 0;
    const fundRate = Number(fundedRate) / 100 || 0;
    const commission = Number(avgCommission) || 0;

    if (leads > 0 && commission > 0) {
      const contacted = leads * contRate;
      const preApproved = contacted * preAppRate;
      const funded = preApproved * fundRate;
      const gross = funded * commission;
      const valuePerLead = leads > 0 ? gross / leads : 0;

      setResults({
        contacted,
        preApproved,
        funded,
        grossCommission: gross,
        leadValue: valuePerLead
      });
    } else {
      setResults(null);
    }
  }, [monthlyLeads, contactRate, preApproveRate, fundedRate, avgCommission]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-2">Total Monthly Internet Leads</label>
          <input type="number" value={monthlyLeads} onChange={(e) => setMonthlyLeads(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Contact Rate (%)</label>
          <input type="number" value={contactRate} onChange={(e) => setContactRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-[10px] text-white/50 mt-1 uppercase">How many answered the phone?</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Pre-Approval Rate (%)</label>
          <input type="number" value={preApproveRate} onChange={(e) => setPreApproveRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-[10px] text-white/50 mt-1 uppercase">From those contacted, how many qualified?</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Funded Closing Rate (%)</label>
          <input type="number" value={fundedRate} onChange={(e) => setFundedRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-[10px] text-white/50 mt-1 uppercase">How many pre-approvals found a house & closed?</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Loan Commission ($)</label>
          <input type="number" value={avgCommission} onChange={(e) => setAvgCommission(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-bold text-lg border border-white/20 mr-4 z-10 shrink-0">{monthlyLeads}</div>
            <div className="flex-grow bg-white/10 h-8 rounded-r-lg flex items-center px-4 text-xs font-mono text-white/60">Raw Internet Leads</div>
          </div>
          <div className="flex items-center ml-4 border-l-2 border-white/20 pl-4 py-2">
            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center font-bold text-blue-400 border border-blue-500/30 mr-4 z-10 shrink-0">{Math.round(results.contacted)}</div>
            <div className="flex-grow bg-blue-500/10 h-8 rounded-r-lg flex items-center px-4 text-xs font-mono text-blue-300">Successfully Contacted</div>
          </div>
          <div className="flex items-center ml-12 border-l-2 border-white/20 pl-4 py-2">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center font-bold text-yellow-400 border border-yellow-500/30 mr-4 z-10 shrink-0">{Math.round(results.preApproved)}</div>
            <div className="flex-grow bg-yellow-500/10 h-8 rounded-r-lg flex items-center px-4 text-xs font-mono text-yellow-300">Pre-Approved / Issued Pre-Qual</div>
          </div>
          <div className="flex items-center ml-20 border-l-2 border-white/20 pl-4 py-2">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center font-bold text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] mr-4 z-10 shrink-0 text-xl">{results.funded.toFixed(1)}</div>
            <div className="flex-grow bg-green-500/10 h-8 rounded-r-lg flex items-center px-4 text-xs font-mono text-green-300">Successfully Funded (Cash in Bank)</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-sm font-bold tracking-widest uppercase text-white/50 mb-1">Gross Commission Generated</div>
              <div className="text-3xl font-black text-[#E8C677]">{formatCurrency(results.grossCommission)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold tracking-widest uppercase text-white/50 mb-1">Math Value Per Lead</div>
              <div className="text-3xl font-black text-white">{formatCurrency(results.leadValue)}</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
