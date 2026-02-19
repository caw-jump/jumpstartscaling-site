import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CompanySalesComparison() {
  const [companyA, setCompanyA] = useState<string>('717');
  const [companyB, setCompanyB] = useState<string>('713');
  const [growthA, setGrowthA] = useState<string>('12');
  const [growthB, setGrowthB] = useState<string>('5');
  const [years, setYears] = useState(5);
  const [projections, setProjections] = useState<Array<{ year: number; a: number; b: number }>>([]);

  useEffect(() => {
    const a = Number(companyA) * 1e9;
    const b = Number(companyB) * 1e9;
    const gA = Number(growthA) / 100 || 0;
    const gB = Number(growthB) / 100 || 0;
    const data = [];
    let valA = a;
    let valB = b;
    for (let y = 0; y <= years; y++) {
      data.push({ year: y, a: valA, b: valB });
      valA *= 1 + gA;
      valB *= 1 + gB;
    }
    setProjections(data);
  }, [companyA, companyB, growthA, growthB, years]);

  const formatB = (n: number) => `${(n / 1e9).toFixed(1)}B`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Company A</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Revenue ($B)</label>
              <input
                type="number"
                value={companyA}
                onChange={(e) => setCompanyA(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Growth %</label>
              <input
                type="number"
                value={growthA}
                onChange={(e) => setGrowthA(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
              />
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Company B</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Revenue ($B)</label>
              <input
                type="number"
                value={companyB}
                onChange={(e) => setCompanyB(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Growth %</label>
              <input
                type="number"
                value={growthB}
                onChange={(e) => setGrowthB(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {projections.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-3">Year</th>
                <th className="py-3">Company A</th>
                <th className="py-3">Company B</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((row) => (
                <tr key={row.year} className="border-b border-white/10">
                  <td className="py-2">{row.year === 0 ? 'Now' : `Year ${row.year}`}</td>
                  <td className="py-2 font-medium">{formatB(row.a)}</td>
                  <td className="py-2 text-accent">{formatB(row.b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
