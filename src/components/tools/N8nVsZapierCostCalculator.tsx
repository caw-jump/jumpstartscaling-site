import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function N8nVsZapierCostCalculator() {
  const [tasksPerMonth, setTasksPerMonth] = useState<string>('50000');
  
  const [results, setResults] = useState<{
    zapierCost: number;
    n8nCost: number;
    annualSavings: number;
  } | null>(null);

  useEffect(() => {
    const tasks = Number(tasksPerMonth) || 0;

    if (tasks > 0) {
      // Zapier rough pricing logic (Professional/Team interpolation)
      let zapCost = 0;
      if (tasks <= 750) zapCost = 30;
      else if (tasks <= 1500) zapCost = 40;
      else if (tasks <= 2000) zapCost = 60;
      else if (tasks <= 5000) zapCost = 90;
      else if (tasks <= 10000) zapCost = 130;
      else if (tasks <= 50000) zapCost = 400;
      else if (tasks <= 100000) zapCost = 700;
      else if (tasks <= 500000) zapCost = 1500;
      else zapCost = 3000; // enterprise custom over 500k

      // n8n Self-Hosted equivalent costs
      // Base $20 DigitalOcean droplet or AWS EC2 handles up to 50k
      // Base $40 handles ~100k
      // Base $80 handles ~500k
      let nCost = 20; 
      if (tasks > 100000) nCost = 40;
      if (tasks > 500000) nCost = 80;

      const monthlySavings = zapCost - nCost;
      
      setResults({
        zapierCost: zapCost,
        n8nCost: nCost,
        annualSavings: monthlySavings * 12
      });
    } else {
      setResults(null);
    }
  }, [tasksPerMonth]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="bg-[#1A1A1F] p-8 rounded-2xl mb-8 border border-white/10 text-center">
        <label className="block text-lg font-bold text-white mb-4">Estimated Monthly Tasks / Executions</label>
        <input 
          type="range" 
          min="1000" 
          max="500000" 
          step="1000"
          value={tasksPerMonth} 
          onChange={(e) => setTasksPerMonth(e.target.value)} 
          className="w-full max-w-xl mx-auto h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E8C677]" 
        />
        <div className="mt-6 text-5xl font-black text-white">{Number(tasksPerMonth).toLocaleString()}</div>
        <div className="text-white/50 text-sm mt-2">Zapier considers 1 action = 1 task. Complex flows burn 5-10 tasks per run.</div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-t-4 border-t-red-500 text-center">
               <div className="text-sm font-bold tracking-widest uppercase text-white/50 mb-2">Zapier (Cloud)</div>
               <div className="text-4xl font-black text-red-400 mb-1">{formatCurrency(results.zapierCost)}</div>
               <div className="text-xs text-white/40">/ month</div>
            </div>
            
            <div className="glass-card p-6 border-t-4 border-t-green-500 text-center">
               <div className="text-sm font-bold tracking-widest uppercase text-white/50 mb-2">n8n (Self-Hosted VPS)</div>
               <div className="text-4xl font-black text-green-400 mb-1">{formatCurrency(results.n8nCost)}</div>
               <div className="text-xs text-white/40">/ month</div>
            </div>
          </div>

          <div className="glass-card p-8 border border-[#E8C677] bg-[#E8C677]/5 text-center flex flex-col items-center">
             <div className="text-sm text-white/80 mb-2 uppercase tracking-wide">Money Wasted on Zapier Annually</div>
             <div className="text-6xl font-black text-[#E8C677] mb-4">{formatCurrency(results.annualSavings)}</div>
             <div className="text-white/60 text-sm mt-2 pt-4 w-full max-w-xl">
                Migrating to self-hosted n8n instantly returns {formatCurrency(results.annualSavings)} back to your bottom line every year. We build the architecture, you own the code forever.
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
