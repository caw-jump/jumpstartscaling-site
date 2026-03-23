import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BinanceLiquidationCalculator() {
  const [entryPrice, setEntryPrice] = useState<string>('60000');
  const [leverage, setLeverage] = useState<string>('10');
  const [quantity, setQuantity] = useState<string>('1');
  const [maintenanceMarginRate, setMaintenanceMarginRate] = useState<string>('0.5'); // Binance typically 0.5% for lower tiers
  const [isLong, setIsLong] = useState<boolean>(true);

  const [liqPrice, setLiqPrice] = useState<number | null>(null);

  useEffect(() => {
    const entry = Number(entryPrice) || 0;
    const lev = Number(leverage) || 0;
    const qty = Number(quantity) || 0;
    const mmr = Number(maintenanceMarginRate) || 0;

    if (entry > 0 && lev > 0 && qty > 0) {
      // Assuming Isolated Margin
      const initialMargin = (entry * qty) / lev;
      const mmrDecimal = mmr / 100;
      
      let price = 0;
      if (isLong) {
         // Long Liquidation Price = Entry - (Initial Margin - Maintenance Margin)
         // Derivation: Maintenance Margin = Liq * qty * MMR
         // Liq = (Entry * qty - Initial Margin) / (qty - qty * MMR)
         price = (entry * qty - initialMargin) / (qty * (1 - mmrDecimal));
      } else {
         // Short Liquidation Price: Initial Margin + Entry * qty = Liq * qty + Liq * qty * MMR
         // Liq = (Entry * qty + Initial Margin) / (qty * (1 + mmrDecimal))
         price = (entry * qty + initialMargin) / (qty * (1 + mmrDecimal));
      }
      setLiqPrice(price > 0 ? price : 0);
    } else {
      setLiqPrice(null);
    }
  }, [entryPrice, leverage, quantity, maintenanceMarginRate, isLong]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="flex gap-4 mb-8 justify-center">
        <button
          className={`flex-1 py-3 rounded-xl font-bold transition ${isLong ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          onClick={() => setIsLong(true)}
        >
          Long Position
        </button>
        <button
          className={`flex-1 py-3 rounded-xl font-bold transition ${!isLong ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          onClick={() => setIsLong(false)}
        >
          Short Position
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Entry Price ($)</label>
          <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Leverage (x)</label>
          <input type="number" value={leverage} onChange={(e) => setLeverage(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Position Size (Quantity)</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Maintenance Margin Rate (%)</label>
          <input type="number" value={maintenanceMarginRate} onChange={(e) => setMaintenanceMarginRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {liqPrice !== null && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="glass-card p-8 text-center border-t-4 border-t-red-500">
             <div className="text-sm text-white/60 mb-2">Estimated Liquidation Point</div>
             <div className="text-5xl font-black text-red-500">{formatCurrency(liqPrice)}</div>
             <div className="text-xs text-white/50 mt-4">Place your active stop-loss order slightly above (long) or below (short) this price.</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
