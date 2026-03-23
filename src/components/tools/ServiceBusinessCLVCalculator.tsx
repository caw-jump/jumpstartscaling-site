import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ServiceBusinessCLVCalculator() {
  const [initialJobRevenue, setInitialJobRevenue] = useState<string>('800'); // diagnostic or small repair
  const [annualMaintenance, setAnnualMaintenance] = useState<string>('250'); // PMA contract
  const [yearsRetained, setYearsRetained] = useState<string>('7');
  const [referralsPerClient, setReferralsPerClient] = useState<string>('0.5'); // 1 referral every 2 clients
  const [avgReferralValue, setAvgReferralValue] = useState<string>('1500');

  const [results, setResults] = useState<{
    baseValue: number;
    maintenanceValue: number;
    referralValue: number;
    totalLTV: number;
  } | null>(null);

  useEffect(() => {
    const initRev = Number(initialJobRevenue) || 0;
    const maintRev = Number(annualMaintenance) || 0;
    const years = Number(yearsRetained) || 0;
    const referrals = Number(referralsPerClient) || 0;
    const refVal = Number(avgReferralValue) || 0;

    if (initRev > 0) {
      const maintenanceValue = maintRev * years;
      const referralValue = referrals * refVal;
      const calculatedLtv = initRev + maintenanceValue + referralValue;

      setResults({
        baseValue: initRev,
        maintenanceValue: maintenanceValue,
        referralValue: referralValue,
        totalLTV: calculatedLtv
      });
    } else {
      setResults(null);
    }
  }, [initialJobRevenue, annualMaintenance, yearsRetained, referralsPerClient, avgReferralValue]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Initial Job Ticket ($)</label>
          <input type="number" value={initialJobRevenue} onChange={(e) => setInitialJobRevenue(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">e.g. A $800 AC repair or tune-up</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Annual Maintenance Fee ($)</label>
          <input type="number" value={annualMaintenance} onChange={(e) => setAnnualMaintenance(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">e.g. Spring/Fall checkups (PMA)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Avg Years Retained</label>
          <input type="number" value={yearsRetained} onChange={(e) => setYearsRetained(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Referrals Provided Over Lifespan</label>
          <input type="number" value={referralsPerClient} onChange={(e) => setReferralsPerClient(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">e.g. 0.5 = 1 referral per 2 clients</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-2">Average Value of a Referred Job ($)</label>
          <input type="number" value={avgReferralValue} onChange={(e) => setAvgReferralValue(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
             <div className="glass-card p-4 text-center border-t-2 border-white/10 text-white/70">
               <div className="text-xs mb-1 uppercase tracking-wider">Base Intake</div>
               <div className="text-xl font-bold">{formatCurrency(results.baseValue)}</div>
             </div>
             <div className="glass-card p-4 text-center border-t-2 border-white/10 text-white/70 relative overflow-hidden group">
               <div className="text-xs mb-1 uppercase tracking-wider">Service Contracts</div>
               <div className="text-xl font-bold text-blue-400">+{formatCurrency(results.maintenanceValue)}</div>
             </div>
             <div className="glass-card p-4 text-center border-t-2 border-white/10 text-white/70">
               <div className="text-xs mb-1 uppercase tracking-wider">Word of Mouth Spread</div>
               <div className="text-xl font-bold text-green-400">+{formatCurrency(results.referralValue)}</div>
             </div>
          </div>

          <div className="glass-card p-8 text-center bg-green-500/10 border border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
             <div className="text-sm text-green-300 font-bold mb-2 uppercase tracking-wide">True Customer Lifetime Value (CLV)</div>
             <div className="text-6xl font-black text-green-400 mb-4 tracking-tight">
                {formatCurrency(results.totalLTV)}
             </div>
             <p className="text-white/80 max-w-xl mx-auto text-sm border-t border-green-500/20 pt-4 leading-relaxed">
               If it costs you $400 in advertising to acquire a new customer, and your CLV is {formatCurrency(results.totalLTV)}, your marketing system functions like an ATM that prints money.
             </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
