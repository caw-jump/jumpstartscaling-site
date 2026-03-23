import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RoofReplacementCostCalculator() {
  const [squareFootage, setSquareFootage] = useState<string>('2000');
  const [material, setMaterial] = useState<string>('asphalt');
  const [pitch, setPitch] = useState<string>('medium');
  const [removalLayers, setRemovalLayers] = useState<string>('1');

  const [results, setResults] = useState<{
    lowBound: number;
    highBound: number;
    avgCost: number;
  } | null>(null);

  useEffect(() => {
    const sqft = Number(squareFootage) || 0;
    const layers = Number(removalLayers) || 1;

    let baseLow = 0;
    let baseHigh = 0;

    if (material === 'asphalt') { baseLow = 4.5; baseHigh = 6.5; }
    else if (material === 'metal') { baseLow = 9.0; baseHigh = 14.0; }
    else if (material === 'slate') { baseLow = 15.0; baseHigh = 25.0; }
    else if (material === 'tile') { baseLow = 10.0; baseHigh = 18.0; }

    let pitchMultiplier = 1.0;
    if (pitch === 'low') pitchMultiplier = 1.0;
    if (pitch === 'medium') pitchMultiplier = 1.15;
    if (pitch === 'high') pitchMultiplier = 1.35;

    // Additional tear-off cost per sqft for extra layers
    const removalCost = (layers - 1) * 1.5;

    if (sqft > 0) {
      const low = sqft * (baseLow * pitchMultiplier + removalCost);
      const high = sqft * (baseHigh * pitchMultiplier + removalCost);
      
      setResults({
        lowBound: low,
        highBound: high,
        avgCost: (low + high) / 2
      });
    } else {
      setResults(null);
    }
  }, [squareFootage, material, pitch, removalLayers]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Roof Size (Square Footage)</label>
          <input type="number" value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">Approx 1.5x the floor sqft</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Roofing Material</label>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="asphalt">Asphalt Shingles (Standard)</option>
            <option value="metal">Metal (Standing Seam)</option>
            <option value="tile">Clay / Concrete Tile</option>
            <option value="slate">Natural Slate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Roof Pitch (Steepness)</label>
          <select value={pitch} onChange={(e) => setPitch(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="low">Low Pitch (Walkable)</option>
            <option value="medium">Medium Pitch (Standard)</option>
            <option value="high">High Pitch (Steep / Needs Harness)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Old Layers to Tear Off</label>
          <select value={removalLayers} onChange={(e) => setRemovalLayers(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="1">1 Layer</option>
            <option value="2">2 Layers</option>
            <option value="3">3 Layers (Requires deep tear-off)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 border-t-4 border-t-blue-500 text-center">
             <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Estimated 2026 Replacement Cost</div>
             <div className="text-5xl font-black text-blue-400 mb-2">{formatCurrency(results.lowBound)} - {formatCurrency(results.highBound)}</div>
             <div className="text-sm text-white/50 mt-4 pt-4 border-t border-white/10">
                National Average Estimate: <strong className="text-white">{formatCurrency(results.avgCost)}</strong><br/>
                <span className="text-xs italic mt-1 block">Includes materials, labor, tear-off, and disposal fees.</span>
             </div>
        </motion.div>
      )}
    </motion.div>
  );
}
