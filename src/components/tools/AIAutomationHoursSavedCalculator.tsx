import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AIAutomationHoursSavedCalculator() {
  const [employees, setEmployees] = useState<string>('5');
  const [adminHours, setAdminHours] = useState<string>('3');
  const [hourlyWage, setHourlyWage] = useState<string>('25');
  const [automationEfficiency, setAutomationEfficiency] = useState<string>('80');

  const [results, setResults] = useState<{
    totalWastedHours: number;
    wastedPayroll: number;
    hoursRecovered: number;
    payrollSaved: number;
    annualROIPotential: number;
  } | null>(null);

  useEffect(() => {
    const reps = Number(employees) || 0;
    const hours = Number(adminHours) || 0;
    const wage = Number(hourlyWage) || 0;
    const efficiency = Number(automationEfficiency) / 100 || 0;

    if (reps > 0 && hours > 0 && wage > 0) {
      const dailyWastedHours = reps * hours;
      const weeklyWastedHours = dailyWastedHours * 5;
      const monthlyWastedHours = weeklyWastedHours * 4.33;
      
      const monthlyWastedPayroll = monthlyWastedHours * wage;
      
      const recoveredHours = monthlyWastedHours * efficiency;
      const payrollSaved = recoveredHours * wage;
      const annualROI = payrollSaved * 12;

      setResults({
        totalWastedHours: monthlyWastedHours,
        wastedPayroll: monthlyWastedPayroll,
        hoursRecovered: recoveredHours,
        payrollSaved: payrollSaved,
        annualROIPotential: annualROI
      });
    } else {
      setResults(null);
    }
  }, [employees, adminHours, hourlyWage, automationEfficiency]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full text-white">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2"># of Employees</label>
          <input type="number" value={employees} onChange={(e) => setEmployees(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Admin Hours/Day</label>
          <input type="number" value={adminHours} onChange={(e) => setAdminHours(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">Avg Hourly Wage ($)</label>
          <input type="number" value={hourlyWage} onChange={(e) => setHourlyWage(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-accent text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">AI Efficiency Goal (%)</label>
          <select value={automationEfficiency} onChange={(e) => setAutomationEfficiency(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/20 rounded-xl focus:border-accent text-white">
            <option value="50" className="bg-[#1A1A1F] text-white">50% (Partial Automation)</option>
            <option value="80" className="bg-[#1A1A1F] text-white">80% (LLM Integration)</option>
            <option value="100" className="bg-[#1A1A1F] text-white">100% (Full Replacement)</option>
          </select>
        </div>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-t-4 border-t-red-500 bg-red-500/5 text-center">
               <div className="text-sm font-bold tracking-widest uppercase text-white/80 mb-2">Current Payroll Burn</div>
               <div className="text-3xl font-black text-red-400">{formatCurrency(results.wastedPayroll)} <span className="text-lg">/mo</span></div>
               <div className="text-xs text-white/50 mt-2">Paying humans to do robot work ({Math.round(results.totalWastedHours)} hours)</div>
            </div>
            
            <div className="glass-card p-6 border-t-4 border-t-blue-500 bg-blue-500/5 text-center">
               <div className="text-sm font-bold tracking-widest uppercase text-white/80 mb-2">AI Payroll Recaptured</div>
               <div className="text-3xl font-black text-blue-400">{formatCurrency(results.payrollSaved)} <span className="text-lg">/mo</span></div>
               <div className="text-xs text-white/50 mt-2">Time re-allocated to revenue ({Math.round(results.hoursRecovered)} hours)</div>
            </div>
          </div>

          <div className="glass-card p-8 border border-[#E8C677] bg-[#1A1A1F] text-center">
             <div className="text-sm text-white/70 mb-2 uppercase tracking-wide">Total Annual Bottom-Line Impact</div>
             <div className="text-6xl font-black text-[#E8C677] mb-2">{formatCurrency(results.annualROIPotential)}</div>
             <p className="mt-4 text-white/60 text-sm max-w-xl mx-auto border-t border-white/10 pt-4">
               Every time your sales reps type notes into a CRM, manually format an invoice, or copy-paste an email, you light payroll on fire. Integrating OpenAI and n8n reclaims those hours.
             </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
