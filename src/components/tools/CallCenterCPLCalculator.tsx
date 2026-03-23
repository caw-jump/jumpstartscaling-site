import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CallCenterCPLCalculator() {
  const [agents, setAgents] = useState<string>('5');
  const [hourlyWage, setHourlyWage] = useState<string>('15');
  const [hoursPerDay, setHoursPerDay] = useState<string>('8');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5');
  
  const [softwareCosts, setSoftwareCosts] = useState<string>('500'); // Monthly
  const [dataCosts, setDataCosts] = useState<string>('1000'); // Monthly

  const [monthlyLeads, setMonthlyLeads] = useState<string>('150');
  const [monthlySales, setMonthlySales] = useState<string>('15');

  const [results, setResults] = useState<{
    totalLabor: number;
    totalCost: number;
    cpl: number;
    cpa: number;
  } | null>(null);

  useEffect(() => {
    const a = Number(agents) || 0;
    const wage = Number(hourlyWage) || 0;
    const hrs = Number(hoursPerDay) || 0;
    const days = Number(daysPerWeek) || 0;
    
    const sw = Number(softwareCosts) || 0;
    const data = Number(dataCosts) || 0;
    const leads = Number(monthlyLeads) || 0;
    const sales = Number(monthlySales) || 0;

    if (a > 0 && wage > 0 && hrs > 0 && days > 0 && leads > 0) {
      const hoursPerMonth = hrs * days * 4.33; // avg weeks in month
      const totalLabor = a * wage * hoursPerMonth;
      const totalCost = totalLabor + sw + data;
      
      const cpl = totalCost / leads;
      const cpa = sales > 0 ? (totalCost / sales) : 0;
      
      setResults({ totalLabor, totalCost, cpl, cpa });
    } else {
      setResults(null);
    }
  }, [agents, hourlyWage, hoursPerDay, daysPerWeek, softwareCosts, dataCosts, monthlyLeads, monthlySales]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="lg:col-span-4 pb-2 border-b border-white/10 text-sm font-bold text-white/60">Campaign Inputs (Monthly)</div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Number of Callers</label>
          <input type="number" value={agents} onChange={(e) => setAgents(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Agent Wage ($/hr)</label>
          <input type="number" value={hourlyWage} onChange={(e) => setHourlyWage(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Hours per Day</label>
          <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Days per Week</label>
          <input type="number" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>

        <div className="lg:col-span-2 mt-4">
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Software Costs ($) <span className="text-white/40 text-xs font-normal">(Dialer, CRM)</span></label>
          <input type="number" value={softwareCosts} onChange={(e) => setSoftwareCosts(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div className="lg:col-span-2 mt-4">
          <label className="block text-sm font-medium text-white/95 mb-2">Monthly Lead/Data Costs ($) <span className="text-white/40 text-xs font-normal">(Skip Tracing, Lists)</span></label>
          <input type="number" value={dataCosts} onChange={(e) => setDataCosts(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>

        <div className="lg:col-span-4 pb-2 border-b border-white/10 text-sm font-bold text-white/60 mt-4">Campaign Output (Monthly)</div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-2">Total Generated Leads / Appointments</label>
          <input type="number" value={monthlyLeads} onChange={(e) => setMonthlyLeads(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-white/95 mb-2">Total Closed Won Deals (Optional)</label>
          <input type="number" value={monthlySales} onChange={(e) => setMonthlySales(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center border-t-4 border-t-red-500">
             <div className="text-sm text-white/60 mb-2">Total Monthly Overhead</div>
             <div className="text-3xl font-bold text-red-400">{formatCurrency(results.totalCost)}</div>
             <div className="text-xs text-white/50 mt-2">Labor accounts for {formatCurrency(results.totalLabor)}</div>
          </div>
          
          <div className="glass-card p-6 text-center border-t-4 border-t-blue-500">
             <div className="text-sm text-white/60 mb-2">Cost Per Lead (CPL)</div>
             <div className="text-4xl font-black text-blue-400">{formatCurrency(results.cpl)}</div>
             <div className="text-xs text-white/50 mt-4 leading-relaxed">
                 The fully burdened cost to generate a single qualified appointment.
             </div>
          </div>

          <div className={`glass-card p-6 text-center border-t-4 ${results.cpa > 0 ? 'border-t-[#E8C677]' : 'border-t-gray-600 opacity-50'}`}>
             <div className="text-sm text-white/60 mb-2">Cost Per Acquisition (CPA)</div>
             <div className="text-4xl font-black text-[#E8C677]">{results.cpa > 0 ? formatCurrency(results.cpa) : 'N/A'}</div>
             <div className="text-xs text-white/50 mt-4 leading-relaxed">
                 The total actual cost to close one final deal.
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
