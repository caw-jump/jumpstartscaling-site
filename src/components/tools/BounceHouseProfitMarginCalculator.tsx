import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BounceHouseProfitMarginCalculator() {
  const [purchaseCost, setPurchaseCost] = useState<string>('2400');
  const [rentalRate, setRentalRate] = useState<string>('250');
  const [deliveryLabor, setDeliveryLabor] = useState<string>('60'); 
  const [cleaningInsurance, setCleaningInsurance] = useState<string>('15');

  const [results, setResults] = useState<{
    netProfit: number;
    marginPercent: number;
    rentalsToBreakeven: number;
    roiYearOne: number;
  } | null>(null);

  useEffect(() => {
    const cost = Number(purchaseCost) || 0;
    const rate = Number(rentalRate) || 0;
    const labor = Number(deliveryLabor) || 0;
    const misc = Number(cleaningInsurance) || 0;

    if (cost > 0 && rate > 0) {
      const expensesPerRental = labor + misc;
      const netProfitPerRental = rate - expensesPerRental;
      
      const margin = (netProfitPerRental / rate) * 100;
      
      const breakeven = netProfitPerRental > 0 ? (cost / netProfitPerRental) : 0;
      
      // Assume an average of 30 rentals for a good unit in Year 1 (summer demand)
      const yr1Net = (netProfitPerRental * 30) - cost; 

      setResults({
        netProfit: netProfitPerRental,
        marginPercent: margin,
        rentalsToBreakeven: breakeven,
        roiYearOne: yr1Net
      });
    } else {
      setResults(null);
    }
  }, [purchaseCost, rentalRate, deliveryLabor, cleaningInsurance]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Cost of the Unit ($)</label>
          <input type="number" value={purchaseCost} onChange={(e) => setPurchaseCost(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Weekend Rental Price ($)</label>
          <input type="number" value={rentalRate} onChange={(e) => setRentalRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Delivery Gas & Labor per Job</label>
          <input type="number" value={deliveryLabor} onChange={(e) => setDeliveryLabor(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Cleaning & Insurance per Job</label>
          <input type="number" value={cleaningInsurance} onChange={(e) => setCleaningInsurance(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
             <div className="glass-card p-6 text-center border-t-4 border-t-[#E8C677] bg-black/40">
                <div className="text-sm tracking-wide text-white/60 mb-2 uppercase">Net Profit per Rental</div>
                <div className="text-4xl font-black text-[#E8C677]">{formatCurrency(results.netProfit)}</div>
                <div className="text-xs text-white/50 mt-2 font-mono">{results.marginPercent.toFixed(1)}% Gross Margin</div>
             </div>
             
             <div className="glass-card p-6 text-center border-t-4 border-t-yellow-500 bg-yellow-500/5">
                <div className="text-sm tracking-wide text-white/60 mb-2 uppercase">Rentals to Break-Even</div>
                <div className="text-5xl font-black text-yellow-400 my-1">{results.rentalsToBreakeven > 0 ? Math.ceil(results.rentalsToBreakeven) : '∞'}</div>
                <div className="text-xs text-white/50 mt-1">Bookings required to pay off the unit</div>
             </div>
          </div>
          
          <div className="glass-card p-6 border-l-4 border-green-500 bg-green-500/5">
            <h4 className="font-bold text-green-400 mb-2">Year One ROI Projection</h4>
            <p className="text-white/80 text-sm leading-relaxed">
               Assuming you rent this unit out safely <strong className="text-white">30 times</strong> over the course of a single year (mostly summer weekends), your total cash-in-pocket after paying off the unit and all recurring labor is <strong className="text-green-400">{formatCurrency(results.roiYearOne)}</strong>. 
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
