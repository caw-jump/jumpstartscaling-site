import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoyaltyRewardsOptimizer() {
  const [flights, setFlights] = useState<string>('12');
  const [miles, setMiles] = useState<string>('50000');
  const [cardSpend, setCardSpend] = useState<string>('30000');
  const [hasCard, setHasCard] = useState(true);
  const [cardDiscount, setCardDiscount] = useState<string>('10');
  const [results, setResults] = useState<{ baseMiles: number; boostedMiles: number; discount: number } | null>(null);

  useEffect(() => {
    const f = Number(flights) || 0;
    const m = Number(miles) || 0;
    const s = Number(cardSpend) || 0;
    const d = Number(cardDiscount) / 100 || 0;
    const baseMiles = m + f * 5000;
    const boostedMiles = hasCard ? baseMiles * (1 + d) + s * 0.02 : baseMiles;
    const discount = hasCard ? d * 100 : 0;
    setResults({ baseMiles, boostedMiles, discount });
  }, [flights, miles, cardSpend, hasCard, cardDiscount]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Annual Flights</label>
          <input
            type="number"
            value={flights}
            onChange={(e) => setFlights(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Base Miles</label>
          <input
            type="number"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Card Spend ($)</label>
          <input
            type="number"
            value={cardSpend}
            onChange={(e) => setCardSpend(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer text-white/95">
            <input type="checkbox" checked={hasCard} onChange={(e) => setHasCard(e.target.checked)} className="rounded" />
            <span>Co-branded cardholder</span>
          </label>
          {hasCard && (
            <div>
              <label className="block text-sm text-white/95 mb-2">Points Discount %</label>
              <input
                type="number"
                value={cardDiscount}
                onChange={(e) => setCardDiscount(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent focus:outline-none text-white"
              />
            </div>
          )}
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Base Miles</div>
            <div className="text-2xl font-bold text-accent">{results.baseMiles.toLocaleString()}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Boosted Miles</div>
            <div className="text-2xl font-bold gradient-text">{results.boostedMiles.toLocaleString()}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-1">Card Bonus</div>
            <div className="text-2xl font-bold text-accent">+{results.discount}%</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
