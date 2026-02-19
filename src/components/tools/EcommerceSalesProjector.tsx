import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EcommerceSalesProjector() {
  const [sales, setSales] = useState<string>('100000000');
  const [onlinePct, setOnlinePct] = useState<string>('24');
  const [growthRate, setGrowthRate] = useState<string>('15');
  const [quarters, setQuarters] = useState(8);
  const [projections, setProjections] = useState<Array<{ q: number; total: number; online: number }>>([]);

  useEffect(() => {
    const base = Number(sales) || 0;
    const onlinePctVal = Number(onlinePct) / 100 || 0;
    const growth = Number(growthRate) / 100 || 0;
    const data = [];
    let total = base;
    for (let q = 1; q <= quarters; q++) {
      total = total * (1 + growth);
      const online = total * (onlinePctVal + q * 0.01);
      data.push({ q, total, online });
    }
    setProjections(data);
  }, [sales, onlinePct, growthRate, quarters]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Current Sales ($)</label>
          <input
            type="number"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Online %</label>
          <input
            type="number"
            value={onlinePct}
            onChange={(e) => setOnlinePct(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Growth Rate %</label>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Quarters</label>
          <select
            value={quarters}
            onChange={(e) => setQuarters(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none transition text-white"
          >
            {[4, 6, 8, 12].map((n) => (
              <option key={n} value={n} className="bg-gray-900">
                {n} quarters
              </option>
            ))}
          </select>
        </div>
      </div>

      {projections.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-3 text-white/95">Quarter</th>
                <th className="py-3 text-white/95">Total Revenue</th>
                <th className="py-3 text-white/95">Online</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((row) => (
                <tr key={row.q} className="border-b border-white/10">
                  <td className="py-3 text-white/90">Q{row.q}</td>
                  <td className="py-3 font-medium text-white/95">{formatCurrency(row.total)}</td>
                  <td className="py-3 text-accent">{formatCurrency(row.online)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
