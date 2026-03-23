import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SolarPanelSizingCalculator() {
  const [monthlyBill, setMonthlyBill] = useState<string>('200');
  const [costPerKwh, setCostPerKwh] = useState<string>('0.16');
  const [sunlightHours, setSunlightHours] = useState<string>('4.5');
  const [panelWattage, setPanelWattage] = useState<string>('400');
  const [offsetTarget, setOffsetTarget] = useState<string>('100'); // 100% offset

  const [results, setResults] = useState<{
    monthlyKwh: number;
    systemSizeKw: number;
    panelCount: number;
    sqftRequired: number;
  } | null>(null);

  useEffect(() => {
    const bill = Number(monthlyBill) || 0;
    const rate = Number(costPerKwh) || 0;
    const sunHours = Number(sunlightHours) || 0;
    const watts = Number(panelWattage) || 0;
    const offset = Number(offsetTarget) || 0;

    if (bill > 0 && rate > 0 && sunHours > 0 && watts > 0 && offset > 0) {
      // Monthly consumption
      const monthlyKwh = bill / rate;
      const dailyKwh = monthlyKwh / 30.4;
      
      // Target generation based on offset percentage
      const targetDailyKwh = dailyKwh * (offset / 100);

      // System size needed (factoring in 20% system efficiency loss for wires, inverter, heat)
      const systemEfficiency = 0.8;
      const systemSizeKw = targetDailyKwh / sunHours / systemEfficiency;

      const panelCount = Math.ceil((systemSizeKw * 1000) / watts);
      const sqftRequired = panelCount * 18.5; // standard 400W panel is ~18.5 sq ft

      setResults({
        monthlyKwh,
        systemSizeKw,
        panelCount,
        sqftRequired
      });
    } else {
      setResults(null);
    }
  }, [monthlyBill, costPerKwh, sunlightHours, panelWattage, offsetTarget]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Avg Monthly Electric Bill ($)</label>
          <input type="number" value={monthlyBill} onChange={(e) => setMonthlyBill(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Cost per kWh ($)</label>
          <input type="number" value={costPerKwh} onChange={(e) => setCostPerKwh(e.target.value)} step="0.01" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">National average is ~$0.16</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Peak Sunlight (Hours/Day)</label>
          <select value={sunlightHours} onChange={(e) => setSunlightHours(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="3.5" className="bg-[#1A1A1F] text-white">3.5 Hrs (Northeast / PNW)</option>
            <option value="4.5" className="bg-[#1A1A1F] text-white">4.5 Hrs (Midwest / National Avg)</option>
            <option value="5.5" className="bg-[#1A1A1F] text-white">5.5 Hrs (Southwest / CA / FL)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Individual Panel Wattage</label>
          <select value={panelWattage} onChange={(e) => setPanelWattage(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="350" className="bg-[#1A1A1F] text-white">350W (Standard)</option>
            <option value="400" className="bg-[#1A1A1F] text-white">400W (Premium)</option>
            <option value="450" className="bg-[#1A1A1F] text-white">450W (Max Efficiency)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Target Bill Offset (%)</label>
          <select value={offsetTarget} onChange={(e) => setOffsetTarget(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="80" className="bg-[#1A1A1F] text-white">80% Offset</option>
            <option value="100" className="bg-[#1A1A1F] text-white">100% Offset (Zero Bill)</option>
            <option value="120" className="bg-[#1A1A1F] text-white">120% Offset (Add future EVs/AC)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center border-t-4 border-t-yellow-500">
             <div className="text-sm text-white/60 mb-2">Required System Size</div>
             <div className="text-3xl font-bold text-yellow-400">{results.systemSizeKw.toFixed(1)} kW</div>
             <div className="text-xs text-white/50 mt-2">Provides {Math.round(results.monthlyKwh)} kWh/month</div>
          </div>
          
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500 bg-blue-500/5">
             <div className="text-sm text-white/60 mb-2">Number of Panels</div>
             <div className="text-5xl font-black text-blue-400 my-2">{results.panelCount}</div>
             <div className="text-xs text-white/50">{panelWattage}W Panels</div>
          </div>

          <div className="glass-card p-6 text-center border-t-4 border-t-green-500">
             <div className="text-sm text-white/60 mb-2">Roof Space Required</div>
             <div className="text-3xl font-bold text-green-400">{Math.round(results.sqftRequired)} <span className="text-lg">sq ft</span></div>
             <div className="text-xs text-white/50 mt-2">Unshaded, south/west facing ideal.</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
