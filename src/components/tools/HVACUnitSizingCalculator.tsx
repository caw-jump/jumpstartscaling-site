import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HVACUnitSizingCalculator() {
  const [squareFootage, setSquareFootage] = useState<string>('2000');
  const [climateZone, setClimateZone] = useState<string>('zone2'); 
  const [ceilingHeight, setCeilingHeight] = useState<string>('8');
  const [insulation, setInsulation] = useState<string>('average');

  const [results, setResults] = useState<{
    btus: number;
    tonnage: number;
    recommendedSize: string;
  } | null>(null);

  useEffect(() => {
    const sqft = Number(squareFootage) || 0;
    const height = Number(ceilingHeight) || 0;

    if (sqft > 0) {
      // Base BTUs per SqFt based on Climate Zone (1 is hot south, 5 is cold north)
      // We'll use rough averages for cooling load
      let baseBtuPerSqft = 25;
      if (climateZone === 'zone1') baseBtuPerSqft = 30; // FL, TX, AZ
      if (climateZone === 'zone2') baseBtuPerSqft = 25; // GA, SC, TN
      if (climateZone === 'zone3') baseBtuPerSqft = 22; // VA, NC, KY
      if (climateZone === 'zone4') baseBtuPerSqft = 20; // NY, PA, OH
      if (climateZone === 'zone5') baseBtuPerSqft = 18; // ME, MN, WA

      // Volume multiplier if ceilings are taller than 8ft std
      let volumeMultiplier = 1.0;
      if (height > 8) {
        volumeMultiplier = 1 + ((height - 8) * 0.1); // add 10% per extra foot
      }

      // Insulation multiplier
      let insulationMultiplier = 1.0;
      if (insulation === 'poor') insulationMultiplier = 1.2; // needs 20% more cooling
      if (insulation === 'excellent') insulationMultiplier = 0.85; // highly efficient

      const requiredBtus = sqft * baseBtuPerSqft * volumeMultiplier * insulationMultiplier;
      const tonnage = requiredBtus / 12000; // 12,000 BTUs = 1 Ton of cooling
      
      // Round to nearest 0.5 Ton (common AC sizes: 2.0, 2.5, 3.0, 3.5, 4.0, 5.0)
      let recommendedTone = Math.ceil(tonnage * 2) / 2;
      if (recommendedTone < 1.5) recommendedTone = 1.5; // smallest standard central AC
      if (recommendedTone > 5.0) recommendedTone = 5.0; // max residential size, need 2 units if >5

      let recSizeStr = `${recommendedTone.toFixed(1)} Tons`;
      if (tonnage > 5.0) {
        recSizeStr = "Two Units Required (Max 5.0 Ton)";
      }

      setResults({
        btus: requiredBtus,
        tonnage: tonnage,
        recommendedSize: recSizeStr
      });
    } else {
      setResults(null);
    }
  }, [squareFootage, climateZone, ceilingHeight, insulation]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Home Square Footage</label>
          <input type="number" value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Climate Region</label>
          <select value={climateZone} onChange={(e) => setClimateZone(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="zone1">Zone 1: Very Hot (TX, FL, AZ)</option>
            <option value="zone2">Zone 2: Hot/Humid (GA, AL, SC)</option>
            <option value="zone3">Zone 3: Moderate (VA, NC, MO)</option>
            <option value="zone4">Zone 4: Cool (NY, PA, OH)</option>
            <option value="zone5">Zone 5: Cold (ME, MN, ND)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Primary Ceiling Height (ft)</label>
          <select value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="8">8 ft (Standard)</option>
            <option value="9">9 ft</option>
            <option value="10">10 ft</option>
            <option value="12">12+ ft (Vaulted)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Insulation & Window Quality</label>
          <select value={insulation} onChange={(e) => setInsulation(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="poor">Poor (Older home, drafty windows)</option>
            <option value="average">Average (Standard 1990s+ build)</option>
            <option value="excellent">Excellent (New build, spray foam)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-t-4 border-t-blue-500 text-center">
             <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Required Capacity</div>
             <div className="text-4xl font-black text-blue-400 mb-2">{Math.round(results.btus).toLocaleString()} <span className="text-xl">BTUs</span></div>
          </div>

          <div className="glass-card p-8 border-t-4 border-t-[#E8C677] text-center bg-black/20">
             <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Recommended AC Unit Size</div>
             <div className="text-5xl font-black text-[#E8C677]">{results.recommendedSize}</div>
             <div className="text-xs text-white/50 mt-4 border-t border-white/10 pt-3">
               Note: Oversizing your AC leads to humidity issues and short-cycling. Never guess the tonnage.
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
