import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EcommerceROASTargetCalculator() {
  const [sellingPrice, setSellingPrice] = useState<string>('120');
  const [cogs, setCogs] = useState<string>('30');
  const [shippingFulfillment, setShippingFulfillment] = useState<string>('15');
  const [paymentProcessingRate, setPaymentProcessingRate] = useState<string>('2.9');

  const [results, setResults] = useState<{
    grossMargin: number;
    grossMarginPercent: number;
    breakEvenROAS: number;
    targetCPA: number;
  } | null>(null);

  useEffect(() => {
    const price = Number(sellingPrice) || 0;
    const cost = Number(cogs) || 0;
    const shipping = Number(shippingFulfillment) || 0;
    const processingRate = Number(paymentProcessingRate) || 0;

    if (price > 0) {
      const processingFee = price * (processingRate / 100) + 0.30; // standard 2.9% + 30 cents
      const totalFulfillmentCost = cost + shipping + processingFee;
      
      const grossMargin = price - totalFulfillmentCost;
      const grossMarginPercent = (grossMargin / price) * 100;
      
      const breakEvenROAS = grossMargin > 0 ? (price / grossMargin) : 0;
      const targetCPA = grossMargin > 0 ? grossMargin : 0;

      setResults({ grossMargin, grossMarginPercent, breakEvenROAS, targetCPA });
    } else {
      setResults(null);
    }
  }, [sellingPrice, cogs, shippingFulfillment, paymentProcessingRate]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Retail Selling Price ($)</label>
          <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Cost of Goods Sold (COGS) ($)</label>
          <input type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Shipping & Packaging ($)</label>
          <input type="number" value={shippingFulfillment} onChange={(e) => setShippingFulfillment(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Payment Fee (%)</label>
          <input type="number" step="0.1" value={paymentProcessingRate} onChange={(e) => setPaymentProcessingRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && results.grossMargin <= 0 && (
         <div className="p-4 mb-6 bg-red-500/20 rounded-xl border border-red-500/50 text-red-100 flex items-center gap-4">
           <div>⚠️</div>
           <p className="text-sm"><strong>Unprofitable Product:</strong> This product costs more to fulfill than it sells for before spending a dollar on ads. Raise prices or source cheaper goods immediately.</p>
         </div>
      )}

      {results && results.grossMargin > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-t-4 border-t-blue-500 text-center flex flex-col justify-center">
             <div className="text-sm text-white/60 mb-1">Gross Profit Margin</div>
             <div className="text-4xl font-black text-blue-400">{results.grossMarginPercent.toFixed(1)}%</div>
             <div className="text-xl font-bold mt-2">{formatCurrency(results.grossMargin)}</div>
             <div className="text-xs text-white/50 mt-1">Per Unit Sold</div>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-[#E8C677] text-center flex flex-col justify-center relative">
             <div className="text-sm text-white/60 mb-2">Break-Even CPA</div>
             <div className="text-5xl font-black gradient-text">{formatCurrency(results.targetCPA)}</div>
             <div className="text-xs text-white/50 mt-4 px-2">
                 You can spend exactly {formatCurrency(results.targetCPA)} on Facebook/Google to acquire a sale without going negative.
             </div>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-red-500 text-center flex flex-col justify-center">
             <div className="text-sm text-white/60 mb-2">Minimum Break-Even ROAS</div>
             <div className="text-5xl font-black text-red-400">{results.breakEvenROAS.toFixed(2)}x</div>
             <div className="text-xs text-white/50 mt-4 px-2">
                 Your Ads Manager MUST report at least a {results.breakEvenROAS.toFixed(2)} Return on Ad Spend just to break even mathematically.
             </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
