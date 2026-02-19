import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AIMusicRoyaltyCalculator() {
  const [trackLength, setTrackLength] = useState<string>('30');
  const [streams, setStreams] = useState<string>('100000');
  const [genCostPerTrack, setGenCostPerTrack] = useState<string>('0.50');
  const [results, setResults] = useState<{ royalty: number; cost: number; net: number } | null>(null);

  useEffect(() => {
    const len = Number(trackLength) || 0;
    const s = Number(streams) || 0;
    const cost = Number(genCostPerTrack) || 0;
    if (len > 0 && s >= 0) {
      const royaltyPerStream = 0.003; // approx $0.003 per stream
      const royalty = s * royaltyPerStream;
      const costTotal = cost;
      const net = royalty - costTotal;
      setResults({ royalty, cost: costTotal, net });
    } else {
      setResults(null);
    }
  }, [trackLength, streams, genCostPerTrack]);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Track Length (sec)</label>
          <input
            type="number"
            value={trackLength}
            onChange={(e) => setTrackLength(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Est. Streams</label>
          <input
            type="number"
            value={streams}
            onChange={(e) => setStreams(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">AI Gen Cost/Track ($)</label>
          <input
            type="number"
            value={genCostPerTrack}
            onChange={(e) => setGenCostPerTrack(e.target.value)}
            step="0.1"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Est. Royalty</div>
            <div className="text-2xl font-bold text-accent">{formatCurrency(results.royalty)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Gen Cost</div>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(results.cost)}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Net</div>
            <div className={`text-2xl font-bold ${results.net >= 0 ? 'text-accent' : 'text-red-400'}`}>{formatCurrency(results.net)}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
