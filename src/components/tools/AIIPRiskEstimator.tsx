import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AIIPRiskEstimator() {
  const [contentType, setContentType] = useState<'original' | 'derived' | 'licensed'>('original');
  const [toolUse, setToolUse] = useState<'none' | 'assist' | 'full'>('assist');
  const [datasetScope, setDatasetScope] = useState<'curated' | 'web' | 'unknown'>('web');
  const [results, setResults] = useState<{ risk: string; score: number; recommendation: string } | null>(null);

  useEffect(() => {
    let score = 0;
    if (contentType === 'derived') score += 40;
    else if (contentType === 'licensed') score += 20;
    if (toolUse === 'full') score += 35;
    else if (toolUse === 'assist') score += 15;
    if (datasetScope === 'web') score += 30;
    else if (datasetScope === 'unknown') score += 25;
    const risk = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
    const recommendation =
      score >= 70
        ? 'Audit datasets, ensure licenses, consider legal review.'
        : score >= 40
          ? 'Document sources, verify tool T&Cs, add disclaimers.'
          : 'Low risk — maintain standard attribution practices.';
    setResults({ risk, score, recommendation });
  }, [contentType, toolUse, datasetScope]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-3">Content Type</label>
          <div className="flex flex-wrap gap-3">
            {(['original', 'derived', 'licensed'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setContentType(v)}
                className={`px-4 py-2 rounded-lg transition ${contentType === v ? 'bg-accent text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-3">AI Tool Use</label>
          <div className="flex flex-wrap gap-3">
            {(['none', 'assist', 'full'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setToolUse(v)}
                className={`px-4 py-2 rounded-lg transition ${toolUse === v ? 'bg-accent text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-3">Training Dataset</label>
          <div className="flex flex-wrap gap-3">
            {(['curated', 'web', 'unknown'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setDatasetScope(v)}
                className={`px-4 py-2 rounded-lg transition ${datasetScope === v ? 'bg-accent text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card p-6 flex justify-between items-center">
            <span className="text-white/60">Risk Level</span>
            <span className={`text-2xl font-bold ${results.risk === 'High' ? 'text-red-400' : results.risk === 'Medium' ? 'text-yellow-400' : 'text-accent'}`}>
              {results.risk} ({results.score})
            </span>
          </div>
          <div className="glass-card p-6">
            <div className="text-sm text-white/60 mb-2">Recommendation</div>
            <p className="text-lg text-white/95">{results.recommendation}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
