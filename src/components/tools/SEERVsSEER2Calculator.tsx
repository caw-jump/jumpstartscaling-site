import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SEERVsSEER2Calculator() {
  const [currentSeer, setCurrentSeer] = useState<string>('10');
  const [newSeer, setNewSeer] = useState<string>('16');
  const [tonnage, setTonnage] = useState<string>('3.0');
  const [coolingHours, setCoolingHours] = useState<string>('2000'); // FL roughly 2800, NY roughly 1000
  const [electricityRate] = useState<string>('0.15');

  const [results, setResults] = useState<{
    oldAnnualCost: number;
    newAnnualCost: number;
    annualSavings: number;
    tenYearSavings: number;
    efficiencyGain: number;
  } | null>(null);

  useEffect(() => {
    const oldS = Number(currentSeer) || 0;
    const newS = Number(newSeer) || 0;
    const tons = Number(tonnage) || 0;
    const hours = Number(coolingHours) || 0;
    const rate = Number(electricityRate) || 0;

    if (oldS > 0 && newS > 0 && tons > 0 && hours > 0) {
      const btus = tons * 12000;
      
      // Calculate annual kWh usage: (BTUH / SEER) * CoolingHours / 1000
      const oldKwh = (btus / oldS) * hours / 1000;
      const newKwh = (btus / newS) * hours / 1000;

      const oldCost = oldKwh * rate;
      const newCost = newKwh * rate;
      
      const savings = Math.max(0, oldCost - newCost);
      const effGain = ((newS - oldS) / oldS) * 100;

      setResults({
        oldAnnualCost: oldCost,
        newAnnualCost: newCost,
        annualSavings: savings,
        tenYearSavings: savings * 10,
        efficiencyGain: effGain
      });
    } else {
      setResults(null);
    }
  }, [currentSeer, newSeer, tonnage, coolingHours, electricityRate]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Old Unit SEER Rating</label>
          <input type="number" value={currentSeer} onChange={(e) => setCurrentSeer(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Found on the yellow EnergyGuide sticker (Older units are usually 8-12)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">New Target SEER2 Rating</label>
          <input type="number" value={newSeer} onChange={(e) => setNewSeer(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">2023+ Federal minimums are 14.3 to 15.3 SEER2</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Unit Tonnage</label>
          <select value={tonnage} onChange={(e) => setTonnage(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="2.0" className="bg-[#1A1A1F] text-white">2.0 Tons (24k BTU)</option>
            <option value="2.5" className="bg-[#1A1A1F] text-white">2.5 Tons</option>
            <option value="3.0" className="bg-[#1A1A1F] text-white">3.0 Tons (36k BTU)</option>
            <option value="3.5" className="bg-[#1A1A1F] text-white">3.5 Tons</option>
            <option value="4.0" className="bg-[#1A1A1F] text-white">4.0 Tons (48k BTU)</option>
            <option value="5.0" className="bg-[#1A1A1F] text-white">5.0 Tons (60k BTU)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Annual Cooling Hours</label>
          <select value={coolingHours} onChange={(e) => setCoolingHours(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="1000" className="bg-[#1A1A1F] text-white">1000 hrs (Northeast / Cool)</option>
            <option value="1500" className="bg-[#1A1A1F] text-white">1500 hrs (Midwest / Mild)</option>
            <option value="2100" className="bg-[#1A1A1F] text-white">2100 hrs (South / Hot)</option>
            <option value="2800" className="bg-[#1A1A1F] text-white">2800 hrs (FL, TX, AZ / Extreme)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-t-4 border-t-red-500 bg-red-500/5">
               <div className="text-sm text-red-400 mb-2 font-bold select-none uppercase">Status Quo (Bleeding Money)</div>
               <div className="text-3xl font-black text-white">{formatCurrency(results.oldAnnualCost)}</div>
               <div className="text-xs text-white/50 mt-1">Est. Yearly Electric Cost to run old AC</div>
            </div>
            
            <div className="glass-card p-6 border-t-4 border-t-green-500 bg-green-500/5">
               <div className="text-sm text-green-400 mb-2 font-bold select-none uppercase">New High-Efficiency Path</div>
               <div className="text-3xl font-black text-white">{formatCurrency(results.newAnnualCost)}</div>
               <div className="text-xs text-white/50 mt-1">Est. Yearly Electric Cost to run new AC</div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-[#E8C677] text-center flex flex-col md:flex-row justify-between items-center bg-black/40">
             <div>
                <div className="text-sm text-white/60 mb-1">Annual Energy Savings</div>
                <div className="text-3xl font-bold text-green-400">{formatCurrency(results.annualSavings)}</div>
             </div>
             <div className="my-4 md:my-0 text-white/20 text-4xl hidden md:block">+</div>
             <div>
                <div className="text-sm text-white/60 mb-1">Total 10-Year ROI</div>
                <div className="text-4xl font-black text-[#E8C677]">{formatCurrency(results.tenYearSavings)}</div>
             </div>
          </div>
          
          <div className="text-center text-xs text-white/40">
             A jump from {currentSeer} SEER to {newSeer} SEER represents a {results.efficiencyGain.toFixed(1)}% gain in electrical efficiency. Note that actual bills vary with insulation and weather.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
