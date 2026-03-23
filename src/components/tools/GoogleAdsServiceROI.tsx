import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GoogleAdsServiceROI() {
  const [adSpend, setAdSpend] = useState<string>('3000');
  const [cpc, setCpc] = useState<string>('15');
  const [landingPageConv, setLandingPageConv] = useState<string>('8'); // 8%
  const [salesCloseRate, setSalesCloseRate] = useState<string>('25'); // 25%
  const [avgTicketSize, setAvgTicketSize] = useState<string>('8500'); // $8500 roof or HVAC
  const [profitMargin, setProfitMargin] = useState<string>('30'); // 30%

  const [results, setResults] = useState<{
    clicks: number;
    leads: number;
    deals: number;
    grossRevenue: number;
    netProfit: number;
    roi: number;
    cpl: number;
    cac: number;
  } | null>(null);

  useEffect(() => {
    const spend = Number(adSpend) || 0;
    const costPerClick = Number(cpc) || 0;
    const lpConv = Number(landingPageConv) / 100 || 0;
    const closeRate = Number(salesCloseRate) / 100 || 0;
    const ticket = Number(avgTicketSize) || 0;
    const margin = Number(profitMargin) / 100 || 0;

    if (spend > 0 && costPerClick > 0) {
      const clicks = spend / costPerClick;
      const leads = clicks * lpConv;
      const deals = leads * closeRate;
      
      const revenue = deals * ticket;
      const netProfitFromSales = revenue * margin;
      const trueNetProfit = netProfitFromSales - spend;
      
      const returnOnInvestment = spend > 0 ? (trueNetProfit / spend) * 100 : 0;
      const costPerLead = leads > 0 ? spend / leads : 0;
      const customerAcquisitionCost = deals > 0 ? spend / deals : 0;

      setResults({
        clicks,
        leads,
        deals,
        grossRevenue: revenue,
        netProfit: trueNetProfit,
        roi: returnOnInvestment,
        cpl: costPerLead,
        cac: customerAcquisitionCost
      });
    } else {
      setResults(null);
    }
  }, [adSpend, cpc, landingPageConv, salesCloseRate, avgTicketSize, profitMargin]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Ad Spend ($)</label>
          <input type="number" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Cost Per Click ($)</label>
          <input type="number" value={cpc} onChange={(e) => setCpc(e.target.value)} step="0.5" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">High-intent service niches are $15-$50 CPC.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Website Conversion Rate (%)</label>
          <input type="number" value={landingPageConv} onChange={(e) => setLandingPageConv(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">% of traffic that turns into a lead.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Sales Close Rate (%)</label>
          <input type="number" value={salesCloseRate} onChange={(e) => setSalesCloseRate(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">% of leads that sign a contract.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Average Job Ticket Size ($)</label>
          <input type="number" value={avgTicketSize} onChange={(e) => setAvgTicketSize(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Net Profit Margin %</label>
          <input type="number" value={profitMargin} onChange={(e) => setProfitMargin(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white" />
          <p className="text-xs text-white/50 mt-1">After materials & labor, your take-home.</p>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
             <div className="glass-card p-4 text-center bg-black/20 border-t-2 border-white/10">
               <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Generated Leads</div>
               <div className="text-2xl font-bold text-white">{Math.round(results.leads)}</div>
               <div className="text-xs text-blue-400 mt-1">{formatCurrency(results.cpl)} CPL</div>
             </div>
             <div className="glass-card p-4 text-center bg-black/20 border-t-2 border-white/10">
               <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Closed Deals</div>
               <div className="text-2xl font-bold text-white">{results.deals.toFixed(1)}</div>
               <div className="text-xs text-red-400 mt-1">{formatCurrency(results.cac)} CAC</div>
             </div>
             <div className="glass-card p-4 text-center bg-black/20 border-t-2 border-white/10">
               <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Gross Revenue</div>
               <div className="text-2xl font-bold text-white">{formatCurrency(results.grossRevenue)}</div>
               <div className="text-xs text-white/40 mt-1">Top Line</div>
             </div>
          </div>

          <div className="glass-card p-8 text-center" style={{ borderColor: results.roi > 0 ? '#10B981' : '#EF4444' }}>
             <div className="text-sm text-white/60 mb-2 uppercase tracking-wide">Actual Net Profit from Ad Spend</div>
             <div className={`text-5xl font-black mb-2 ${results.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(results.netProfit)}
             </div>
             <div className="text-white/80 mt-2">
               True Cash ROI: <strong className={results.roi > 0 ? 'text-green-400' : 'text-red-400'}>{results.roi.toFixed(1)}%</strong>
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
