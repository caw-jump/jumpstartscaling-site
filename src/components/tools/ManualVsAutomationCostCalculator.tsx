import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ManualVsAutomationCostCalculator() {
  const [recordsPerMonth, setRecordsPerMonth] = useState<string>('5000');
  const [minutesPerRecord, setMinutesPerRecord] = useState<string>('3');
  const [wagePerHour, setWagePerHour] = useState<string>('20');
  const [devSetupCost, setDevSetupCost] = useState<string>('2500');

  const [results, setResults] = useState<{
    manualCostPerMonth: number;
    hoursWasted: number;
    breakevenMonths: number;
    yearOneSavings: number;
  } | null>(null);

  useEffect(() => {
    const records = Number(recordsPerMonth) || 0;
    const mins = Number(minutesPerRecord) || 0;
    const wage = Number(wagePerHour) || 0;
    const setup = Number(devSetupCost) || 0;

    if (records > 0 && mins > 0 && wage > 0) {
      // 5000 records * 3 mins = 15000 mins = 250 hours
      const hours = (records * mins) / 60;
      const monthlyCost = hours * wage;
      
      const breakeven = setup / monthlyCost;
      const yr1Save = (monthlyCost * 12) - setup;

      setResults({
        manualCostPerMonth: monthlyCost,
        hoursWasted: hours,
        breakevenMonths: breakeven,
        yearOneSavings: yr1Save
      });
    } else {
      setResults(null);
    }
  }, [recordsPerMonth, minutesPerRecord, wagePerHour, devSetupCost]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Records/Tasks per Month</label>
          <input type="number" value={recordsPerMonth} onChange={(e) => setRecordsPerMonth(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">e.g. Invoices, Leads, Data scraping rows</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Minutes a Human Takes Per Record</label>
          <input type="number" value={minutesPerRecord} onChange={(e) => setMinutesPerRecord(e.target.value)} step="0.5" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Labor Rate ($/hr)</label>
          <input type="number" value={wagePerHour} onChange={(e) => setWagePerHour(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">One-Time Automation Dev Cost</label>
          <input type="number" value={devSetupCost} onChange={(e) => setDevSetupCost(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center border-t-4 border-t-red-500">
               <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Monthly Pen & Paper Cost</div>
               <div className="text-3xl font-black text-red-400">{formatCurrency(results.manualCostPerMonth)}</div>
               <div className="text-xs text-white/50 mt-2">Burning {Math.round(results.hoursWasted)} hours/mo</div>
            </div>
            
            <div className="glass-card p-6 text-center border-t-4 border-t-yellow-500">
               <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Developer ROI Break-Even</div>
               <div className="text-5xl font-black text-yellow-400 my-2">{results.breakevenMonths > 0 ? results.breakevenMonths.toFixed(1) : '0'}</div>
               <div className="text-xs text-white/50">Months</div>
            </div>

            <div className="glass-card p-6 text-center border-t-4 border-t-green-500 bg-green-500/5">
               <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Year One Net Cash Saved</div>
               <div className="text-3xl font-bold text-green-400">{formatCurrency(results.yearOneSavings)}</div>
               <div className="text-xs text-white/50 mt-2">Software works while you sleep.</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
