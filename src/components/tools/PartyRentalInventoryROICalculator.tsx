import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PartyRentalInventoryROICalculator() {
  const [totalInvestment, setTotalInvestment] = useState<string>('15000');
  const [avgRentalRate, setAvgRentalRate] = useState<string>('300'); // blended average of items/packages
  const [weekendUtilization, setWeekendUtilization] = useState<string>('40'); // 40% of inventory out

  const [results, setResults] = useState<{
    weeklyGross: number;
    monthlyGross: number;
    annualGross: number;
    monthsToBreakeven: number;
  } | null>(null);

  useEffect(() => {
    const invest = Number(totalInvestment) || 0;
    const rate = Number(avgRentalRate) || 0;
    const utilization = Number(weekendUtilization) / 100 || 0;

    if (invest > 0 && rate > 0) {
      // Logic assumes 'investment' represents a fleet of items whose combined "if fully rented" value is derived, OR
      // assume roughly $1,500 buy cost for every $300 rental item (rule of thumb: 1/5 ratio)
      const maxPossibleGrossWeekend = invest / 5; // e.g., $15k bought 10 items worth $300/rent each = $3000 max capacity
      
      const realWeeklyGross = maxPossibleGrossWeekend * utilization;
      const realMonhtlyGross = realWeeklyGross * 4.2;
      const realAnnualGross = realMonhtlyGross * 12;

      const breakeven = realMonhtlyGross > 0 ? invest / realMonhtlyGross : 0;

      setResults({
        weeklyGross: realWeeklyGross,
        monthlyGross: realMonhtlyGross,
        annualGross: realAnnualGross * 0.7, // Assume a 30% discount for off-seasons and cancellations
        monthsToBreakeven: breakeven
      });
    } else {
      setResults(null);
    }
  }, [totalInvestment, avgRentalRate, weekendUtilization]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Capital Put Into Inventory ($)</label>
          <input type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Blended Avg Gross Output</label>
          <input type="number" value={avgRentalRate} onChange={(e) => setAvgRentalRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Weekend Utilization %</label>
          <select value={weekendUtilization} onChange={(e) => setWeekendUtilization(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="20" className="bg-[#1A1A1F] text-white">20% (Struggling / Low Traffic)</option>
            <option value="40" className="bg-[#1A1A1F] text-white">40% (Standard Regional Agency)</option>
            <option value="70" className="bg-[#1A1A1F] text-white">70% (Peak Season Sell-out)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center border-t-2 border-white/10 bg-white/5">
               <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">Weekly Potential</div>
               <div className="text-xl font-bold text-white/90">{formatCurrency(results.weeklyGross)}</div>
            </div>
            
            <div className="glass-card p-4 text-center border-t-2 border-green-500 bg-green-500/10">
               <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">Target Monthly Cashflow</div>
               <div className="text-2xl font-black text-green-400">{formatCurrency(results.monthlyGross)}</div>
            </div>

            <div className="glass-card p-4 text-center border-t-2 border-white/10 bg-white/5">
               <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">Annual Revenue (Adjusted)</div>
               <div className="text-xl font-bold text-white/90">{formatCurrency(results.annualGross)}</div>
            </div>
            
            <div className="glass-card p-4 text-center border-t-2 border-yellow-500 bg-yellow-500/10">
               <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">Months to Recoup Capital</div>
               <div className="text-2xl font-black text-yellow-400">{results.monthsToBreakeven.toFixed(1)}</div>
            </div>
          </div>
          
          <div className="text-center text-xs text-white/40 max-w-2xl mx-auto">
             *Calculations rely on an industry standard 1:5 purchase-to-rental-value ratio rule of thumb. Annual projections are artificially lowered by 30% to account for harsh winter seasonality drop-offs. Let's make it rain.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
