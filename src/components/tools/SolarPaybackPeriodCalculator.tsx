import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SolarPaybackPeriodCalculator() {
  const [systemCost, setSystemCost] = useState<string>('25000');
  const [annualBill, setAnnualBill] = useState<string>('1800'); // $150/mo * 12
  const [electricityInflation, setElectricityInflation] = useState<string>('4');
  const [incentives, setIncentives] = useState<string>('7500'); // 30% federal

  const [results, setResults] = useState<{
    netCost: number;
    paybackYears: number;
    twentyYearSavings: number;
  } | null>(null);

  useEffect(() => {
    const cost = Number(systemCost) || 0;
    const bill = Number(annualBill) || 0;
    const infl = Number(electricityInflation) || 0;
    const inc = Number(incentives) || 0;

    if (cost > 0 && bill > 0) {
      const net = cost - inc;
      
      let cumulativeSavings = 0;
      let currentYearBill = bill;
      let yearsToPayback = 0;
      let foundPayback = false;
      let savings20 = 0;

      for (let year = 1; year <= 25; year++) {
        cumulativeSavings += currentYearBill;
        if (!foundPayback && cumulativeSavings >= net) {
          // interpolate exact year
          const previousSavings = cumulativeSavings - currentYearBill;
          const remainingToPay = net - previousSavings;
          yearsToPayback = (year - 1) + (remainingToPay / currentYearBill);
          foundPayback = true;
        }
        
        if (year === 20) {
          savings20 = cumulativeSavings - net;
        }

        currentYearBill = currentYearBill * (1 + infl / 100);
      }

      setResults({
        netCost: net,
        paybackYears: yearsToPayback,
        twentyYearSavings: savings20
      });
    } else {
      setResults(null);
    }
  }, [systemCost, annualBill, electricityInflation, incentives]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total System Cost (Gross)</label>
          <input type="number" value={systemCost} onChange={(e) => setSystemCost(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Current Annual Electric Bill</label>
          <input type="number" value={annualBill} onChange={(e) => setAnnualBill(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Expected Utility Inflation (%)</label>
          <input type="number" value={electricityInflation} onChange={(e) => setElectricityInflation(e.target.value)} step="0.1" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Historical average is ~3-5% yearly increase.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Total Tax Credits & Rebates</label>
          <input type="number" value={incentives} onChange={(e) => setIncentives(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Federal ITC + State/Local cash rebates.</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
               <div className="text-sm text-white/60 mb-2">Net System Cost</div>
               <div className="text-3xl font-bold text-blue-400">{formatCurrency(results.netCost)}</div>
            </div>
            
            <div className="glass-card p-6 text-center border-t-4 border-t-yellow-500">
               <div className="text-sm text-white/60 mb-2">Payback Period</div>
               <div className="text-4xl font-black text-yellow-400">{results.paybackYears > 0 ? results.paybackYears.toFixed(1) : '0'} <span className="text-xl">Yrs</span></div>
            </div>

            <div className="glass-card p-6 text-center border-t-4 border-t-green-500">
               <div className="text-sm text-white/60 mb-2">20-Year Profit</div>
               <div className="text-3xl font-bold text-green-400">{formatCurrency(results.twentyYearSavings)}</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-white/60 max-w-2xl mx-auto">
            If utility rates rise at {electricityInflation}%, your system pays for itself entirely in month {Math.ceil((results.paybackYears % 1) * 12)} of year {Math.floor(results.paybackYears)}. From that moment on, your electricity is completely free.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
